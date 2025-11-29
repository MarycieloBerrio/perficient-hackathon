// Hook for automatic real-time data polling
import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval: number;
  onError?: (error: Error) => void;
}

/**
 * Custom hook to execute a function periodically (polling)
 * @param callback - Function to execute periodically
 * @param options - Polling configuration options
 */
export function usePolling(
  callback: () => Promise<void> | void,
  options: UsePollingOptions
) {
  const { enabled = true, interval, onError } = options;
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update saved callback when it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // If polling is disabled, do nothing
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Execute immediately the first time
    const executeCallback = async () => {
      try {
        await savedCallback.current();
      } catch (error) {
        console.error('Error in polling:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };

    // Execute callback immediately
    executeCallback();

    // Set up interval for periodic executions
    intervalRef.current = setInterval(executeCallback, interval);

    // Cleanup: clear the interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, onError]);
}

