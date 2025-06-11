import { useRef, useCallback } from 'react';

export interface UseDebounceOptions {
  /**
   * The delay in milliseconds before executing the function
   * @default 300
   */
  delay?: number;
}

export interface UseDebounceReturn<T extends (...args: any[]) => any> {
  /**
   * The debounced function
   */
  debouncedFn: T;
  
  /**
   * Cancel the pending execution
   */
  cancel: () => void;
  
  /**
   * Execute the function immediately
   */
  flush: () => void;
}

/**
 * Custom hook to debounce function calls
 * 
 * @param {T} fn - The function to debounce
 * @param {UseDebounceOptions} options - Configuration options
 * 
 * @returns {UseDebounceReturn<T>} - An object containing the debounced function and control methods
 * 
 * @example
 * const { debouncedFn, cancel, flush } = useDebounce(
 *   (query: string) => searchProfiles(query),
 *   { delay: 500 }
 * );
 * 
 * // Use in onChange handler
 * const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   debouncedFn(e.target.value);
 * };
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  { delay = 300 }: UseDebounceOptions = {}
): UseDebounceReturn<T> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fnRef = useRef(fn);
  
  // Update function reference when it changes
  fnRef.current = fn;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    cancel();
    
    timeoutRef.current = setTimeout(() => {
      fnRef.current(...args);
      timeoutRef.current = null;
    }, delay);
  }, [delay, cancel]) as T;

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      fnRef.current();
      timeoutRef.current = null;
    }
  }, []);

  return {
    debouncedFn,
    cancel,
    flush,
  };
} 