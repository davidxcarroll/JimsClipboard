import { addDays, startOfWeek } from 'date-fns';
import { ESPN_TEAM_ABBREVIATIONS, getDisplayName, getEspnAbbreviation } from '../utils/teamMapping'

export function generateMockSchedule(options = {}) {
  const {
    startDate = new Date(),
    numberOfWeeks = 18,
    gamesPerWeek = 16,
  } = options;

  const teams = Object.keys(teamMapping);
  
  const schedule = {
    year: startDate.getFullYear(),
    type: 'regular',
    currentWeek: 1,
    weeks: [],
  };

  for (let week = 1; week <= numberOfWeeks; week++) {
    const weekStart = addDays(startOfWeek(startDate), (week - 1) * 7);
    const weekGames = [];
    const availableTeams = [...teams];

    // Generate random matchups for the week
    for (let game = 0; game < gamesPerWeek && availableTeams.length >= 2; game++) {
      // Randomly select home and away teams from available teams
      const homeIdx = Math.floor(Math.random() * availableTeams.length);
      const homeTeam = availableTeams.splice(homeIdx, 1)[0];
      
      const awayIdx = Math.floor(Math.random() * availableTeams.length);
      const awayTeam = availableTeams.splice(awayIdx, 1)[0];

      weekGames.push({
        id: `${week}-${game}`,
        homeTeam,
        awayTeam,
        date: addDays(weekStart, game % 3), // Spread games across 3 days
        status: 'scheduled',
      });
    }

    schedule.weeks.push({
      weekNumber: week,
      startDate: weekStart,
      endDate: addDays(weekStart, 6),
      games: weekGames,
    });
  }

  return schedule;
}