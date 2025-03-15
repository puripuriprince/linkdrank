import { useRef, useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export interface UseCountUpOptions {
  /**
   * The starting number for the count animation
   * @default 0
   */
  start?: number;

  /**
   * The end number for the count animation
   * @required
   */
  end: number;

  /**
   * The duration of the animation in milliseconds
   * @default 2000
   */
  duration?: number;

  /**
   * Delay before starting the animation in milliseconds
   * @default 0
   */
  delay?: number;

  /**
   * Easing function to use for the animation
   * @default 'easeOutQuad'
   */
  easing?: "linear" | "easeOutQuad" | "easeInOutQuad";

  /**
   * Whether to format the number with commas
   * @default false
   */
  formatter?: (value: number) => string;

  /**
   * Whether the animation should autoplay on mount
   * @default true
   */
  autoplay?: boolean;
}

export interface UseCountUpReturn {
  /**
   * The current value of the count
   */
  value: number;

  /**
   * The formatted value of the count (if formatter is provided)
   */
  formattedValue: string;

  /**
   * Whether the animation is currently running
   */
  isPlaying: boolean;

  /**
   * Start the animation
   */
  start: () => void;

  /**
   * Reset the animation to the start value
   */
  reset: () => void;

  /**
   * Pause the animation
   */
  pause: () => void;
}

/**
 * Custom hook to create count-up animations.
 *
 * @param {UseCountUpOptions} options - Configuration options for the animation.
 *
 * @returns {UseCountUpReturn} - An object containing the current value and control functions.
 *
 * @example
 * // Basic usage
 * const { value } = useCountUp({ start: 0, end: 1000 });
 *
 * // With formatting
 * const { formattedValue } = useCountUp({
 *   start: 2000000,
 *   end: 5804335,
 *   formatter: (val) => val.toLocaleString()
 * });
 *
 * // With manual control
 * const { value, start, reset, pause } = useCountUp({
 *   start: 0,
 *   end: 1000,
 *   autoplay: false
 * });
 */
export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  easing = "easeOutQuad",
  formatter = (value: number) => value.toString(),
  autoplay = true,
}: UseCountUpOptions): UseCountUpReturn {
  const [value, setValue] = useState<number>(start);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  // Easing functions
  const getEasedProgress = useCallback(
    (progress: number): number => {
      switch (easing) {
        case "linear":
          return progress;
        case "easeOutQuad":
          return 1 - (1 - progress) * (1 - progress);
        case "easeInOutQuad":
          return progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        default:
          return progress;
      }
    },
    [easing],
  );

  // Animation function
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = pausedAtRef.current
          ? timestamp - pausedAtRef.current
          : timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < delay) {
        // Still in delay phase
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((elapsed - delay) / duration, 1);
      const easedProgress = getEasedProgress(progress);
      const currentValue = Math.floor(start + (end - start) * easedProgress);

      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end at the exact final value
        setValue(end);
        setIsPlaying(false);
      }
    },
    [start, end, duration, delay, getEasedProgress],
  );

  // Start animation
  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsPlaying(true);
    pausedAtRef.current = null;
    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Pause animation
  const pauseAnimation = useCallback(() => {
    if (animationRef.current && startTimeRef.current) {
      cancelAnimationFrame(animationRef.current);
      pausedAtRef.current = performance.now() - startTimeRef.current;
      setIsPlaying(false);
    }
  }, []);

  // Reset animation
  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setValue(start);
    setIsPlaying(false);
    startTimeRef.current = null;
    pausedAtRef.current = null;
  }, [start]);

  // Start animation on mount if autoplay is true
  useEffect(() => {
    if (autoplay) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoplay, startAnimation]);

  return {
    value,
    formattedValue: formatter(value),
    isPlaying,
    start: startAnimation,
    reset: resetAnimation,
    pause: pauseAnimation,
  };
}
