import { useCallback, useRef } from "react";

/**
 * Custom hook for creating debounced callbacks
 */
export const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number,
  deps: React.DependencyList = [],
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps],
  );
};

/**
 * Custom hook for creating throttled callbacks
 */
export const useThrottledCallback = (
  callback: (...args: any[]) => void,
  delay: number,
  deps: React.DependencyList = [],
) => {
  const lastRun = useRef(0);

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      }
    },
    [callback, delay, ...deps],
  );
};

/**
 * Custom hook for creating stable references
 */
export const useStableRef = (value: any) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

/**
 * Custom hook for creating optimized event handlers
 */
export const useOptimizedHandler = (
  handler: (event: any) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {},
  deps: React.DependencyList = [],
) => {
  return useCallback(
    (event: any) => {
      if (options.preventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }
      handler(event);
    },
    [handler, options.preventDefault, options.stopPropagation, ...deps],
  );
};
