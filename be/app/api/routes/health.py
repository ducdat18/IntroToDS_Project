from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.storage import minio_service
from app.services.ml_service import ml_service
from app.schemas.audio import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    model_loaded = ml_service.model is not None
    
    minio_connected = True
    try:
        minio_service.client.bucket_exists(minio_service.bucket_name)
    except:
        minio_connected = False
        
    db_connected = True
    try:
        db.execute(db.text("SELECT 1"))
    except:
        db_connected = False
        
    status = "healthy" if (model_loaded and minio_connected and db_connected) else "degraded"
    
    return HealthResponse(
        status=status,
        device=str(ml_service.device),
        model_loaded=model_loaded,
        minio_connected=minio_connected,
        database_connected=db_connected
    )
