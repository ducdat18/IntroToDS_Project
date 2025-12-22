from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AudioFileBase(BaseModel):
    filename: str
    original_filename: str
    file_size: int
    content_type: str
    detected_genre: Optional[str] = None
    confidence: Optional[float] = None
    bucket_name: str
    object_key: str

class AudioFileCreate(AudioFileBase):
    pass

class AudioFileResponse(AudioFileBase):
    id: int
    uploaded_at: datetime
    updated_at: datetime
    download_url: Optional[str] = None

    class Config:
        from_attributes = True

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
