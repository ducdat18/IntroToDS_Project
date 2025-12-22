# Music Management & Genre Detection API

A comprehensive FastAPI application that manages audio files with MinIO object storage, PostgreSQL database, and automatic genre detection using deep learning.

## 🌟 Features

- 🎵 **Upload Audio Files** - Upload audio files with automatic genre detection
- 🔍 **Search & Filter** - Search files by genre, filename, or copyright status
- 📥 **Download Files** - Stream audio files with proper content types
- 🗑️ **Delete Files** - Remove files from both storage and database
- 📊 **Statistics** - View upload statistics and genre distribution
- 🔒 **MinIO Storage** - Secure object storage with Docker
- 🗄️ **PostgreSQL Database** - Persistent metadata storage
- 🤖 **AI Genre Detection** - Automatic music genre classification

## 📋 Prerequisites

- Python 3.10+
- Docker & Docker Compose
- Virtual environment
- Trained model checkpoint at `./models/best.pt`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or for Fish shell:
source venv/bin/activate.fish

# Install requirements
pip install -r requirements.txt
```

### 2. Start Docker Services

```bash
# Make scripts executable
chmod +x start_services.sh start_api.sh stop_services.sh

# Start MinIO and PostgreSQL
./start_services.sh
```

This will start:
- **MinIO** on ports 9000 (API) and 9001 (Console)
- **PostgreSQL** on port 5432

### 3. Start the API Server

```bash
./start_api.sh
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Health Check

**GET** `/health`

Check API health and service connectivity.

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "device": "cuda:0",
  "model_loaded": true,
  "minio_connected": true,
  "database_connected": true
}
```

### Upload Audio

**POST** `/upload`

Upload an audio file with automatic genre detection.

```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "audio_file=@song.mp3"
```

**Response:**
```json
{
  "message": "File uploaded and processed successfully",
  "file_id": 1,
  "filename": "song_20231222_143025.mp3",
  "detected_genre": "Electronic",
  "confidence": 87.43,
  "is_copyrighted": true
}
```

### Search Audio Files

**GET** `/search`

Search and filter audio files.

**Query Parameters:**
- `genre` - Filter by genre
- `filename` - Search by filename
- `is_copyrighted` - Filter by copyright status (true/false)
- `limit` - Maximum results (default: 100)
- `offset` - Skip results (default: 0)

```bash
# Search all files
curl "http://localhost:8000/search"

# Search by genre
curl "http://localhost:8000/search?genre=Electronic"

# Search copyrighted files
curl "http://localhost:8000/search?is_copyrighted=true"

# Search with pagination
curl "http://localhost:8000/search?limit=10&offset=0"
```

**Response:**
```json
{
  "total": 25,
  "files": [
    {
      "id": 1,
      "filename": "song_20231222_143025.mp3",
      "original_filename": "song.mp3",
      "file_size": 3456789,
      "content_type": "audio/mpeg",
      "detected_genre": "Electronic",
      "confidence": 87.43,
      "is_copyrighted": true,
      "bucket_name": "music-files",
      "object_key": "audio/song_20231222_143025.mp3",
      "uploaded_at": "2023-12-22T14:30:25.123456",
      "updated_at": "2023-12-22T14:30:25.123456",
      "download_url": "/download/1"
    }
  ]
}
```

### Get File Information

**GET** `/files/{file_id}`

Get detailed information about a specific file.

```bash
curl "http://localhost:8000/files/1"
```

### Download Audio File

**GET** `/download/{file_id}`

Download an audio file.

```bash
curl -O -J "http://localhost:8000/download/1"
```

### Delete Audio File

**DELETE** `/files/{file_id}`

Delete a file from storage and database.

```bash
curl -X DELETE "http://localhost:8000/files/1"
```

**Response:**
```json
{
  "message": "File deleted successfully",
  "file_id": 1,
  "filename": "song.mp3"
}
```

### Get Statistics

**GET** `/stats`

Get upload statistics and genre distribution.

```bash
curl "http://localhost:8000/stats"
```

**Response:**
```json
{
  "total_files": 25,
  "total_size_bytes": 86423456,
  "total_size_mb": 82.41,
  "copyrighted_files": 18,
  "non_copyrighted_files": 7,
  "genre_distribution": {
    "Electronic": 10,
    "Pop": 8,
    "Rock": 5,
    "Jazz": 2
  }
}
```

## 🐍 Python Client Example

```python
import requests

