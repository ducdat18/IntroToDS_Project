'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import MusicCard from '@/components/music/MusicCard';
import { useMusicByGenre } from '@/hooks/useMusic';
import { LoadingGrid } from '@/components/ui/LoadingSpinner';
import ErrorMessage, { EmptyState } from '@/components/ui/ErrorMessage';
import { GENRES } from '@/lib/constants';
import type { Genre } from '@/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function GenreDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  // Convert slug back to genre name
  const genreName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Check if genre exists
  if (!GENRES.includes(genreName as Genre)) {
    notFound();
  }

  const genre = genreName as Genre;
  const { music: musicList, loading, error } = useMusicByGenre(genre);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/browse/genre" className="hover:text-spotify-green">
            Browse by Genre
          </Link>
          <span>/</span>
          <span className="text-white">{genre}</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">{genre}</h1>
        {!loading && (
          <p className="text-gray-400">
            {musicList.length} {musicList.length === 1 ? 'track' : 'tracks'} available in this genre
          </p>
        )}
      </div>

      {loading ? (
        <LoadingGrid count={8} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      ) : musicList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {musicList.map((music) => (
            <MusicCard key={music.id} music={music} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tracks yet"
          message={`Be the first to upload music in the ${genre} genre!`}
          actionLabel="Upload Music"
          actionHref="/upload"
        />
      )}
    </div>
  );
}
