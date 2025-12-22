import { Music, Genre, VideoContext, UploadMusicPayload, UploadMusicResponse } from '@/types';
import { MOCK_MUSIC, getMusicByGenre, getMusicByContext, getAllMusic } from '../mockData';
import { GENRE_TO_CONTEXTS, CONTEXT_TO_GENRES } from '../constants';
import backendApi from './backendApi';
import { audioFilesToMusic, normalizeGenre } from './adapter';

// Configuration - Set to false to use real backend
const IS_MOCK = false; // Now using real backend!
const BASE_URL = IS_MOCK ? '/api/mock' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
   * Real API: GET /search
   */
  async getAllMusic(): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getAllMusic();
    }

    const files = await backendApi.getAllFiles();
    return audioFilesToMusic(files);
  },

  /**
   * Get music by genre
   * Real API: GET /search?genre={genre}
   */
  async getMusicByGenre(genre: Genre): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getMusicByGenre(genre);
    }

    const files = await backendApi.getFilesByGenre(genre);
    return audioFilesToMusic(files);
  },

  /**
   * Get music by video context
   * Real API: Search by multiple genres that match the context
   */
  async getMusicByContext(context: VideoContext): Promise<Music[]> {
    if (IS_MOCK) {
      await delay(300);
      return getMusicByContext(context);
    }

    // Get genres for this context
    const genres = CONTEXT_TO_GENRES[context] || [];
    
    // Search for music in all matching genres
    const results = await Promise.all(
      genres.map(genre => backendApi.getFilesByGenre(genre))
    );
    
    // Flatten and convert to Music objects
    const allFiles = results.flat();
    return audioFilesToMusic(allFiles);
  },

  /**
   * Get music by ID
   * Real API: GET /files/{id}
   */
  async getMusicById(id: string): Promise<Music | null> {
    if (IS_MOCK) {
      await delay(200);
      return MOCK_MUSIC.find(m => m.id === id) || null;
    }

    try {
      const file = await backendApi.getFileInfo(parseInt(id));
      return audioFilesToMusic([file])[0];
    } catch (error) {
      console.error('Error fetching music by ID:', error);
      return null;
    }
  },

  /**
   * Search music by title or artist
   * Real API: GET /search?filename={query}
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

    const response = await backendApi.searchAudio({ filename: query });
    return audioFilesToMusic(response.files);
  },

  /**
   * Upload music file
   * Real API: POST /upload
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

    const uploadResult = await backendApi.uploadAudio(payload.file);
    const detectedGenre = normalizeGenre(uploadResult.detected_genre);

    const newMusic: Music = {
      id: uploadResult.file_id.toString(),
      title: payload.title || payload.file.name.replace(/\.[^/.]+$/, ''),
      artist: payload.artist || 'Unknown Artist',
      genre: detectedGenre,
      duration: 0,
      audioUrl: backendApi.getStreamUrl(uploadResult.file_id),
      uploadedAt: new Date(),
      suggestedContexts: GENRE_TO_CONTEXTS[detectedGenre] || [],
    };

    return {
      music: newMusic,
      detectedGenre,
    };
  },

  /**
   * Download music file
   * Real API: GET /download/{id}
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

    const file = await backendApi.getFileInfo(parseInt(id));
    await backendApi.downloadAudio(parseInt(id), file.original_filename);
  },

  /**
   * Get audio URL for streaming
   * Real API: GET /download/{id}
   */
  getAudioUrl(id: string): string {
    if (IS_MOCK) {
      // Return mock audio URL (will need actual audio files for real playback)
      return `/audio/sample-${id}.mp3`;
    }

    return backendApi.getStreamUrl(parseInt(id));
  },

  /**
   * Delete music file
   * Real API: DELETE /files/{id}
   */
  async deleteMusic(id: string): Promise<void> {
    if (IS_MOCK) {
      const index = MOCK_MUSIC.findIndex(m => m.id === id);
      if (index !== -1) {
        MOCK_MUSIC.splice(index, 1);
      }
      return;
    }

    await backendApi.deleteAudio(parseInt(id));
  },

  /**
   * Get statistics
   * Real API: GET /stats
   */
  async getStats() {
    if (IS_MOCK) {
      return {
        total_files: MOCK_MUSIC.length,
        total_size_mb: 0,
        genre_distribution: {},
      };
    }

    return await backendApi.getStats();
  },
};
