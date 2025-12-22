from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.config import settings
from app.models.audio import AudioFile
from app.schemas.audio import SearchResponse, AudioFileResponse

router = APIRouter()

@router.get("/search", response_model=SearchResponse)
async def search_audio(
    genre: Optional[str] = Query(None, description="Filter by genre"),
    filename: Optional[str] = Query(None, description="Search by filename"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(AudioFile)
    
    if genre:
        query = query.filter(AudioFile.detected_genre.ilike(f"%{genre}%"))
    if filename:
        query = query.filter(AudioFile.original_filename.ilike(f"%{filename}%"))
        
    total = query.count()
    files = query.offset(offset).limit(limit).all()
    
    file_responses = []
    for file in files:
        resp = AudioFileResponse.model_validate(file)
        resp.download_url = f"{settings.API_V1_STR}/download/{file.id}"
        file_responses.append(resp)
        
    return SearchResponse(total=total, files=file_responses)

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    total_files = db.query(AudioFile).count()
    total_size = db.query(db.func.sum(AudioFile.file_size)).scalar() or 0
    
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
