# MusicDiscover - Music Discovery Platform

A modern, responsive web platform for searching, listening to, and downloading background music. Built with Next.js 16 and Tailwind CSS v4, featuring a Spotify-inspired dark UI.

## 🚀 Key Features

### 1. Music Discovery
- **Browse by Genre**: Explore 8 distinct music genres (Classical, Electronic, Hip-Hop, Rock, etc.) with dedicated listing pages.
- **Video Contexts**: Find music curated for 13 specific video types:
  - **Funny, Vlog, Drama, Cinematic, Gaming, Action, Romantic, Horror, Documentary, Travel, Corporate, Sports, Wedding**.
- **Search**: Real-time searching by title or artist.

### 2. Music Playback & Details
- **Dedicated Music Page**: Detailed view for every track (`/music/[id]`).
- **Interactive Audio Player**:
  - Play/Pause, Volume control, Mute toggle.
  - Seekable progress bar.
  - Auto-play capability.
- **Music Information**: Displays artist, duration, upload date, and AI-classified genre.
- **Context Suggestions**: Automatically suggests video contexts based on the track's genre.

### 3. Upload System
- **File Upload**: Drag-and-drop or file selection for audio files.
- **AI Classification**: (Integrated) Uploaded tracks are analyzed to automatically detect genre and suggest usage contexts.
- **Metadata**: Automatic extraction of title/artist with manual override.

### 4. Technical Features
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile.
- **Mock/Real API Toggle**: Built-in switch (`IS_MOCK`) to toggle between a simulated backend and a real Python/FastAPI backend.
- **Modern Architecture**: Uses Next.js App Router, Server Components, and React Hooks.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Linting**: ESLint

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                # Next.js API Routes (proxies/streams)
│   ├── browse/
│   │   ├── context/        # Browse by Video Context pages
│   │   └── genre/          # Browse by Genre pages
│   ├── music/
│   │   └── [id]/           # Music Detail & Player page
│   ├── upload/             # Music Upload page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── layout/             # Header, Footer
│   ├── music/              # AudioPlayer, MusicCard
│   └── ui/                 # SearchBar, LoadingSpinner, ErrorMessage
├── hooks/
│   └── useMusic.ts         # React hooks for music data fetching
├── lib/
│   ├── api/
│   │   ├── musicApi.ts     # Main service (handles Mock vs Real switch)
│   │   ├── backendApi.ts   # Axios/Fetch client for real backend
│   │   └── adapter.ts      # Data transformation layer
│   └── mockData.ts         # Static data for testing
└── types/                  # TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment (Optional):
    Create a `.env.local` file to override defaults if connecting to a real backend.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

### Running Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## 🔌 API Integration

The frontend is designed to work with a backend API but can run in standalone mode.

**Switching Modes:**
Open `src/lib/api/musicApi.ts` and set the `IS_MOCK` constant:
- `true`: Uses local mock data (no backend required).
- `false`: Connects to `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`).

**Expected Backend Endpoints:**
- `GET /files` - List all files
- `GET /files/{id}` - Get file metadata
- `GET /files/genre/{genre}` - Filter by genre
- `GET /search` - Search files
- `POST /upload` - Upload audio file (returns genre classification)
- `GET /download/{id}` - Stream/Download audio

## 🎨 Design System

**Colors (Spotify-inspired):**
- Primary: `#1DB954` (Green)
- Background: `#121212` (Dark Grey)
- Card Surface: `#181818`
- Text: `#FFFFFF` (White) & `#B3B3B3` (Light Grey)

## 🔮 Future Roadmap

- [ ] User Authentication & Profiles
- [ ] User Playlists & "Liked Songs"
- [ ] Waveform Visualization in Player
- [ ] Advanced Filtering (BPM, Mood)
- [ ] Social Sharing features

## 📄 License

This project is for educational purposes.