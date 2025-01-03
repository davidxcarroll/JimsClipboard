import { espnApi } from './api';
import { ESPN_TEAM_ABBREVIATIONS } from '../../utils/teamMapping'
import { formatToTimeZone } from '../../utils/dateUtils';

export class ScheduleService {
  constructor() {
    this.currentWeek = null;
    this.schedule = null;
  }

  async getCurrentWeek() {
    try {
      const response = await espnApi.get('/scoreboard');
      if (response?.week) {
        return {
          number: response.week.number,
          type: response.week.type
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current week:', error);
      return null;
    }
  }

  getGameStatus(competition) {
    const status = competition.status?.type?.state || 'unknown';
    const homeScore = parseInt(competition.competitors.find(c => c.homeAway === 'home')?.score) || 0;
    const awayScore = parseInt(competition.competitors.find(c => c.homeAway === 'away')?.score) || 0;

    // Determine winner if game is finished
    let winner = null;
    if (status === 'post') {
      winner = homeScore > awayScore ? 'home' : 'away';
    }

    return {
      state: status,
      winner,
      homeScore,
      awayScore
    };
  }

  async getWeekGames(weekNumber, seasonType = 2) {
    try {
      const response = await espnApi.get(`/scoreboard`);

      if (!response?.events) {
        console.warn('No events found in response');
        return [];
      }

      const weekEvents = response.events.filter(event =>
        event.week?.number === parseInt(weekNumber) &&
        event.season?.type === seasonType
      );

      return weekEvents.map(event => {
        const competition = event.competitions[0];
        const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
        const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
        const gameStatus = this.getGameStatus(competition);

        return {
          id: event.id,
          utcDate: event.date,
          status: gameStatus.state,
          homeTeam: homeTeam.team.abbreviation,
          awayTeam: awayTeam.team.abbreviation,
          homeRecord: homeTeam.records?.[0]?.summary || '',
          awayRecord: awayTeam.records?.[0]?.summary || '',
          score: {
            home: gameStatus.homeScore,
            away: gameStatus.awayScore
          },
          winner: gameStatus.winner ?
            (gameStatus.winner === 'home' ? homeTeam.team.abbreviation : awayTeam.team.abbreviation)
            : null,
          venue: competition.venue?.fullName || '',
          broadcast: competition.broadcasts?.[0]?.names?.[0] || ''
        };
      });
    } catch (error) {
      console.error('Error getting week games:', error);
      return [];
    }
  }

  getTeamName(abbreviation) {
    return ESPN_TEAM_ABBREVIATIONS[abbreviation] || abbreviation;
  }
}

export const scheduleService = new ScheduleService();