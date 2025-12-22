import { useState, useEffect } from 'react';
import { Music, Genre, VideoContext } from '@/types';
import { musicApi } from '@/lib/api/musicApi';

/**
 * Hook to fetch all music
 */
export function useAllMusic() {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getAllMusic();
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch music');
      } finally {
        setLoading(false);
      }
    }

    fetchMusic();
  }, []);

  return { music, loading, error };
}

/**
 * Hook to fetch music by genre
 */
export function useMusicByGenre(genre: Genre) {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getMusicByGenre(genre);
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch music');
      } finally {
        setLoading(false);
      }
    }

    fetchMusic();
  }, [genre]);

  return { music, loading, error };
}

/**
 * Hook to fetch music by context
 */
export function useMusicByContext(context: VideoContext) {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getMusicByContext(context);
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch music');
      } finally {
        setLoading(false);
      }
    }

    fetchMusic();
  }, [context]);

  return { music, loading, error };
}

/**
 * Hook to fetch a single music by ID
 */
export function useMusicById(id: string) {
  const [music, setMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getMusicById(id);
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch music');
      } finally {
        setLoading(false);
      }
    }

    fetchMusic();
  }, [id]);

  return { music, loading, error };
}

/**
 * Hook to search music
 */
export function useSearchMusic(query: string, debounceMs: number = 500) {
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setMusic([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.searchMusic(query);
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search music');
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return { music, loading, error };
}
