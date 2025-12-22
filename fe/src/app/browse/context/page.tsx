import Link from 'next/link';
import { VIDEO_CONTEXTS, CONTEXT_TO_GENRES } from '@/lib/constants';

export default function BrowseByContextPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Browse by Video Context</h1>
        <p className="text-gray-400">
          Find music perfect for your video editing needs. Each context is
          curated based on genre characteristics and common usage patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEO_CONTEXTS.map((context) => (
          <Link
            key={context.value}
            href={`/browse/context/${context.value}`}
            className="group bg-card-bg p-8 rounded-lg hover:bg-hover transition-all border border-border hover:border-spotify-green"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-spotify-green/20 rounded-lg flex items-center justify-center group-hover:bg-spotify-green/30 transition-all group-hover:scale-110 duration-300 flex-shrink-0">
                <ContextIcon context={context.value} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white group-hover:text-spotify-green transition-colors mb-2">
                  {context.label}
                </h3>
                <p className="text-gray-400 mb-4">{context.description}</p>
                <div className="flex flex-wrap gap-2">
                  {CONTEXT_TO_GENRES[context.value].slice(0, 5).map((genre) => (
                    <span
                      key={genre}
                      className="text-xs px-3 py-1 bg-spotify-green/10 text-spotify-green rounded-full border border-spotify-green/20"
                    >
                      {genre}
                    </span>
                  ))}
                  {CONTEXT_TO_GENRES[context.value].length > 5 && (
                    <span className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full">
                      +{CONTEXT_TO_GENRES[context.value].length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-card-bg rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-3">
          How Context Mapping Works
        </h2>
        <p className="text-gray-400 mb-4">
          Our system maps music genres to video contexts based on production
          experience and genre characteristics:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Funny:</strong> Upbeat, energetic
              genres like Electronic, Hip-Hop, and Rock
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Vlog:</strong> Easy-listening
              genres perfect for casual daily content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Drama:</strong> Emotional and
              impactful genres like Classical, Folk, and Old-Time Historic
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Cinematic:</strong> Epic and
              atmospheric genres for film-quality productions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Gaming:</strong> High-energy and
              immersive genres like Electronic, Rock, and Hip-Hop for gaming
              content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Action:</strong> Fast-paced and
              intense genres like Electronic, Rock, and Hip-Hop for thrilling
              sequences
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Romantic:</strong> Soft and
              emotional genres like Classical, Folk, and Instrumental for love
              stories
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Horror:</strong> Dark and
              suspenseful genres like Experimental and Electronic for thriller
              content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Documentary:</strong> Neutral and
              informative genres like Classical, Folk, and Instrumental
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Travel:</strong> Adventurous genres
              like Folk and Instrumental for exploration content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Corporate:</strong> Professional
              genres like Classical, Electronic, and Instrumental for business
              videos
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Sports:</strong> Energetic genres
              like Electronic, Hip-Hop, and Rock for athletic highlights
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-spotify-green mt-1">•</span>
            <span>
              <strong className="text-white">Wedding:</strong> Elegant genres
              like Classical, Instrumental, and Old-Time Historic for special
              occasions
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ContextIcon({ context }: { context: string }) {
  const icons = {
    funny: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    vlog: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    drama: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    cinematic: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
    gaming: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
    action: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    romantic: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    horror: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    documentary: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    travel: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    corporate: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    sports: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    wedding: (
      <svg
        className="w-10 h-10 text-spotify-green"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  };
  return icons[context as keyof typeof icons] || icons.vlog;
}