# Upload a file
with open("song.mp3", "rb") as f:
    files = {"audio_file": f}
    response = requests.post("http://localhost:8000/upload", files=files)
    print(response.json())

# Search for electronic music
response = requests.get("http://localhost:8000/search?genre=Electronic")
files = response.json()["files"]
print(f"Found {len(files)} electronic tracks")

# Download a file
response = requests.get("http://localhost:8000/download/1")
with open("downloaded_song.mp3", "wb") as f:
    f.write(response.content)

# Delete a file
response = requests.delete("http://localhost:8000/files/1")
print(response.json())
```

## 🌐 JavaScript/TypeScript Example

```typescript
// Upload a file
const formData = new FormData();
formData.append('audio_file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadResponse.json();
console.log(uploadData);

// Search files
const searchResponse = await fetch('http://localhost:8000/search?genre=Electronic');
const searchData = await searchResponse.json();
console.log(`Found ${searchData.total} files`);

// Download file
const downloadResponse = await fetch(`http://localhost:8000/download/${fileId}`);
const blob = await downloadResponse.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'song.mp3';
a.click();

// Delete file
await fetch(`http://localhost:8000/files/${fileId}`, {
  method: 'DELETE'
});
```

## 🐳 Docker Services

### MinIO Console

Access MinIO console at http://localhost:9001

- **Username**: `minioadmin`
- **Password**: `minioadmin123`

### PostgreSQL

Connect to PostgreSQL:

```bash
psql -h localhost -p 5432 -U musicapp -d music_metadata
# Password: musicapp123
```

## 🛠️ Configuration

Environment variables (optional - defaults provided):

```bash
# MinIO Configuration
export MINIO_ENDPOINT=localhost:9000
export MINIO_ACCESS_KEY=minioadmin
export MINIO_SECRET_KEY=minioadmin123
export MINIO_BUCKET_NAME=music-files

# Database Configuration
export DATABASE_URL=postgresql://musicapp:musicapp123@localhost:5432/music_metadata

# Model Configuration
export MODEL_PATH=./models/best.pt

# Application Configuration
export MAX_FILE_SIZE=52428800  # 50MB
```

## 📊 Database Schema

```sql
CREATE TABLE audio_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR UNIQUE NOT NULL,
    original_filename VARCHAR NOT NULL,
    file_size INTEGER NOT NULL,
    content_type VARCHAR NOT NULL,
    detected_genre VARCHAR,
    confidence FLOAT,
    is_copyrighted BOOLEAN DEFAULT FALSE,
    bucket_name VARCHAR NOT NULL,
    object_key VARCHAR NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Troubleshooting

### Services not starting

```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs minio
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Model not found

Ensure your trained model checkpoint exists:

```bash
ls -lh models/best.pt
```

### Database connection error

Ensure PostgreSQL is running:

```bash
docker-compose ps postgres
```

### MinIO connection error

Ensure MinIO is running:

```bash
docker-compose ps minio
```

Check MinIO logs:

```bash
docker-compose logs minio
```

## 🧹 Cleanup

Stop services:

```bash
./stop_services.sh
```

Remove all data (including uploaded files and database):

```bash
docker-compose down -v
```

## 📝 Notes

- Supported audio formats: `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`
- Maximum file size: 50MB (configurable)
- Genre detection requires trained model at `./models/best.pt`
- Files are stored in MinIO with unique timestamped names
- Metadata is stored in PostgreSQL for fast searching

## 🚀 Production Deployment

For production:

1. Update CORS settings in `main.py`
2. Use strong passwords for MinIO and PostgreSQL
3. Enable HTTPS for MinIO
4. Use environment variables for all secrets
5. Set up proper logging and monitoring
6. Use production ASGI server (Gunicorn + Uvicorn)
7. Implement rate limiting and authentication

## 📄 License

[Your License Here]

## 🤝 Support

For issues and questions, please open an issue on the project repository.

