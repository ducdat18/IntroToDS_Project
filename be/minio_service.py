from minio import Minio
from minio.error import S3Error
import os
from typing import Optional, BinaryIO
import logging

logger = logging.getLogger(__name__)


class MinIOService:
    """Service for interacting with MinIO object storage"""
    
    def __init__(self):
        self.endpoint = os.getenv("MINIO_ENDPOINT", "localhost:9000")
        self.access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME", "music-files")
        self.secure = os.getenv("MINIO_SECURE", "False").lower() == "true"
        
        # Initialize MinIO client
        self.client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=self.secure
        )
        
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
            raise
    
    def upload_file(self, object_key: str, file_path: str, content_type: str) -> bool:
        """
        Upload a file to MinIO
        
        Args:
            object_key: Key/path for the object in MinIO
            file_path: Local path to the file
            content_type: MIME type of the file
            
        Returns:
            bool: True if successful, False otherwise
        """
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
        """
        Upload a file object to MinIO
        
        Args:
            object_key: Key/path for the object in MinIO
            file_data: File-like object
            length: Size of the file in bytes
            content_type: MIME type of the file
            
        Returns:
            bool: True if successful, False otherwise
        """
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
        """
        Download a file from MinIO
        
        Args:
            object_key: Key/path of the object in MinIO
            file_path: Local path to save the file
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.client.fget_object(self.bucket_name, object_key, file_path)
            logger.info(f"Downloaded {object_key} from {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error downloading file: {e}")
            return False
    
    def get_file(self, object_key: str):
        """
        Get file object from MinIO
        
        Args:
            object_key: Key/path of the object in MinIO
            
        Returns:
            Response object with file data
        """
        try:
            return self.client.get_object(self.bucket_name, object_key)
        except S3Error as e:
            logger.error(f"Error getting file: {e}")
            return None
    
    def delete_file(self, object_key: str) -> bool:
        """
        Delete a file from MinIO
        
        Args:
            object_key: Key/path of the object in MinIO
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.client.remove_object(self.bucket_name, object_key)
            logger.info(f"Deleted {object_key} from {self.bucket_name}")
            return True
        except S3Error as e:
            logger.error(f"Error deleting file: {e}")
            return False
    
    def file_exists(self, object_key: str) -> bool:
        """
        Check if a file exists in MinIO
        
        Args:
            object_key: Key/path of the object in MinIO
            
        Returns:
            bool: True if exists, False otherwise
        """
        try:
            self.client.stat_object(self.bucket_name, object_key)
            return True
        except S3Error:
            return False
    
    def list_files(self, prefix: str = "") -> list:
        """
        List all files in the bucket
        
        Args:
            prefix: Optional prefix to filter files
            
        Returns:
            List of object names
        """
        try:
            objects = self.client.list_objects(self.bucket_name, prefix=prefix)
            return [obj.object_name for obj in objects]
        except S3Error as e:
            logger.error(f"Error listing files: {e}")
            return []
    
    def get_presigned_url(self, object_key: str, expires: int = 3600) -> Optional[str]:
        """
        Generate a presigned URL for temporary access to a file
        
        Args:
            object_key: Key/path of the object in MinIO
            expires: URL expiration time in seconds (default: 1 hour)
            
        Returns:
            Presigned URL or None if error
        """
        try:
            from datetime import timedelta
            url = self.client.presigned_get_object(
                self.bucket_name,
                object_key,
                expires=timedelta(seconds=expires)
            )
            return url
        except S3Error as e:
            logger.error(f"Error generating presigned URL: {e}")
            return None


# Global instance
minio_service = MinIOService()

