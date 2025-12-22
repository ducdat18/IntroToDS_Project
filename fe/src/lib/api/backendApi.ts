/**
 * Real Backend API Integration
 * Connects to FastAPI backend for music management and genre detection
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Backend response types matching FastAPI responses
export interface AudioFile {
  id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  content_type: string;
  detected_genre: string | null;
  confidence: number | null;
  bucket_name: string;
  object_key: string;
  uploaded_at: string;
  updated_at: string;
  download_url?: string;
}

export interface UploadResponse {
  message: string;
  file_id: number;
  filename: string;
  detected_genre: string | null;
  confidence: number | null;
}

export interface SearchResponse {
  total: number;
  files: AudioFile[];
}

export interface StatsResponse {
  total_files: number;
  total_size_bytes: number;
  total_size_mb: number;
  genre_distribution: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  device: string;
  model_loaded: boolean;
  minio_connected: boolean;
  database_connected: boolean;
}

/**
 * Backend API Service
 */
export const backendApi = {
  /**
   * Check API health
   * GET /health
   */
  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  },

  /**
   * Upload audio file with genre detection
   * POST /upload
   */
  async uploadAudio(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('audio_file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Failed to upload audio');
    }

    return response.json();
  },

  /**
   * Search audio files
   * GET /search
   */
  async searchAudio(params: {
    genre?: string;
    filename?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.filename) queryParams.append('filename', params.filename);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_URL}/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to search audio files');
    return response.json();
  },

  /**
   * Get file information
   * GET /files/{id}
   */
  async getFileInfo(fileId: number): Promise<AudioFile> {
    const response = await fetch(`${API_URL}/files/${fileId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('File not found');
      throw new Error('Failed to fetch file info');
    }
    return response.json();
  },

  /**
   * Download audio file
   * GET /download/{id}
   */
  async downloadAudio(fileId: number, originalFilename: string): Promise<void> {
    const response = await fetch(`${API_URL}/download/${fileId}`);
    if (!response.ok) throw new Error('Failed to download audio');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFilename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Get streaming URL for audio file
   */
  getStreamUrl(fileId: number): string {
    return `${API_URL}/stream/${fileId}`;
  },

  /**
   * Delete audio file
   * DELETE /files/{id}
   */
  async deleteAudio(fileId: number): Promise<void> {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete audio file');
  },

  /**
   * Get statistics
   * GET /stats
   */
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },

  /**
   * Get all audio files (convenience method)
   */
  async getAllFiles(): Promise<AudioFile[]> {
    const response = await this.searchAudio({ limit: 1000 });
    return response.files;
  },

  /**
   * Get audio files by genre
   */
  async getFilesByGenre(genre: string): Promise<AudioFile[]> {
    const response = await this.searchAudio({ genre, limit: 1000 });
    return response.files;
  },
};

export default backendApi;

