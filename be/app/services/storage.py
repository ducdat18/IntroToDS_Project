from minio import Minio
from minio.error import S3Error
from typing import Optional, BinaryIO
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class MinIOService:
    """Service for interacting with MinIO object storage"""
    
    def __init__(self):
        # Initialize MinIO client
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        
        # Ensure bucket exists
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                logger.info(f"Created bucket: {self.bucket_name}")
            else:
                logger.info(f"Bucket {self.bucket_name} already exists")
        except S3Error as e:
            logger.error(f"Error creating bucket: {e}")
            # Don't raise here to allow service startup even if MinIO is down momentarily,
            # health check will catch it.
            
    def upload_file(self, object_key: str, file_path: str, content_type: str) -> bool:
        """Upload a file to MinIO"""
        try:
            self.client.fput_object(
                self.bucket_name,
                object_key,
                file_path,
                content_type=content_type
            )
            logger.info(f"Uploaded {object_key} to {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error uploading file: {e}")
            return False
    
    def upload_fileobj(self, object_key: str, file_data: BinaryIO, 
                       length: int, content_type: str) -> bool:
        """Upload a file object to MinIO"""
        try:
            self.client.put_object(
                self.bucket_name,
                object_key,
                file_data,
                length,
                content_type=content_type
            )
            logger.info(f"Uploaded {object_key} to {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error uploading file: {e}")
            return False
    
    def download_file(self, object_key: str, file_path: str) -> bool:
        """Download a file from MinIO"""
        try:
            self.client.fget_object(self.bucket_name, object_key, file_path)
            logger.info(f"Downloaded {object_key} from {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error downloading file: {e}")
            return False
    
    def get_file(self, object_key: str):
        """Get file object from MinIO"""
        try:
            return self.client.get_object(self.bucket_name, object_key)
        except S3Error as e:
            logger.error(f"Error getting file: {e}")
            return None
    
    def delete_file(self, object_key: str) -> bool:
        """Delete a file from MinIO"""
        try:
            self.client.remove_object(self.bucket_name, object_key)
            logger.info(f"Deleted {object_key} from {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error deleting file: {e}")
            return False
    
    def file_exists(self, object_key: str) -> bool:
        """Check if a file exists in MinIO"""
        try:
            self.client.stat_object(self.bucket_name, object_key)
            return True
        except S3Error:
            return False
    
    def list_files(self, prefix: str = "") -> list:
        """List all files in the bucket"""
        try:
            objects = self.client.list_objects(self.bucket_name, prefix=prefix)
            return [obj.object_name for obj in objects]
        except S3Error as e:
            logger.error(f"Error listing files: {e}")
            return []

# Global instance
minio_service = MinIOService()
