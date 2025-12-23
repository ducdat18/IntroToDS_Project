/**
 * Audio streaming proxy API route
 * Proxies audio streaming from the backend to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1_URL = `${API_URL}/api/v1`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch the audio file from the backend streaming endpoint
    const response = await fetch(`${API_V1_URL}/stream/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: response.status }
      );
    }

    // Get the audio data as a blob
    const audioBlob = await response.blob();

    // Create a new response with the audio data
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Length': response.headers.get('Content-Length') || '',
        'Content-Disposition': 'inline',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error streaming audio:', error);
    return NextResponse.json(
      { error: 'Failed to stream audio' },
      { status: 500 }
    );
  }
}

