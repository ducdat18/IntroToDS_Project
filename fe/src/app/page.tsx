import Link from 'next/link';
import { VIDEO_CONTEXTS, GENRES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating shapes background - Spotify themed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-spotify-green/10 rounded-3xl rotate-12 animate-float blur-xl"></div>
        <div
          className="absolute top-40 right-20 w-40 h-40 bg-spotify-green/15 rounded-full animate-float blur-2xl"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-36 h-36 bg-neon-purple/10 rounded-2xl -rotate-12 animate-float blur-xl"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side - Text */}
            <div className="lg:col-span-7 animate-slide-up">
              <div className="inline-block mb-6 px-4 py-2 bg-spotify-green/20 border-2 border-spotify-green rounded-full text-sm font-bold text-spotify-green">
                🎵 AI-Powered Music Discovery
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
                <span className="block text-white">Music</span>
                <span className="block text-spotify-green">for Creators</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-xl">
                Discover the perfect music for your videos.{' '}
                <span className="text-spotify-green font-semibold">
                  8 genres
                </span>
                , AI automatic classification, unlimited downloads.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/browse/genre"
                  className="group relative bg-spotify-green text-black px-8 py-4 rounded-2xl font-black text-lg border-4 border-spotify-green shadow-[4px_4px_0px_0px_rgba(29,185,84,1)] hover:shadow-[6px_6px_0px_0px_rgba(29,185,84,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Explore Now →
                </Link>
                <Link
                  href="/upload"
                  className="group px-8 py-4 rounded-2xl font-bold text-lg border-4 border-white/20 text-white hover:border-spotify-green hover:bg-spotify-green/10 transition-all"
                >
                  Upload Music
                </Link>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="lg:col-span-5 relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Rotating vinyl record effect */}
                <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-spotify-green/20 rounded-full animate-rotate-slow blur-3xl"></div>
                  <div className="absolute inset-8 bg-gradient-to-br from-spotify-green/80 to-spotify-green rounded-full border-8 border-white/10 shadow-2xl shadow-spotify-green/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl animate-float">🎧</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Video Context - Bento Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black mb-3">
              Video <span className="text-spotify-green">Contexts</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Choose music that fits your video style
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {VIDEO_CONTEXTS.map((context, index) => {
              const isLarge = index === 0;

              return (
                <Link
                  key={context.value}
                  href={`/browse/context/${context.value}`}
                  className={`group relative bg-card-bg ${
                    isLarge ? 'md:col-span-2 md:row-span-2' : ''
                  } p-6 md:p-8 rounded-3xl border-4 border-white/10 hover:border-spotify-green transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-spotify-green/0 group-hover:bg-spotify-green/5 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4 text-4xl md:text-5xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {context.value === 'funny'
                      ? '😂'
                      : context.value === 'vlog'
                      ? '📹'
                      : context.value === 'drama'
                      ? '💔'
                      : context.value === 'cinematic'
                      ? '🎬'
                      : context.value === 'gaming'
                      ? '🎮'
                      : context.value === 'action'
                      ? '⚡'
                      : context.value === 'romantic'
                      ? '💕'
                      : context.value === 'horror'
                      ? '👻'
                      : context.value === 'documentary'
                      ? '📚'
                      : context.value === 'travel'
                      ? '✈️'
                      : context.value === 'corporate'
                      ? '💼'
                      : context.value === 'sports'
                      ? '⚽'
                      : context.value === 'wedding'
                      ? '💍'
                      : '🎵'}
                  </div>
                  <div
                    className={`relative z-10 ${
                      isLarge ? 'h-full flex flex-col justify-between' : ''
                    }`}
                  >
                    <div>
                      <h3
                        className={`${
                          isLarge
                            ? 'text-4xl md:text-5xl'
                            : 'text-2xl md:text-3xl'
                        } font-black text-white group-hover:text-spotify-green transition-colors mb-2`}
                      >
                        {context.label}
                      </h3>
                      <p className="text-gray-400 text-sm md:text-base">
                        {context.description}
                      </p>
                    </div>
                    {isLarge && (
                      <div className="mt-6">
                        <div className="inline-flex items-center gap-2 bg-spotify-green text-black px-4 py-2 rounded-full font-bold text-sm group-hover:gap-3 transition-all">
                          Explore →
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Genre - Enhanced Grid */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,185,84,0.05),transparent_50%)]"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-3 font-display">
                8 <span className="text-spotify-green">Genres</span>
              </h2>
              <p className="text-gray-400 text-lg">
                From Classical to Hip-Hop, find your favorite genre
              </p>
            </div>
            <Link
              href="/browse/genre"
              className="group bg-spotify-green text-black px-8 py-4 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all inline-flex items-center gap-2"
            >
              View All
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Genre Grid with staggered animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {GENRES.map((genre, index) => {
              // Different sizes for visual variety
              const isLarge = index % 5 === 0;
              const isMedium = index % 3 === 0 && !isLarge;

              return (
                <Link
                  key={genre}
                  href={`/browse/genre/${genre
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  className={`group relative ${
                    isLarge
                      ? 'md:col-span-2 md:row-span-2'
                      : isMedium
                      ? 'md:col-span-2'
                      : ''
                  } bg-card-bg rounded-2xl border-4 border-white/10 hover:border-spotify-green transition-all duration-300 overflow-hidden`}
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    animation: 'slideUp 0.6s ease-out backwards',
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/0 to-spotify-green/0 group-hover:from-spotify-green/20 group-hover:to-spotify-green/5 transition-all duration-300"></div>

                  {/* Content */}
                  <div
                    className={`relative z-10 ${
                      isLarge ? 'p-8' : 'p-4'
                    } h-full flex flex-col justify-center items-center text-center`}
                  >
                    {/* Icon */}
                    <div
                      className={`${
                        isLarge
                          ? 'text-5xl mb-4'
                          : isMedium
                          ? 'text-3xl mb-2'
                          : 'text-2xl mb-2'
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      🎵
                    </div>

                    {/* Genre name */}
                    <h3
                      className={`${
                        isLarge
                          ? 'text-2xl md:text-3xl'
                          : isMedium
                          ? 'text-lg'
                          : 'text-sm md:text-base'
                      } font-black text-white group-hover:text-spotify-green transition-colors font-display leading-tight`}
                    >
                      {genre}
                    </h3>

                    {/* Decorative element on large cards */}
                    {isLarge && (
                      <div className="mt-4 w-12 h-1 bg-spotify-green/30 group-hover:bg-spotify-green group-hover:w-16 transition-all"></div>
                    )}
                  </div>

                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-spotify-green/0 group-hover:border-r-spotify-green transition-all duration-300"></div>
                </Link>
              );
            })}
          </div>

          {/* Bottom decorative text */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm font-display">
              <span className="text-spotify-green font-bold">AI-powered</span>{' '}
              genre classification for precise music discovery
            </p>
          </div>
        </div>
      </section>

      {/* Features - Card Style */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Why choose{' '}
              <span className="text-spotify-green">MusicDiscover</span>?
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful tools for video creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🤖',
                title: 'AI Classification',
                description:
                  'AI automatically recognizes 8 music genres, accurately and quickly',
              },
              {
                emoji: '🎬',
                title: 'Context Mapping',
                description:
                  'Suggest music suitable for each video type: funny, vlog, drama, cinematic',
              },
              {
                emoji: '⚡',
                title: 'Download & Share',
                description:
                  'Upload music easily, unlimited downloads, community sharing',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-card-bg p-8 rounded-3xl border-4 border-white/10 hover:border-spotify-green transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-spotify-green/0 group-hover:bg-spotify-green/5 transition-all"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-all duration-300">
                    {feature.emoji}
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white group-hover:text-spotify-green transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/5 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Ready to find the perfect{' '}
            <span className="text-spotify-green">soundtrack</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Thousands of tracks are waiting for you to discover
          </p>
          <Link
            href="/browse/genre"
            className="inline-block bg-spotify-green text-black px-12 py-6 rounded-2xl font-black text-xl border-4 border-spotify-green shadow-[6px_6px_0px_0px_rgba(29,185,84,1)] hover:shadow-[8px_8px_0px_0px_rgba(29,185,84,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Get Started Now 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}

function ContextIcon({ context }: { context: string }) {
  const icons = {
    funny: (
      <svg
        className="w-6 h-6 text-spotify-green"
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
        className="w-6 h-6 text-spotify-green"
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
        className="w-6 h-6 text-spotify-green"
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
        className="w-6 h-6 text-spotify-green"
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
        className="w-6 h-6 text-spotify-green"
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
  };
  return icons[context as keyof typeof icons] || icons.vlog;
}
