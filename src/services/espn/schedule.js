import { espnApi } from './api';
import { ESPN_TEAM_ABBREVIATIONS } from '../../utils/teamMapping';
import { formatToTimeZone } from '../../utils/dateUtils';

export class ScheduleService {
  constructor() {
    this.currentWeek = null;
    this.schedule = null;
    this.processedGames = new Map(); // Cache processed games
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
    // Cache check
    const cachedGame = this.processedGames.get(competition.id);
    if (cachedGame) return cachedGame;

    try {
      const status = competition.status?.type?.state || 'unknown';
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
      const homeScore = parseInt(homeTeam?.score) || 0;
      const awayScore = parseInt(awayTeam?.score) || 0;

      // Determine winner for completed games
      let winner = null;
      if (status === 'post' || status === 'complete') {
        if (homeScore > awayScore) {
          // Return the full team name instead of abbreviation
          winner = homeTeam.team.name || homeTeam.team.abbreviation;
        } else if (awayScore > homeScore) {
          // Return the full team name instead of abbreviation
          winner = awayTeam.team.name || awayTeam.team.abbreviation;
        }

        if (import.meta.env.DEV) {
          console.log('🏆 Winner determined:', {
            status,
            homeTeam: homeTeam.team.name,
            awayTeam: awayTeam.team.name,
            homeScore,
            awayScore,
            winner
          });
        }
      }

      const gameStatus = {
        state: status,
        winner,
        homeScore,
        awayScore,
        homeTeam: homeTeam.team.abbreviation,
        awayTeam: awayTeam.team.abbreviation
      };

      // Cache the result
      this.processedGames.set(competition.id, gameStatus);
      return gameStatus;
    } catch (error) {
      console.error('Error processing game status:', error);
      return null;
    }
  }

  async getWeekGames(weekNumber, seasonType = 2) {
    try {
      this.clearCache();

      const response = await espnApi.get(`/scoreboard?week=${weekNumber}`);

      if (!response?.events) {
        console.warn('No events found in response');
        return [];
      }

      // Debug the filtered events
      if (import.meta.env.DEV) {
        console.debug('🏈 Week Events:', {
          weekNumber,
          totalEvents: response.events.length,
          events: response.events
        });
      }

      const weekEvents = response.events.filter(event =>
        event.week?.number === parseInt(weekNumber) &&
        event.season?.type === seasonType
      );

      return weekEvents.map(event => {
        const competition = event.competitions[0];
        const gameStatus = this.getGameStatus(competition);

        if (!gameStatus) {
          console.warn(`Failed to process game status for event ${event.id}`);
          return null;
        }

        // Extract favorite team from odds
        let favorite = null;
        if (competition.odds?.[0]?.details) {
          const odds = competition.odds[0];
          favorite = odds.favorite === 'home' ?
            gameStatus.homeTeam :
            gameStatus.awayTeam;
        }

        return {
          id: event.id,
          utcDate: event.date,
          status: gameStatus.state,
          winner: gameStatus.winner,
          homeTeam: gameStatus.homeTeam,
          awayTeam: gameStatus.awayTeam,
          homeRecord: competition.competitors.find(c => c.homeAway === 'home')?.records?.[0]?.summary || '',
          awayRecord: competition.competitors.find(c => c.homeAway === 'away')?.records?.[0]?.summary || '',
          score: {
            home: gameStatus.homeScore,
            away: gameStatus.awayScore
          },
          venue: competition.venue?.fullName || '',
          broadcast: competition.broadcasts?.[0]?.names?.[0] || '',
          favorite: favorite
        };
      }).filter(Boolean);

    } catch (error) {
      console.error('Error getting week games:', error);
      return [];
    }
  }

  getTeamName(abbreviation) {
    return ESPN_TEAM_ABBREVIATIONS[abbreviation] || abbreviation;
  }

  clearCache() {
    this.processedGames.clear();
  }
}

export const scheduleService = new ScheduleService();