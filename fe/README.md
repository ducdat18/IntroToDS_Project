# MusicDiscover - Music Discovery Platform for Video Editors

An open web platform for video editors and content creators to search, download, and share background music for video production. Built with Next.js and Tailwind CSS, inspired by Spotify's design.

## Key Features

### 1. Home Page
- Hero section with call-to-action buttons
- Browse by Video Context cards (Funny, Vlog, Drama, Cinematic)
- Explore Genres grid showcase
- Features section introducing AI-powered classification

### 2. Browse by Genre
- Grid layout displaying all 16 music genres:
  - Blues, Classical, Country, Easy Listening, Electronic, Experimental
  - Folk, Hip-Hop, Instrumental, International, Jazz, Old-Time Historic
  - Pop, Rock, Soul-RnB, Spoken
- Dynamic routes for each genre with song listings

### 3. Browse by Video Context
- 4 main video contexts:
  - **Funny**: Upbeat and energetic music
  - **Vlog**: Easy-listening music for daily vlogs
  - **Drama**: Emotional and impactful music
  - **Cinematic**: Epic and atmospheric music
- Each context displays suitable genres
- Usage guide for each context

### 4. Upload Music
- Audio file upload form
- Input for title and artist
- AI genre classification simulation
- Display classification results and suggested contexts
- Upload guidelines

### 5. Components
- **Header**: Navigation with logo, menu links, upload button
- **Footer**: Links, social icons, copyright
- **MusicCard**: Card component displaying music information with play/download buttons

## Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Heroicons (SVG)

## Color Scheme (Spotify-inspired)

- **Primary Green**: #1DB954
- **Background Dark**: #121212
- **Card Background**: #1a1a1a
- **Spotify Black**: #191414
- **Border**: #282828
- **Hover**: #2a2a2a

## Project Structure

```
music-discovery-platform/
├── src/
│   ├── app/
│   │   ├── browse/
│   │   │   ├── genre/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── context/
│   │   │       ├── [slug]/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── upload/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── music/
│   │       └── MusicCard.tsx
│   ├── lib/
│   │   ├── constants.ts
│   │   └── mockData.ts
│   └── types/
│       └── index.ts
└── package.json
```

## How to Run the Project

### Development
```bash
cd music-discovery-platform
npm install  # If dependencies are not installed yet
npm run dev
```

Open your browser and visit: http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

## API Integration (To-Do)

The frontend is currently using mock data. To integrate with the backend:

1. **Upload Music API**:
   - Endpoint: `POST /api/upload`
   - Handle file upload and call AI model to classify genre

2. **Get Music API**:
   - `GET /api/music` - Get all music tracks
   - `GET /api/music?genre={genre}` - Filter by genre
   - `GET /api/music?context={context}` - Filter by video context

3. **Download Music API**:
   - `GET /api/download/{id}` - Download music file

## Mapping Logic

### Genre to Video Context
The system uses mapping logic to suggest video contexts based on genre:

- **Funny**: Electronic, Hip-Hop, Pop, Rock
- **Vlog**: Country, Easy Listening, Folk, Hip-Hop, Instrumental, International, Jazz, Pop, Soul-RnB
- **Drama**: Blues, Classical, Country, Folk, Jazz, Old-Time Historic, Soul-RnB, Spoken
- **Cinematic**: Classical, Electronic, Experimental, Instrumental, International, Old-Time Historic, Rock

## Features to Develop

- [ ] Integrate AI backend for genre classification
- [ ] Real audio player with waveform visualization
- [ ] User authentication and profile
- [ ] Playlist creation
- [ ] Advanced search and filter
- [ ] Favorite/like system
- [ ] Comments and ratings
- [ ] Mobile responsive improvements
- [ ] Dark/Light theme toggle

## License

This project is for educational purposes.
