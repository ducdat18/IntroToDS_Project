'use client';

import { use } from 'react';
import { useMusicById } from '@/hooks/useMusic';
import { musicApi } from '@/lib/api/musicApi';
import AudioPlayer from '@/components/music/AudioPlayer';
import { LoadingScreen } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MusicDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { music, loading, error } = useMusicById(id);

  const handleDownload = async () => {
    try {
      await musicApi.downloadMusic(id);
    } catch (err) {
      alert('Failed to download music');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingScreen message="Loading music..." />
      </div>
    );
  }

  if (error || !music) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage
          message={error || 'Music not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-spotify-green">
          Home
        </Link>
        <span>/</span>
        <Link href={`/browse/genre/${music.genre.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-spotify-green">
          {music.genre}
        </Link>
        <span>/</span>
        <span className="text-white">{music.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Music Info */}
        <div>
          <div className="aspect-square bg-gradient-to-br from-spotify-green/20 to-spotify-black rounded-lg mb-6 flex items-center justify-center">
            {music.coverUrl ? (
              <img src={music.coverUrl} alt={music.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <svg className="w-40 h-40 text-spotify-green/50" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">{music.title}</h1>
          <p className="text-2xl text-gray-300 mb-4">{music.artist}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={`/browse/genre/${music.genre.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 bg-spotify-green/20 text-spotify-green rounded-full border border-spotify-green/30 hover:bg-spotify-green/30 transition-colors"
            >
              {music.genre}
            </Link>
            <span className="px-4 py-2 bg-card-bg text-gray-300 rounded-full border border-border">
              {Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-spotify-green text-white py-4 rounded-full hover:bg-[#1ed760] transition-colors font-semibold flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          <div className="bg-card-bg rounded-lg p-6 border border-border mb-6">
            <h3 className="text-white font-semibold mb-3">Suggested Video Contexts</h3>
            <p className="text-sm text-gray-400 mb-3">
              This music is perfect for the following video editing contexts:
            </p>
            <div className="flex flex-wrap gap-2">
              {music.suggestedContexts.map((context) => (
                <Link
                  key={context}
                  href={`/browse/context/${context}`}
                  className="px-4 py-2 bg-spotify-green/10 text-spotify-green rounded-full border border-spotify-green/20 hover:bg-spotify-green/20 transition-colors text-sm"
                >
                  {context.charAt(0).toUpperCase() + context.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card-bg rounded-lg p-6 border border-border">
            <h3 className="text-white font-semibold mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Genre</dt>
                <dd className="text-white">{music.genre}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Duration</dt>
                <dd className="text-white">{Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Uploaded</dt>
                <dd className="text-white">{new Date(music.uploadedAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Artist</dt>
                <dd className="text-white">{music.artist}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column - Audio Player */}
        <div>
          <div className="sticky top-24">
            <AudioPlayer music={music} autoPlay={false} />

            <div className="mt-6 bg-card-bg rounded-lg p-6 border border-border">
              <h3 className="text-white font-semibold mb-3">How to Use</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-spotify-green mt-1">•</span>
                  <span>Click the play button to preview the track</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spotify-green mt-1">•</span>
                  <span>Download the track for use in your video projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spotify-green mt-1">•</span>
                  <span>Check the suggested contexts to find the best use cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spotify-green mt-1">•</span>
                  <span>Browse similar music in the {music.genre} genre</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-spotify-green/10 border border-spotify-green/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-spotify-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">AI Classification</p>
                  <p>
                    This track was automatically classified as {music.genre} using our AI genre detection system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
