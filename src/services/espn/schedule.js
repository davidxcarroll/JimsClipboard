import { espnApi } from './api';
import { ESPN_TEAM_ABBREVIATIONS } from '../../utils/teamMapping';

export class ScheduleService {
  constructor() {
    this.currentWeek = null;
    this.schedule = null;
    this.processedGames = new Map();
  }

  async getCurrentWeek() {
    try {
      const response = await espnApi.get('/scoreboard');
      if (!response?.leagues?.[0]?.calendar) {
        return null;
      }
  
      const now = new Date();
      const calendar = response.leagues[0].calendar;
      
      // Find the current period (regular season or postseason)
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
        // Sort playoff entries by date
        const sortedEntries = [...currentPeriod.entries].sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        // Find the current or next playoff round
        let targetEntry = null;
        let isTransitionPeriod = false;

        for (let i = 0; i < sortedEntries.length; i++) {
          const entry = sortedEntries[i];
          const startDate = new Date(entry.startDate);
          const endDate = new Date(entry.endDate);
          const nextEntry = sortedEntries[i + 1];
          
          if (now >= startDate && now <= endDate) {
            // We're in this round - check if games are complete
            const games = await this.getWeekGames(parseInt(entry.value), this.getWeekType(entry.label));
            const allGamesComplete = games.every(game => game.status === 'post');
            
            if (allGamesComplete && nextEntry) {
              // If all games are done and there's a next round, show the next round
              targetEntry = nextEntry;
              isTransitionPeriod = true;
            } else {
              // If games aren't done or there's no next round, show current round
              targetEntry = entry;
            }
            break;
          } else if (now < startDate) {
            // If we're before this round's start, this is the next upcoming round
            targetEntry = entry;
            isTransitionPeriod = true;
            break;
          }
        }

        // If we didn't find a target entry, use the last playoff round
        if (!targetEntry && sortedEntries.length > 0) {
          targetEntry = sortedEntries[sortedEntries.length - 1];
        }

        if (targetEntry) {
          return {
            number: parseInt(targetEntry.value),
            type: this.getWeekType(targetEntry.label),
            seasonType: 3, // Postseason
            label: this.normalizeLabel(targetEntry.label),
            startDate: new Date(targetEntry.startDate),
            endDate: new Date(targetEntry.endDate),
            isTransitionPeriod
          };
        }
      }
  
      // Regular season logic remains the same
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

  getWeekType(label) {
    switch(label) {
      case 'Wild Card':
      case 'Wild Card Round': 
        return 1;
      case 'Divisional':
      case 'Divisional Round': 
        return 2;
      case 'Conference':
      case 'Conference Championship': 
        return 3;
      case 'Pro Bowl': 
        return 4;
      case 'Super Bowl': 
        return 5;
      default: 
        return null;
    }
  }

  normalizeLabel(label) {
    switch(label) {
      case 'Wild Card Round': 
        return 'Wild Card';
      case 'Divisional Round': 
        return 'Divisional';
      case 'Conference Championship': 
        return 'Conference';
      default: 
        return label;
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