'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import MusicCard from '@/components/music/MusicCard';
import { useMusicByContext } from '@/hooks/useMusic';
import { LoadingGrid } from '@/components/ui/LoadingSpinner';
import ErrorMessage, { EmptyState } from '@/components/ui/ErrorMessage';
import { VIDEO_CONTEXTS, CONTEXT_TO_GENRES } from '@/lib/constants';
import type { VideoContext } from '@/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ContextDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  // Check if context exists
  const contextData = VIDEO_CONTEXTS.find((c) => c.value === slug);
  if (!contextData) {
    notFound();
  }

  const context = slug as VideoContext;
  const { music: musicList, loading, error } = useMusicByContext(context);
  const relatedGenres = CONTEXT_TO_GENRES[context];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/browse/context" className="hover:text-spotify-green">
            Browse by Context
          </Link>
          <span>/</span>
          <span className="text-white">{contextData.label}</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">{contextData.label} Music</h1>
        <p className="text-gray-400 text-lg mb-6">{contextData.description}</p>

        <div className="bg-card-bg p-6 rounded-lg border border-border">
          <h3 className="text-white font-semibold mb-3">Related Genres</h3>
          <div className="flex flex-wrap gap-2">
            {relatedGenres.map((genre) => (
              <Link
                key={genre}
                href={`/browse/genre/${genre
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-spotify-green/20 text-spotify-green rounded-full text-sm font-medium border border-spotify-green/30 hover:bg-spotify-green/30 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
          {!loading && (
            <p className="text-sm text-gray-400 mt-3">
              {musicList.length} {musicList.length === 1 ? 'track' : 'tracks'}{' '}
              available for {contextData.label.toLowerCase()} videos
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingGrid count={8} />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      ) : musicList.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Tracks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {musicList.map((music) => (
              <MusicCard key={music.id} music={music} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No tracks yet"
          message={`Be the first to upload music suitable for ${contextData.label.toLowerCase()} videos!`}
          actionLabel="Upload Music"
          actionHref="/upload"
        />
      )}

      <div className="mt-12 p-6 bg-card-bg rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-white mb-3">
          Using {contextData.label} Music in Your Videos
        </h3>
        <UsageGuide context={context} />
      </div>
    </div>
  );
}

function UsageGuide({ context }: { context: VideoContext }) {
  const guides: Record<VideoContext, React.ReactElement> = {
    funny: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Use upbeat, energetic tracks to enhance comedic timing</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Electronic and Hip-Hop genres work well for fast-paced edits
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Match beats with visual gags for maximum impact</span>
        </li>
      </ul>
    ),
    vlog: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Choose easy-listening tracks that don't overpower dialogue
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Folk and Instrumental genres create a relaxed, authentic atmosphere
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Keep volume levels lower to maintain focus on your message
          </span>
        </li>
      </ul>
    ),
    drama: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Use emotional tracks to amplify dramatic moments</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Classical and Folk genres enhance emotional storytelling</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Build tension with gradual volume and intensity changes</span>
        </li>
      </ul>
    ),
    cinematic: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Choose epic, atmospheric tracks for professional production value
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Classical and Instrumental genres create a film-quality feel
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Layer music with sound effects for immersive storytelling</span>
        </li>
      </ul>
    ),
    gaming: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use high-energy tracks to match the intensity of gameplay moments
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Electronic and Rock genres provide the perfect energy for gaming
            content
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Instrumental tracks work well to avoid distracting from commentary
          </span>
        </li>
      </ul>
    ),
    action: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use fast-paced, intense tracks to build excitement and tension
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Electronic, Rock, and Hip-Hop genres create dynamic action sequences
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Sync music beats with action cuts for maximum impact</span>
        </li>
      </ul>
    ),
    romantic: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Choose soft, emotional tracks that enhance romantic moments
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Classical, Folk, and Instrumental genres create a warm, intimate
            atmosphere
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>Use slower tempos to allow emotional moments to breathe</span>
        </li>
      </ul>
    ),
    horror: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Select dark, atmospheric tracks that build suspense and tension
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Experimental and Electronic genres work well for unsettling
            soundscapes
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use dissonant sounds and sudden changes to create jump scares
          </span>
        </li>
      </ul>
    ),
    documentary: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Choose neutral, informative tracks that support narration without
            distraction
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Classical, Folk, and Instrumental genres provide authentic, timeless
            feel
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Keep music subtle to maintain focus on the content and dialogue
          </span>
        </li>
      </ul>
    ),
    travel: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use adventurous and inspiring tracks that capture the spirit of
            exploration
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Folk and Instrumental genres create an authentic, wanderlust
            atmosphere
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Match music style to the destination's cultural vibe for
            authenticity
          </span>
        </li>
      </ul>
    ),
    corporate: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Select professional, polished tracks that convey trust and
            reliability
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Classical, Electronic, and Instrumental genres maintain a
            business-appropriate tone
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Keep music modern but not distracting to maintain professional
            credibility
          </span>
        </li>
      </ul>
    ),
    sports: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use energetic and motivational tracks that amplify athletic
            achievements
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Electronic, Hip-Hop, and Rock genres provide the perfect pump-up
            energy
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Sync music with key moments like goals, touchdowns, or victories for
            impact
          </span>
        </li>
      </ul>
    ),
    wedding: (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Choose elegant and celebratory tracks that enhance the special
            occasion
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Classical, Instrumental, and Old-Time Historic genres create
            timeless elegance
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Use softer tracks for ceremonies and more upbeat music for
            receptions
          </span>
        </li>
      </ul>
    ),
  };

  return (
    guides[context] || (
      <ul className="space-y-2 text-gray-400">
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Select music that matches the tone and style of your video content
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Consider the emotional impact you want to create with your audience
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-spotify-green mt-1">•</span>
          <span>
            Test different tracks to find the perfect match for your project
          </span>
        </li>
      </ul>
    )
  );
}
