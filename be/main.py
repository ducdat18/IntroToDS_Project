from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import torch
import os
import tempfile
import logging
from datetime import datetime
from slugify import slugify

from database import get_db, init_db, AudioFile
from minio_service import minio_service
from inference import inference

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Music Management & Genre Detection API",
    description="Upload, manage, and detect genres of audio files with MinIO storage",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "./models/best.pt")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
ALLOWED_EXTENSIONS = {".mp3", ".wav", ".ogg", ".flac", ".m4a"}
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 52428800))  # 50MB


# Response Models
class AudioFileResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_size: int
    content_type: str
    detected_genre: Optional[str]
    confidence: Optional[float]
    bucket_name: str
    object_key: str
    uploaded_at: str
    updated_at: str
    download_url: Optional[str] = None


class UploadResponse(BaseModel):
    message: str
    file_id: int
    filename: str
    detected_genre: Optional[str]
    confidence: Optional[float]


class SearchResponse(BaseModel):
    total: int
    files: List[AudioFileResponse]


class HealthResponse(BaseModel):
    status: str
    device: str
    model_loaded: bool
    minio_connected: bool
    database_connected: bool


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and MinIO on startup"""
    logger.info("Initializing database...")
    init_db()
    logger.info("Application started successfully")


# Helper functions
def validate_audio_file(filename: str) -> bool:
    """Validate audio file extension"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


# Removed copyright detection - keeping only genre classification


