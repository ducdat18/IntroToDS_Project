/**
 * Adapter to convert backend API responses to frontend types
 * This allows the frontend to work with both mock data and real API seamlessly
 */

import { Music, Genre } from '@/types';
import { AudioFile } from './backendApi';

/**
 * Convert backend AudioFile to frontend Music type
 */
export function audioFileToMusic(file: AudioFile): Music {
  return {
    id: file.id.toString(),
    title: file.original_filename.replace(/\.[^/.]+$/, ''), // Remove extension
    artist: 'Unknown Artist', // Backend doesn't store artist info yet
    genre: (file.detected_genre || 'Instrumental') as Genre,
    duration: 0, // Backend doesn't provide duration yet
    audioUrl: `/api/stream/${file.id}`, // Streams through Next.js API proxy
    uploadedAt: new Date(file.uploaded_at),
    suggestedContexts: [], // Can be derived from genre if needed
  };
}

/**
 * Convert array of AudioFiles to Music array
 */
export function audioFilesToMusic(files: AudioFile[]): Music[] {
  return files.map(audioFileToMusic);
}

/**
 * Normalize genre name from backend to match frontend types
 * Maps backend genres (including ones from ML model) to the 8 frontend genres
 */
export function normalizeGenre(genre: string | null): Genre {
  if (!genre) return 'Instrumental';
  
  // Map backend genres to frontend genres
  const genreMap: Record<string, Genre> = {
    // Direct mappings
    'Classical': 'Classical',
    'Electronic': 'Electronic',
    'Experimental': 'Experimental',
    'Folk': 'Folk',
    'Hip-Hop': 'Hip-Hop',
    'Hip Hop': 'Hip-Hop',
    'Instrumental': 'Instrumental',
    'Old-Time': 'Old-Time Historic',
    'Old-Time Historic': 'Old-Time Historic',
    'Rock': 'Rock',
    
    // Map additional backend genres to closest frontend genre
    'Jazz': 'Classical',        // Jazz → Classical (sophisticated)
    'Blues': 'Folk',            // Blues → Folk (traditional roots)
    'Country': 'Folk',          // Country → Folk (acoustic, storytelling)
    'Pop': 'Rock',              // Pop → Rock (mainstream appeal)
    'R&B': 'Hip-Hop',          // R&B → Hip-Hop (modern, rhythmic)
    'Metal': 'Rock',            // Metal → Rock (electric guitar-based)
  };

  return genreMap[genre] || 'Instrumental';
}

