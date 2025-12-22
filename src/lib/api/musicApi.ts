import { Music, Genre, VideoContext, UploadMusicPayload, UploadMusicResponse } from '@/types';
import { MOCK_MUSIC, getMusicByGenre, getMusicByContext, getAllMusic } from '../mockData';
import { GENRE_TO_CONTEXTS } from '../constants';

// Configuration - Only need to change BASE_URL when deploying real backend
const IS_MOCK = true; // Set to false when real backend is available
const BASE_URL = IS_MOCK ? '/api/mock' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Music API Service
 * When integrating real backend:
 * 1. Set IS_MOCK = false
 * 2. Set NEXT_PUBLIC_API_URL in .env
 * 3. All functions will automatically call backend API
 */
export const musicApi = {
  /**
   * Get all music
   * Real API: GET /api/music
   */
  async getAllMusic(): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getAllMusic();
    }

    const response = await fetch(`${BASE_URL}/music`);
    if (!response.ok) throw new Error('Failed to fetch music');
    return response.json();
  },

  /**
   * Get music by genre
   * Real API: GET /api/music?genre={genre}
   */
  async getMusicByGenre(genre: Genre): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getMusicByGenre(genre);
    }

    const response = await fetch(`${BASE_URL}/music?genre=${encodeURIComponent(genre)}`);
    if (!response.ok) throw new Error('Failed to fetch music by genre');
    return response.json();
  },

  /**
   * Get music by video context
   * Real API: GET /api/music?context={context}
   */
  async getMusicByContext(context: VideoContext): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getMusicByContext(context);
    }

    const response = await fetch(`${BASE_URL}/music?context=${context}`);
    if (!response.ok) throw new Error('Failed to fetch music by context');
    return response.json();
  },

  /**
   * Get music by ID
   * Real API: GET /api/music/{id}
   */
  async getMusicById(id: string): Promise<Music | null> {
    if (IS_MOCK) {
      await delay(200);
      return MOCK_MUSIC.find(m => m.id === id) || null;
    }

    const response = await fetch(`${BASE_URL}/music/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch music');
    }
    return response.json();
  },

  /**
   * Search music by title or artist
   * Real API: GET /api/music/search?q={query}
   */
  async searchMusic(query: string): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(400);
      const lowerQuery = query.toLowerCase();
      return MOCK_MUSIC.filter(
        m => m.title.toLowerCase().includes(lowerQuery) ||
             m.artist.toLowerCase().includes(lowerQuery)
      );
    }

    const response = await fetch(`${BASE_URL}/music/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search music');
    return response.json();
  },

  /**
   * Upload music file
   * Real API: POST /api/music/upload
   */
  async uploadMusic(payload: UploadMusicPayload): Promise<UploadMusicResponse> {
    if (IS_MOCK) {
      await delay(2000); // Simulate AI processing time

      // Mock AI classification - randomly pick a genre
      const genres: Genre[] = ['Classical', 'Electronic', 'Experimental', 'Folk', 'Hip-Hop', 'Instrumental', 'Old-Time Historic', 'Rock'];
      const detectedGenre = genres[Math.floor(Math.random() * genres.length)];

      const newMusic: Music = {
        id: Date.now().toString(),
        title: payload.title,
        artist: payload.artist,
        genre: detectedGenre,
        duration: 180, // Mock duration
        audioUrl: URL.createObjectURL(payload.file),
        uploadedAt: new Date(),
        suggestedContexts: GENRE_TO_CONTEXTS[detectedGenre],
      };

      // Add to mock data (in real app, this is stored in backend)
      MOCK_MUSIC.unshift(newMusic);

      return {
        music: newMusic,
        detectedGenre,
      };
    }

    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('title', payload.title);
    formData.append('artist', payload.artist);

    const response = await fetch(`${BASE_URL}/music/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload music');
    return response.json();
  },

  /**
   * Download music file
   * Real API: GET /api/music/{id}/download
   */
  async downloadMusic(id: string): Promise<void> {
    if (IS_MOCK) {
      await delay(100);
      const music = MOCK_MUSIC.find(m => m.id === id);
      if (!music) throw new Error('Music not found');

      // Mock download - just log in console
      console.log('Downloading:', music.title);
      alert(`Mock download: ${music.title} by ${music.artist}`);
      return;
    }

    const response = await fetch(`${BASE_URL}/music/${id}/download`);
    if (!response.ok) throw new Error('Failed to download music');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `music-${id}.mp3`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Get audio URL for streaming
   * Real API: GET /api/music/{id}/stream
   */
  getAudioUrl(id: string): string {
    if (IS_MOCK) {
      // Return mock audio URL (will need actual audio files for real playback)
      return `/audio/sample-${id}.mp3`;
    }

    return `${BASE_URL}/music/${id}/stream`;
  },
};
