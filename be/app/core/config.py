import os
from pydantic_settings import BaseSettings
from typing import Set

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Music Management & Genre Detection API"
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET_NAME: str = "music-files"
    MINIO_SECURE: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://musicapp:musicapp123@localhost:5433/music_metadata"
    
    # ML
    MODEL_PATH: str = "./checkpoints/best.pt"
    MAX_FILE_SIZE: int = 52428800  # 50MB
    ALLOWED_EXTENSIONS: Set[str] = {".mp3", ".wav", ".ogg", ".flac", ".m4a"}
    
    # Device
    DEVICE: str = "cuda" 
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
