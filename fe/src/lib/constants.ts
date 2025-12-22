import { Genre, VideoContext } from '@/types';

export const GENRES: Genre[] = [
  'Classical',
  'Electronic',
  'Experimental',
  'Folk',
  'Hip-Hop',
  'Instrumental',
  'Old-Time Historic',
  'Rock',
];

export const VIDEO_CONTEXTS: { value: VideoContext; label: string; description: string }[] = [
  {
    value: 'funny',
    label: 'Funny',
    description: 'Upbeat and energetic music for comedy and lighthearted content',
  },
  {
    value: 'vlog',
    label: 'Vlog',
    description: 'Casual and easy-listening music for daily vlogs',
  },
  {
    value: 'drama',
    label: 'Drama',
    description: 'Emotional and impactful music for dramatic scenes',
  },
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Epic and atmospheric music for cinematic productions',
  },
  {
    value: 'gaming',
    label: 'Gaming',
    description: 'High-energy and immersive music for gaming content and streams',
  },
  {
    value: 'action',
    label: 'Action',
    description: 'Intense and fast-paced music for action sequences and thrillers',
  },
  {
    value: 'romantic',
    label: 'Romantic',
    description: 'Soft and emotional music for romantic scenes and love stories',
  },
  {
    value: 'horror',
    label: 'Horror',
    description: 'Dark and suspenseful music for horror and thriller content',
  },
  {
    value: 'documentary',
    label: 'Documentary',
    description: 'Neutral and informative music for documentaries and educational content',
  },
  {
    value: 'travel',
    label: 'Travel',
    description: 'Adventurous and inspiring music for travel vlogs and exploration content',
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Professional and polished music for business and corporate videos',
  },
  {
    value: 'sports',
    label: 'Sports',
    description: 'Energetic and motivational music for sports highlights and athletic content',
  },
  {
    value: 'wedding',
    label: 'Wedding',
    description: 'Elegant and celebratory music for wedding videos and special occasions',
  },
];

// Mapping from genre to suitable video contexts
export const GENRE_TO_CONTEXTS: Record<Genre, VideoContext[]> = {
  'Classical': ['cinematic', 'drama', 'romantic', 'wedding', 'corporate', 'documentary'],
  'Electronic': ['funny', 'cinematic', 'gaming', 'action', 'sports', 'corporate'],
  'Experimental': ['cinematic', 'gaming', 'horror', 'action'],
  'Folk': ['vlog', 'drama', 'travel', 'documentary', 'romantic'],
  'Hip-Hop': ['funny', 'vlog', 'gaming', 'action', 'sports'],
  'Instrumental': ['vlog', 'cinematic', 'gaming', 'corporate', 'documentary', 'wedding', 'romantic'],
  'Old-Time Historic': ['drama', 'cinematic', 'documentary', 'wedding'],
  'Rock': ['funny', 'cinematic', 'gaming', 'action', 'sports'],
};

// Reverse mapping from context to suitable genres
export const CONTEXT_TO_GENRES: Record<VideoContext, Genre[]> = {
  funny: ['Electronic', 'Hip-Hop', 'Rock'],
  vlog: ['Folk', 'Hip-Hop', 'Instrumental'],
  drama: ['Classical', 'Folk', 'Old-Time Historic'],
  cinematic: ['Classical', 'Electronic', 'Experimental', 'Instrumental', 'Old-Time Historic', 'Rock'],
  gaming: ['Electronic', 'Experimental', 'Hip-Hop', 'Instrumental', 'Rock'],
  action: ['Electronic', 'Experimental', 'Hip-Hop', 'Rock'],
  romantic: ['Classical', 'Folk', 'Instrumental', 'Old-Time Historic'],
  horror: ['Experimental', 'Electronic'],
  documentary: ['Classical', 'Folk', 'Instrumental', 'Old-Time Historic'],
  travel: ['Folk', 'Instrumental', 'Electronic'],
  corporate: ['Classical', 'Electronic', 'Instrumental'],
  sports: ['Electronic', 'Hip-Hop', 'Rock'],
  wedding: ['Classical', 'Instrumental', 'Old-Time Historic'],
};
