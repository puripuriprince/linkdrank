import { useState, useEffect, useRef } from 'react';
import { getTotalProfilesCount } from '@/actions/profiles';

export interface UseProfileCountReturn {
  /**
   * The current profile count
   */
  count: number;
  
  /**
   * Whether the count is currently being loaded
   */
  loading: boolean;
  
  /**
   * Error if the count failed to load
   */
  error: string | null;
  
  /**
   * Manually refresh the count
   */
  refresh: () => Promise<void>;
}

/**
 * Custom hook to get and cache the total profile count
 * Prevents unnecessary re-renders and API calls
 * 
 * @returns {UseProfileCountReturn} - An object containing count, loading state and refresh function
 * 
 * @example
 * const { count, loading, error, refresh } = useProfileCount();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return <div>{count.toLocaleString()} profiles</div>;
 */
export function useProfileCount(): UseProfileCountReturn {
  const [count, setCount] = useState<number>(5804335); // Default fallback
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef<boolean>(false);
  const cacheTimestamp = useRef<number>(0);
  
  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchCount = async () => {
    const now = Date.now();
    
    // Check if we have cached data that's still fresh
    if (hasInitialized.current && (now - cacheTimestamp.current) < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalCount = await getTotalProfilesCount();
      setCount(totalCount);
      cacheTimestamp.current = now;
      hasInitialized.current = true;
    } catch (err) {
      console.error('Error fetching profile count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile count');
      // Keep the default fallback count on error
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    // Force refresh by resetting cache
    cacheTimestamp.current = 0;
    await fetchCount();
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return {
    count,
    loading,
    error,
    refresh,
  };
} 