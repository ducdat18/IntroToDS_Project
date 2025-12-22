from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import tempfile
import logging
from datetime import datetime
from slugify import slugify

from app.core.database import get_db
from app.core.config import settings
from app.models.audio import AudioFile
from app.schemas.audio import AudioFileResponse, UploadResponse
from app.services.storage import minio_service
from app.services.ml_service import ml_service

router = APIRouter()
logger = logging.getLogger(__name__)

def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename using timestamp and slug"""
    name, ext = os.path.splitext(original_filename)
    slug = slugify(name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{slug}_{timestamp}{ext}"

def validate_audio_file(filename: str) -> bool:
    """Validate audio file extension"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in settings.ALLOWED_EXTENSIONS

@router.post("/upload", response_model=UploadResponse)
async def upload_audio(
    audio_file: UploadFile = File(..., description="Audio file to upload"),
    db: Session = Depends(get_db)
):
    # Validate file
    if not audio_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not validate_audio_file(audio_file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    content = await audio_file.read()
    file_size = len(content)
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
        )
    
    await audio_file.seek(0)
    
    # Check if model is ready
    if ml_service.model is None:
         # Try loading it if not loaded (lazy load fallback, though startup load is preferred)
         if not ml_service.load_model():
            raise HTTPException(
                status_code=503,
                detail="Model not ready."
            )

    temp_file = None
    try:
        unique_filename = generate_unique_filename(audio_file.filename)
        
        # Create temporary file
        file_extension = os.path.splitext(audio_file.filename)[1]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension)
        temp_file.write(content)
        temp_file.close()
        
        # Inference
        logger.info(f"Running genre detection for {audio_file.filename}")
        result = ml_service.predict(temp_file.name)
        
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
            
        # Save to DB
        db_file = AudioFile(
            filename=unique_filename,
            original_filename=audio_file.filename,
            file_size=file_size,
            content_type=audio_file.content_type or "audio/mpeg",
            detected_genre=detected_genre,
            confidence=confidence,
            bucket_name=minio_service.bucket_name,
            object_key=object_key
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
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
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)

@router.get("/files/{file_id}", response_model=AudioFileResponse)
async def get_file_info(file_id: int, db: Session = Depends(get_db)):
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # We construct the response manually to include the dynamic download url if needed,
    # but with Pydantic's from_attributes=True, we can just return the model and add the url field.
    # However, download_url is computed.
    response = AudioFileResponse.model_validate(file)
    response.download_url = f"{settings.API_V1_STR}/download/{file.id}" 
    # Note: Using relative path logic or full URL depending on needs. 
    # Here I'm just hardcoding the path structure.
    return response

@router.get("/download/{file_id}")
async def download_audio(file_id: int, db: Session = Depends(get_db)):
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
        
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

@router.get("/stream/{file_id}")
async def stream_audio(file_id: int, db: Session = Depends(get_db)):
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
        
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

@router.delete("/files/{file_id}")
async def delete_audio(file_id: int, db: Session = Depends(get_db)):
    file = db.query(AudioFile).filter(AudioFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
        
    minio_service.delete_file(file.object_key)
    db.delete(file)
    db.commit()
    
    return {"message": "File deleted successfully", "file_id": file_id}
