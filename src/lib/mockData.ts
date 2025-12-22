import { Music, Genre } from '@/types';
import { GENRE_TO_CONTEXTS } from './constants';

// Mock music data for demonstration
export const MOCK_MUSIC: Music[] = [
  {
    id: '1',
    title: 'Sunset Dreams',
    artist: 'Electronic Beats',
    genre: 'Electronic',
    duration: 185,
    audioUrl: '/audio/sample1.mp3',
    uploadedAt: new Date('2024-01-15'),
    suggestedContexts: GENRE_TO_CONTEXTS['Electronic'],
  },
  {
    id: '2',
    title: 'Morning Coffee',
    artist: 'Instrumental Collective',
    genre: 'Instrumental',
    duration: 210,
    audioUrl: '/audio/sample2.mp3',
    uploadedAt: new Date('2024-01-14'),
    suggestedContexts: GENRE_TO_CONTEXTS['Instrumental'],
  },
  {
    id: '3',
    title: 'Epic Journey',
    artist: 'Orchestral Masters',
    genre: 'Classical',
    duration: 240,
    audioUrl: '/audio/sample3.mp3',
    uploadedAt: new Date('2024-01-13'),
    suggestedContexts: GENRE_TO_CONTEXTS['Classical'],
  },
  {
    id: '4',
    title: 'City Lights',
    artist: 'Urban Vibes',
    genre: 'Hip-Hop',
    duration: 195,
    audioUrl: '/audio/sample4.mp3',
    uploadedAt: new Date('2024-01-12'),
    suggestedContexts: GENRE_TO_CONTEXTS['Hip-Hop'],
  },
  {
    id: '5',
    title: 'Thunder Strike',
    artist: 'Rock Legends',
    genre: 'Rock',
    duration: 220,
    audioUrl: '/audio/sample5.mp3',
    uploadedAt: new Date('2024-01-11'),
    suggestedContexts: GENRE_TO_CONTEXTS['Rock'],
  },
  {
    id: '6',
    title: 'Ancient Echoes',
    artist: 'Historic Sounds',
    genre: 'Old-Time Historic',
    duration: 200,
    audioUrl: '/audio/sample6.mp3',
    uploadedAt: new Date('2024-01-10'),
    suggestedContexts: GENRE_TO_CONTEXTS['Old-Time Historic'],
  },
  {
    id: '9',
    title: 'Folk Tales',
    artist: 'Acoustic Wanderers',
    genre: 'Folk',
    duration: 190,
    audioUrl: '/audio/sample9.mp3',
    uploadedAt: new Date('2024-01-07'),
    suggestedContexts: GENRE_TO_CONTEXTS['Folk'],
  },
  {
    id: '12',
    title: 'Experimental Soundscape',
    artist: 'Avant-Garde Artists',
    genre: 'Experimental',
    duration: 300,
    audioUrl: '/audio/sample12.mp3',
    uploadedAt: new Date('2024-01-04'),
    suggestedContexts: GENRE_TO_CONTEXTS['Experimental'],
  },
];

export function getMusicByGenre(genre: Genre): Music[] {
  return MOCK_MUSIC.filter(music => music.genre === genre);
}

export function getMusicByContext(context: string): Music[] {
  return MOCK_MUSIC.filter(music =>
    music.suggestedContexts.includes(context as any)
  );
}

export function getAllMusic(): Music[] {
  return MOCK_MUSIC;
}
