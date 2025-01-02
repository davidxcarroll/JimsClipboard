import { useState, useEffect } from 'react';
import { scheduleService } from '../services/espn/schedule';

export function useSchedule() {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCurrentWeek() {
      try {
        const week = await scheduleService.getCurrentWeek();
        setCurrentWeek(week);
        
        // Load games for current week
        const weekGames = await scheduleService.getWeekGames(
          week.number, 
          week.type
        );
        setGames(weekGames);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentWeek();
  }, []);

  // Function to load a specific week
  const loadWeek = async (weekNumber, seasonType) => {
    setLoading(true);
    try {
      const weekGames = await scheduleService.getWeekGames(weekNumber, seasonType);
      setGames(weekGames);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    currentWeek, 
    games, 
    loading, 
    error,
    loadWeek 
  };
}