'use client';

import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-spotify-black/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 bg-spotify-green rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-black shadow-sm">
              <svg
                className="w-6 h-6 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-white hidden sm:block font-display tracking-tight">MusicDiscover</span>
          </Link>

          <div className="hidden lg:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-spotify-green transition-colors font-display font-semibold text-sm"
            >
              Home
            </Link>
            <Link
              href="/browse/genre"
              className="text-gray-300 hover:text-spotify-green transition-colors font-display font-semibold text-sm"
            >
              Genres
            </Link>
            <Link
              href="/browse/context"
              className="text-gray-300 hover:text-spotify-green transition-colors font-display font-semibold text-sm"
            >
              Contexts
            </Link>
            <Link
              href="/upload"
              className="bg-spotify-green text-black px-6 py-2.5 rounded-xl hover:bg-[#1ed760] transition-all font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] text-sm"
            >
              Upload
            </Link>
          </nav>

          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-foreground hover:text-spotify-green transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/browse/genre"
              className="block py-2 text-foreground hover:text-spotify-green transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse by Genre
            </Link>
            <Link
              href="/browse/context"
              className="block py-2 text-foreground hover:text-spotify-green transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse by Context
            </Link>
            <Link
              href="/upload"
              className="block mt-2 bg-spotify-green text-white px-6 py-3 rounded-full hover:bg-[#1ed760] transition-colors font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Music
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
