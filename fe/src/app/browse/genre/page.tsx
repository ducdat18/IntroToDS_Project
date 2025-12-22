import Link from 'next/link';
import { GENRES } from '@/lib/constants';

export default function BrowseByGenrePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Browse by Genre</h1>
        <p className="text-gray-400">
          Explore music organized by AI-detected genres. Click on a genre to view all songs in that category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {GENRES.map((genre) => (
          <Link
            key={genre}
            href={`/browse/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
            className="group bg-card-bg p-6 rounded-lg hover:bg-hover transition-all border border-border hover:border-spotify-green"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 bg-spotify-green/20 rounded-full flex items-center justify-center group-hover:bg-spotify-green/30 transition-colors group-hover:scale-110 duration-300">
                <svg
                  className="w-12 h-12 text-spotify-green"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-spotify-green transition-colors">
                {genre}
              </h3>
              <p className="text-sm text-gray-400 mt-2">View all tracks</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
