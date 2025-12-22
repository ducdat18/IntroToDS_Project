'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchMusic } from '@/hooks/useMusic';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { music, loading } = useSearchMusic(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search for music or artists..."
          className="w-full px-4 py-2 pl-10 bg-hover border border-border rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-spotify-green"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-card-bg border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center">
              <LoadingSpinner size="md" />
            </div>
          ) : music.length > 0 ? (
            <div>
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm text-gray-400">
                  {music.length} {music.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
              <div className="divide-y divide-border">
                {music.map((item) => (
                  <Link
                    key={item.id}
                    href={`/music/${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-hover transition-colors"
                  >
                    <div className="w-12 h-12 bg-spotify-green/20 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-spotify-green" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.title}</p>
                      <p className="text-sm text-gray-400 truncate">{item.artist}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-spotify-green/20 text-spotify-green rounded">
                      {item.genre}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
