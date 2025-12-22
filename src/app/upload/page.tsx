'use client';

import { useState } from 'react';
import { musicApi } from '@/lib/api/musicApi';
import type { Genre, VideoContext } from '@/types';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    genre: Genre;
    contexts: VideoContext[];
    musicId: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist) return;

    setIsUploading(true);
    setError(null);

    try {
      // Call API to upload and classify music
      const result = await musicApi.uploadMusic({ file, title, artist });

      setUploadResult({
        genre: result.detectedGenre,
        contexts: result.music.suggestedContexts,
        musicId: result.music.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload music');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTitle('');
    setArtist('');
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Upload Music</h1>
          <p className="text-gray-400">
            Share your music with the community. Our AI will automatically detect the genre and suggest appropriate video contexts.
          </p>
        </div>

        {!uploadResult ? (
          <form onSubmit={handleSubmit} className="bg-card-bg p-8 rounded-lg border border-border">
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Music Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-spotify-green"
                placeholder="Enter song title"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Artist Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-spotify-green"
                placeholder="Enter artist name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Audio File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-spotify-green transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div>
                      <svg className="w-12 h-12 mx-auto mb-3 text-spotify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="text-white font-medium mb-1">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-spotify-green mt-2">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-white font-medium mb-1">Click to upload audio file</p>
                      <p className="text-sm text-gray-400">MP3, WAV, FLAC, or other audio formats</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="bg-spotify-green/10 border border-spotify-green/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-spotify-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">AI Genre Classification</p>
                  <p>
                    After upload, our AI will analyze the audio and automatically classify it into one of 16 music genres.
                    Based on the detected genre, we'll suggest appropriate video contexts for your music.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !file || !title || !artist}
              className="w-full bg-spotify-green text-white py-4 rounded-full font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing with AI...
                </>
              ) : (
                'Upload & Classify'
              )}
            </button>
          </form>
        ) : (
          <div className="bg-card-bg p-8 rounded-lg border border-spotify-green">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-spotify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
              <p className="text-gray-400">Your music has been analyzed and added to the library.</p>
            </div>

            <div className="bg-background p-6 rounded-lg mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Title</h3>
                  <p className="text-white font-semibold">{title}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Artist</h3>
                  <p className="text-white font-semibold">{artist}</p>
                </div>
              </div>
            </div>

            <div className="bg-spotify-green/10 border border-spotify-green/30 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-spotify-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                AI Detected Genre
              </h3>
              <p className="text-2xl font-bold text-spotify-green mb-4">{uploadResult.genre}</p>

              <h4 className="text-white font-semibold mb-2">Suggested Video Contexts:</h4>
              <div className="flex flex-wrap gap-2">
                {uploadResult.contexts.map((context) => (
                  <span
                    key={context}
                    className="px-4 py-2 bg-spotify-green/20 text-spotify-green rounded-full text-sm font-medium border border-spotify-green/30"
                  >
                    {context.charAt(0).toUpperCase() + context.slice(1)}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Based on the detected genre, this music is recommended for {uploadResult.contexts.join(', ')} video content.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 bg-spotify-green text-white py-3 rounded-full font-semibold hover:bg-[#1ed760] transition-colors"
              >
                Upload Another
              </button>
              <a
                href={`/music/${uploadResult.musicId}`}
                className="flex-1 bg-transparent border-2 border-spotify-green text-spotify-green py-3 rounded-full font-semibold hover:bg-spotify-green hover:text-white transition-colors text-center"
              >
                View Details
              </a>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-card-bg rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-white mb-3">Upload Guidelines</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-spotify-green mt-1">•</span>
              <span>Ensure you have the rights to share the music you upload</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-spotify-green mt-1">•</span>
              <span>Audio files should be in good quality (MP3, WAV, FLAC recommended)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-spotify-green mt-1">•</span>
              <span>The AI will analyze audio features to determine the most appropriate genre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-spotify-green mt-1">•</span>
              <span>Video context suggestions are based on genre-to-context mapping from editing experience</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
