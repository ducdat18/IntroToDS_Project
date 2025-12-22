export type Genre =
  | 'Classical'
  | 'Electronic'
  | 'Experimental'
  | 'Folk'
  | 'Hip-Hop'
  | 'Instrumental'
  | 'Old-Time Historic'
  | 'Rock';

export type VideoContext = 
  | 'funny' 
  | 'drama' 
  | 'vlog' 
  | 'cinematic' 
  | 'gaming'
  | 'action'
  | 'romantic'
  | 'horror'
  | 'documentary'
  | 'travel'
  | 'corporate'
  | 'sports'
  | 'wedding';

export interface Music {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  uploadedAt: Date;
  suggestedContexts: VideoContext[];
}

export interface UploadMusicPayload {
  file: File;
  title: string;
  artist: string;
}

export interface UploadMusicResponse {
  music: Music;
  detectedGenre: Genre;
}
