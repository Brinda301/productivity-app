'use client';
import { useState, useCallback } from 'react';

interface UseApiOptions {
  baseUrl?: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T>(options: UseApiOptions = {}) {
  const { baseUrl = '' } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${res.statusText}`);
      }
      
      const responseData = await res.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const get = useCallback((endpoint: string) => request(endpoint, 'GET'), [request]);
  const post = useCallback((endpoint: string, body: any) => request(endpoint, 'POST', body), [request]);
  const patch = useCallback((endpoint: string, body: any) => request(endpoint, 'PATCH', body), [request]);
  const del = useCallback((endpoint: string) => request(endpoint, 'DELETE'), [request]);

  return { data, error, loading, get, post, patch, del, request };
}
