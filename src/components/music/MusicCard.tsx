'use client';

import { Music } from '@/types';
import { musicApi } from '@/lib/api/musicApi';
import Link from 'next/link';

interface MusicCardProps {
  music: Music;
}

export default function MusicCard({ music }: MusicCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await musicApi.downloadMusic(music.id);
  };

  return (
    <Link href={`/music/${music.id}`} className="block group animate-fade-in">
      <div className="bg-card-bg rounded-3xl border-4 border-white/10 group-hover:border-spotify-green overflow-hidden transition-all duration-300">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden">
          {music.coverUrl ? (
            <img
              src={music.coverUrl}
              alt={music.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spotify-green/10 to-card-bg">
              <div className="text-6xl">🎵</div>
            </div>
          )}

          {/* Hover Play Button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-spotify-green rounded-2xl flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg border-2 border-black rotate-0 group-hover:rotate-12">
              <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Genre Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-spotify-green text-black text-xs font-black rounded-full border-2 border-black shadow-sm">
              {music.genre}
            </span>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-black/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              {formatDuration(music.duration)}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-white font-black text-xl mb-1 truncate group-hover:text-spotify-green transition-colors" title={music.title}>
            {music.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 truncate" title={music.artist}>
            {music.artist}
          </p>

          {/* Context Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {music.suggestedContexts.map((context) => (
              <span
                key={context}
                className="text-xs px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg font-medium"
              >
                {context}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <div className="flex-1 bg-spotify-green text-black py-2.5 px-4 rounded-xl text-sm font-black hover:bg-[#1ed760] transition-all flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play
            </div>
            <button
              onClick={handleDownload}
              className="bg-card-bg border-2 border-white/20 text-white p-2.5 rounded-xl hover:border-spotify-green hover:bg-spotify-green/10 transition-all"
              title="Download"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
