from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from datetime import datetime
from app.core.database import Base

class AudioFile(Base):
    """Model for storing audio file metadata"""
    __tablename__ = "audio_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content_type = Column(String, nullable=False)
    
    # Genre detection results
    detected_genre = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    is_copyrighted = Column(Boolean, default=False)
    
    # MinIO storage info
    bucket_name = Column(String, nullable=False)
    object_key = Column(String, nullable=False)
    
    # Timestamps
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
