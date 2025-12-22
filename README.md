# 🎵 MusicDiscover - AI-Powered Music Management System

A full-stack web application for uploading, managing, and discovering music with **automatic genre detection** using deep learning.

## ✨ Features

- 🎯 **Automatic Genre Detection** - Upload audio files and AI detects the genre
- 🗄️ **MinIO Object Storage** - Secure, scalable file storage
- 🔍 **Smart Search** - Find music by genre, filename, or video context
- 🎧 **In-Browser Playback** - Stream audio directly in your browser
- 📊 **Analytics Dashboard** - View statistics and genre distribution
- 🎨 **Modern UI** - Beautiful, responsive interface built with Next.js

## 🏗️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **PyTorch** - Deep learning for genre classification
- **MinIO** - S3-compatible object storage
- **PostgreSQL** - Metadata database
- **Docker** - Containerized services

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- 4GB+ RAM

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd IntroToDS_Project
```

### 2. Setup Backend

```bash
cd be

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Start Docker services (MinIO + PostgreSQL)
./start_services.sh

# Start API server
./start_api.sh
```

**Backend will run on:** http://localhost:8000

### 3. Setup Frontend

```bash
cd fe

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** http://localhost:3000

## 📂 Project Structure

```
IntroToDS_Project/
├── be/                      # Backend (FastAPI)
│   ├── main.py             # API endpoints
│   ├── model.py            # ML model architecture
│   ├── inference.py        # Genre detection
│   ├── database.py         # PostgreSQL models
│   ├── minio_service.py    # Object storage client
│   ├── docker-compose.yml  # Docker services
│   └── models/
│       └── best.pt         # Trained model
│
├── fe/                      # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # Pages & routes
│   │   ├── components/     # React components
│   │   ├── lib/
│   │   │   └── api/        # API clients
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── README.md
```

## 🎮 How to Use

### 1. Upload Music
1. Go to http://localhost:3000/upload
2. Select an audio file (MP3, WAV, OGG, FLAC, M4A)
3. AI automatically detects the genre
4. File is stored in MinIO, metadata in PostgreSQL

### 2. Browse by Genre
1. Click **"Genres"** in navigation
2. Choose from 8 genres:
   - Classical
   - Electronic
   - Experimental
   - Folk
   - Hip-Hop
   - Instrumental
   - Old-Time Historic
   - Rock
3. View all songs in that genre

### 3. Browse by Context
1. Click **"Contexts"** in navigation
2. Choose video type (Funny, Cinematic, Gaming, etc.)
3. See music suitable for that content type

### 4. Play Music
1. Click on any song card
2. Audio player appears
3. Play, pause, seek, adjust volume
4. Music streams directly from backend

### 5. Search
1. Use search bar in header
2. Search by filename or artist
3. Results appear instantly

## 🔧 Configuration

### Backend Environment Variables
```bash
# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# Database
DATABASE_URL=postgresql://musicapp:musicapp123@localhost:5433/music_metadata

# Model
MODEL_PATH=./models/best.pt
```

### Frontend Environment Variables
Create `fe/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check API health |
| `/upload` | POST | Upload audio file |
| `/search` | GET | Search files by genre/filename |
| `/stream/{id}` | GET | Stream audio for playback |
| `/download/{id}` | GET | Download audio file |
| `/files/{id}` | GET | Get file details |
| `/files/{id}` | DELETE | Delete file |
| `/stats` | GET | Get statistics |

**Full API docs:** http://localhost:8000/docs

## 🎯 Key Features Explained

### Automatic Genre Detection
- Uses CNN + Transformer architecture
- Converts audio to mel-spectrograms
- EfficientNet-B0 for feature extraction
- Multi-head attention for temporal analysis
- ~90% accuracy on test set

### Genre Mapping
Backend detects: Pop, Jazz, Blues, Country, R&B, Metal  
Frontend maps to 8 core genres automatically

### Context-Based Search
Each video context maps to multiple genres:
- **Funny** → Electronic, Hip-Hop, Rock
- **Cinematic** → Classical, Electronic, Experimental, etc.
- **Gaming** → Electronic, Hip-Hop, Rock, etc.

## 🐳 Docker Services

### MinIO
- **Console:** http://localhost:9001
- **Credentials:** minioadmin / minioadmin123

### PostgreSQL
- **Port:** 5433
- **Database:** music_metadata
- **Credentials:** musicapp / musicapp123

## 🧪 Testing

### Test Backend
```bash
cd be
curl http://localhost:8000/health
```

### Test Upload
```bash
curl -X POST http://localhost:8000/upload \
  -F "audio_file=@song.mp3"
```

## 🛠️ Development

### Start Services
```bash
# Backend
cd be
./start_services.sh  # Start Docker
./start_api.sh       # Start API

# Frontend
cd fe
npm run dev
```

### Stop Services
```bash
cd be
./stop_services.sh   # Stop Docker
pkill -f uvicorn     # Stop API
```

## 📝 Notes

- **Model Training:** See `be/train.py` for training your own model
- **Data Format:** Model expects audio files with mel-spectrogram conversion
- **Storage:** Files stored in MinIO, metadata in PostgreSQL
- **Streaming:** Audio streams through Next.js API proxy for CORS handling

## 🎓 Model Architecture

```
Input Audio
    ↓
Mel-Spectrogram (448x448)
    ↓
EfficientNet-B0 (CNN)
    ↓
Multi-Head Attention
    ↓
Classification Layer
    ↓
Genre (8 classes)
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if port is free
lsof -i :8000

# Restart Docker services
cd be && docker compose restart
```

### Frontend can't connect
- Verify backend is running: `curl http://localhost:8000/health`
- Check `fe/.env.local` has correct API URL
- Restart Next.js: `npm run dev`

### Audio won't play
- Check browser console for errors
- Verify file exists: `curl http://localhost:8000/files/1`
- Try different browser (Chrome/Firefox recommended)

### Genre detection fails
- Ensure model file exists: `ls be/models/best.pt`
- Check model was trained on similar audio
- View API logs for error messages

## 📄 License

MIT License - Feel free to use for your projects!

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 🙏 Acknowledgments

- PyTorch for deep learning framework
- FastAPI for backend API
- Next.js for frontend framework
- MinIO for object storage
- EfficientNet for model architecture

---

**Made with ❤️ for Intro to Data Science Project**