def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename using timestamp and slug"""
    name, ext = os.path.splitext(original_filename)
    slug = slugify(name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{slug}_{timestamp}{ext}"


# Endpoints
@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Music Management & Genre Detection API",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "upload": "/upload (POST)",
            "search": "/search (GET)",
            "get_file": "/files/{file_id} (GET)",
            "download": "/download/{file_id} (GET)",
            "delete": "/files/{file_id} (DELETE)",
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    model_exists = os.path.exists(MODEL_PATH)
    
    # Check MinIO connection
    minio_connected = True
    try:
        minio_service.client.bucket_exists(minio_service.bucket_name)
    except:
        minio_connected = False
    
    # Check database connection
    db_connected = True
    try:
        db.execute("SELECT 1")
    except:
        db_connected = False
    
    status = "healthy" if (model_exists and minio_connected and db_connected) else "degraded"
    
    return HealthResponse(
        status=status,
        device=str(DEVICE),
        model_loaded=model_exists,
        minio_connected=minio_connected,
        database_connected=db_connected
    )


@app.post("/upload", response_model=UploadResponse)
async def upload_audio(
    audio_file: UploadFile = File(..., description="Audio file to upload"),
    db: Session = Depends(get_db)
):
    """
    Upload an audio file to MinIO and detect its genre
    
    Args:
        audio_file: Audio file (mp3, wav, ogg, flac, m4a)
    
    Returns:
        Upload response with genre detection results
    """
    
    # Validate file
    if not audio_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not validate_audio_file(audio_file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    content = await audio_file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
        )
    
    await audio_file.seek(0)  # Reset file pointer
    
    # Check model exists
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(
            status_code=503,
            detail="Model checkpoint not found. Please train the model first."
        )
    
    temp_file = None
    try:
        # Generate unique filename
        unique_filename = generate_unique_filename(audio_file.filename)
        
        # Create temporary file for processing
        file_extension = os.path.splitext(audio_file.filename)[1]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension)
        temp_file.write(content)
        temp_file.close()
        
        # Run genre detection
        logger.info(f"Running genre detection for {audio_file.filename}")
        result = inference(
            audio_path=temp_file.name,
            model_checkpoint_path=MODEL_PATH,
            device=DEVICE
        )
        
        if result is None:
            logger.warning(f"Genre detection failed for {audio_file.filename}")
            detected_genre = None
            confidence = None
        else:
            detected_genre, confidence = result
            logger.info(f"Detected genre: {detected_genre} ({confidence:.2f}%)")
        
        # Upload to MinIO
        object_key = f"audio/{unique_filename}"
        
        with open(temp_file.name, 'rb') as f:
            success = minio_service.upload_fileobj(
                object_key=object_key,
                file_data=f,
                length=file_size,
                content_type=audio_file.content_type or "audio/mpeg"
            )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to upload file to storage")
        
        # Save metadata to database
        db_file = AudioFile(
            filename=unique_filename,
            original_filename=audio_file.filename,
            file_size=file_size,
            content_type=audio_file.content_type or "audio/mpeg",
            detected_genre=detected_genre,
            confidence=confidence,
            is_copyrighted=False,  # Not used anymore
            bucket_name=minio_service.bucket_name,
            object_key=object_key
        )
        
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        logger.info(f"Successfully uploaded {audio_file.filename} with ID {db_file.id}")
        
        return UploadResponse(
            message="File uploaded and processed successfully",
            file_id=db_file.id,
            filename=unique_filename,
            detected_genre=detected_genre,
            confidence=round(confidence, 2) if confidence else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.unlink(temp_file.name)
            except:
                pass


@app.get("/search", response_model=SearchResponse)
async def search_audio(
    genre: Optional[str] = Query(None, description="Filter by genre"),
    filename: Optional[str] = Query(None, description="Search by filename"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: Session = Depends(get_db)
):
    """
    Search and filter audio files
    
    Args:
        genre: Optional genre filter
        filename: Optional filename search
        limit: Maximum number of results
        offset: Number of results to skip
    
    Returns:
        List of matching audio files
    """
    
    query = db.query(AudioFile)
    
    # Apply filters
    if genre:
        query = query.filter(AudioFile.detected_genre.ilike(f"%{genre}%"))
    
    if filename:
        query = query.filter(AudioFile.original_filename.ilike(f"%{filename}%"))
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    files = query.offset(offset).limit(limit).all()
    
    # Convert to response model
    file_responses = []
    for file in files:
        file_dict = file.to_dict()
        file_dict["download_url"] = f"/download/{file.id}"
        file_responses.append(AudioFileResponse(**file_dict))
    
    return SearchResponse(
        total=total,
        files=file_responses
    )


@app.get("/files/{file_id}", response_model=AudioFileResponse)
async def get_file_info(
    file_id: int,
    db: Session = Depends(get_db)
):
    """
    Get information about a specific audio file
    
    Args:
        file_id: ID of the audio file
    
    Returns:
        Audio file information
    """
    
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_dict = file.to_dict()
    file_dict["download_url"] = f"/download/{file.id}"
    
    return AudioFileResponse(**file_dict)


@app.get("/stream/{file_id}")
async def stream_audio(
    file_id: int,
    db: Session = Depends(get_db)
):
    """
    Stream an audio file for playback in browser
    
    Args:
        file_id: ID of the audio file
    
    Returns:
        Streaming response with the audio file
    """
    
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Get file from MinIO
    try:
        response = minio_service.get_file(file.object_key)
        
        if not response:
            raise HTTPException(status_code=404, detail="File not found in storage")
        
        return StreamingResponse(
            response.stream(32*1024),
            media_type=file.content_type,
            headers={
                "Accept-Ranges": "bytes",
                "Content-Disposition": f'inline; filename="{file.original_filename}"',
                "Cache-Control": "public, max-age=3600",
            }
        )
    except Exception as e:
        logger.error(f"Error streaming file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to stream file")


@app.get("/download/{file_id}")
async def download_audio(
    file_id: int,
    db: Session = Depends(get_db)
):
    """
    Download an audio file
    
    Args:
        file_id: ID of the audio file
    
    Returns:
        Streaming response with the audio file
    """
    
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Get file from MinIO
    try:
        response = minio_service.get_file(file.object_key)
        
        if not response:
            raise HTTPException(status_code=404, detail="File not found in storage")
        
        return StreamingResponse(
            response.stream(32*1024),
            media_type=file.content_type,
            headers={
                "Content-Disposition": f'attachment; filename="{file.original_filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to download file")


@app.delete("/files/{file_id}")
async def delete_audio(
    file_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an audio file from both MinIO and database
    
    Args:
        file_id: ID of the audio file to delete
    
    Returns:
        Deletion confirmation
    """
    
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Delete from MinIO
        success = minio_service.delete_file(file.object_key)
        
        if not success:
            logger.warning(f"Failed to delete file from MinIO: {file.object_key}")
        
        # Delete from database
        db.delete(file)
        db.commit()
        
        logger.info(f"Deleted file with ID {file_id}")
        
        return {
            "message": "File deleted successfully",
            "file_id": file_id,
            "filename": file.original_filename
        }
        
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete file")


@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get statistics about uploaded files"""
    
    total_files = db.query(AudioFile).count()
    total_size = db.query(db.func.sum(AudioFile.file_size)).scalar() or 0
    
    # Genre distribution
    genre_counts = db.query(
        AudioFile.detected_genre,
        db.func.count(AudioFile.id)
    ).group_by(AudioFile.detected_genre).all()
    
    genre_distribution = {genre: count for genre, count in genre_counts if genre}
    
    return {
        "total_files": total_files,
        "total_size_bytes": total_size,
        "total_size_mb": round(total_size / 1024 / 1024, 2),
        "genre_distribution": genre_distribution
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

