import { useCallback, useRef } from 'react';

/**
 * Custom hook for creating optimized callbacks with debouncing
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @param deps Dependencies array for useCallback
 * @returns Debounced callback function
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay, ...deps]
  );
};

/**
 * Custom hook for creating throttled callbacks
 * @param callback The function to throttle
 * @param delay The delay in milliseconds
 * @param deps Dependencies array for useCallback
 * @returns Throttled callback function
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const lastRun = useRef(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay, ...deps]
  );
};

/**
 * Custom hook for creating stable references to objects
 * @param value The value to create a stable reference for
 * @returns Stable reference to the value
 */
export const useStableRef = <T>(value: T): React.MutableRefObject<T> => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};

/**
 * Custom hook for creating optimized event handlers
 * @param handler The event handler function
 * @param options Options for the event handler
 * @param deps Dependencies array for useCallback
 * @returns Optimized event handler
 */
export const useOptimizedHandler = <T extends Event>(
  handler: (event: T) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {},
  deps: React.DependencyList = []
) => {
  return useCallback(
    (event: T) => {
      if (options.preventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }
      handler(event);
    },
    [handler, options.preventDefault, options.stopPropagation, ...deps]
  );
};

/**
 * Custom hook for creating optimized state setters
 * @param setState The state setter function
 * @param deps Dependencies array for useCallback
 * @returns Optimized state setter
 */
export const useOptimizedSetter = <T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  deps: React.DependencyList = []
) => {
  return useCallback(
    (value: React.SetStateAction<T>) => {
      setState(value);
    },
    [setState, ...deps]
  );
};
