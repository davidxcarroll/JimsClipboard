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

        return {
          id: event.id,
          utcDate: event.date,
          status: this.getGameStatus(competition),
          homeTeam: this.getTeamName(homeTeam.team.abbreviation),
          awayTeam: this.getTeamName(awayTeam.team.abbreviation),
          homeRecord: homeTeam.records?.[0]?.summary || '',
          awayRecord: awayTeam.records?.[0]?.summary || '',
          score: competition.status.type.state !== 'pre' ? {
            home: parseInt(homeTeam.score) || 0,
            away: parseInt(awayTeam.score) || 0
          } : null,
          venue: competition.venue?.fullName || '',
          broadcast: competition.broadcasts?.[0]?.names?.[0] || ''
        };
      });
    } catch (error) {
      console.error('Error getting week games:', error);
      return [];
    }
  }

  getGameStatus(competition) {
    // Add your status logic here
    return competition.status?.type?.state || 'unknown';
  }

  getTeamName(abbreviation) {
    return ESPN_TEAM_ABBREVIATIONS[abbreviation] || abbreviation;
  }
}

export const scheduleService = new ScheduleService();