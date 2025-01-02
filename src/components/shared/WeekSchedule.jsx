import { useSchedule } from '../../hooks/useSchedule';
import { useGameUpdates } from '../../hooks/useGameUpdates';

export function WeekSchedule() {
  const { currentWeek, games, loading, error } = useSchedule();

  if (loading) return <div>Loading schedule...</div>;
  if (error) return <div>Error loading schedule: {error.message}</div>;

  return (
    <div>
      <h2>
        {currentWeek.type === 2 ? 'Regular Season' : 'Postseason'} 
        Week {currentWeek.number}
      </h2>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-time">
              {game.date.toLocaleString()}
            </div>
            <div className="matchup">
              <div className="team home">{game.homeTeam}</div>
              <div className="vs">vs</div>
              <div className="team away">{game.awayTeam}</div>
            </div>
            {game.score && (
              <div className="score">
                {game.score.home} - {game.score.away}
              </div>
            )}
            {game.odds && (
              <div className="odds">
                Spread: {game.odds.spread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}