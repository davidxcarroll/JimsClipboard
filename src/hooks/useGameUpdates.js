import { useEffect, useRef } from 'react';
import { useSchedule } from './useSchedule';

export function useGameUpdates(gameIds, interval = 30000) {
  const { updateGames } = useSchedule();
  const intervalRef = useRef();

  useEffect(() => {
    // Initial update
    updateGames(gameIds);

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      updateGames(gameIds);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameIds, interval, updateGames]);
}