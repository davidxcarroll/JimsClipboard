import { espnApi } from './api';
import { ESPN_TEAM_ABBREVIATIONS } from '../../utils/teamMapping';

export class ScheduleService {

  canMakePicksForWeek(games) {
    // Check if there are any games that haven't started yet (status === 'pre')
    return games.some(game => game.status === 'pre');
  }

  constructor() {
    this.currentWeek = null;
    this.schedule = null;
    this.processedGames = new Map(); // Cache processed games
  }

  async getCurrentWeek() {
    try {
      const response = await espnApi.get('/scoreboard');
      if (!response?.leagues?.[0]?.calendar) {
        return null;
      }
  
      const now = new Date();
      const calendar = response.leagues[0].calendar;
      
      let currentPeriod = null;
      for (const period of calendar) {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        
        if (now >= startDate && now <= endDate) {
          currentPeriod = period;
          break;
        }
      }
  
      if (!currentPeriod) {
        console.warn('No current period found in calendar');
        return null;
      }
  
      if (currentPeriod.label === 'Postseason') {
        for (const entry of currentPeriod.entries) {
          const startDate = new Date(entry.startDate);
          const endDate = new Date(entry.endDate);
          
          if (now >= startDate && now <= endDate) {
            let weekType;
            let normalizedLabel = entry.label;

            switch(entry.label) {
              case 'Wild Card':
              case 'Wild Card Round': 
                weekType = 1; 
                normalizedLabel = 'Wild Card';
                break;
              case 'Divisional':
              case 'Divisional Round': 
                weekType = 2; 
                normalizedLabel = 'Divisional';
                break;
              case 'Conference':
              case 'Conference Championship': 
                weekType = 3; 
                normalizedLabel = 'Conference';
                break;
              case 'Pro Bowl': 
                weekType = 4; 
                normalizedLabel = 'Pro Bowl';
                break;
              case 'Super Bowl': 
                weekType = 5; 
                normalizedLabel = 'Super Bowl';
                break;
              default: 
                weekType = null;
            }
  
            if (import.meta.env.DEV) {
              console.debug('📅 Current Week from Calendar:', {
                label: normalizedLabel,
                weekType,
                startDate,
                endDate,
                now
              });
            }
  
            return {
              number: parseInt(entry.value),
              type: weekType,
              seasonType: 3, // Postseason
              label: normalizedLabel,
              startDate,
              endDate
            };
          }
        }
      }
  
      return {
        number: parseInt(currentPeriod.value),
        type: null,
        seasonType: 2, // Regular season
        label: currentPeriod.label,
        startDate: new Date(currentPeriod.startDate),
        endDate: new Date(currentPeriod.endDate)
      };
  
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

  async getWeekGames(weekNumber, weekType) {
    try {
      this.clearCache();

      // Map week type to season type
      // weekType: undefined/null = regular season (2)
      // weekType: 1 = Wild Card (3)
      // weekType: 2 = Divisional (3)
      // weekType: 3 = Conference (3)
      // weekType: 4 = Super Bowl (3)
      const seasonType = weekType >= 1 ? 3 : 2;

      if (import.meta.env.DEV) {
        console.debug('🏈 Getting games for:', {
          weekNumber,
          weekType,
          seasonType,
        });
      }

      const response = await espnApi.get(`/scoreboard?week=${weekNumber}&seasontype=${seasonType}`);

      if (!response?.events) {
        console.warn('No events found in response');
        return [];
      }

      // Debug logging
      if (import.meta.env.DEV) {
        console.debug('🏈 Week Events:', {
          weekNumber,
          weekType,
          seasonType,
          totalEvents: response.events.length
        });
      }

      // Filter events for the correct week and season type
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