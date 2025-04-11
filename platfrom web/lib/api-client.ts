// API client for communicating with the Flask backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

/**
 * Fetch data from the API
 */
export async function fetchFromApi<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `API Error: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Get all available images from the API
 */
export async function getImages() {
  return fetchFromApi<{images: {filename: string, url: string, source: string}[]}>('/api/assets/images');
}

/**
 * Get database information
 */
export async function getDatabase() {
  return fetchFromApi('/api/database');
}

/**
 * Get image URL
 */
export function getImageUrl(filename: string, source: 'project' | 'backend' = 'project') {
  if (source === 'project') {
    return `${API_BASE_URL}/api/assets/project-images/${filename}`;
  }
  return `${API_BASE_URL}/api/assets/images/${filename}`;
} 