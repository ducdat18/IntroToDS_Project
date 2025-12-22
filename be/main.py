from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import audio, search, health
from app.services.ml_service import ml_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(audio.router, prefix=settings.API_V1_STR, tags=["Audio"])
app.include_router(search.router, prefix=settings.API_V1_STR, tags=["Search"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and load model on startup"""
    logger.info("Initializing database...")
    Base.metadata.create_all(bind=engine)
    
    logger.info("Loading ML model...")
    ml_service.load_model()
    
    logger.info("Application started successfully")

@app.get("/")
async def root():
    return {
        "message": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)