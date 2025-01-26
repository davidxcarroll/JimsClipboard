import React from 'react';
import { getDisplayName, getEspnAbbreviation } from '../../utils/teamMapping';
import { CircleCheck01 } from '../circles/circleCheck01'
import { CircleCheck02 } from '../circles/circleCheck02'
import { CircleCheck03 } from '../circles/circleCheck03'
import { CircleTeamSm } from '../circles/circleTeamSm'
import { CircleTeamMd } from '../circles/circleTeamMd'
import { CircleTeamLg } from '../circles/circleTeamLg'

const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const MatchupRow = React.memo(function MatchupRow({
  gameId,
  homeTeam,
  awayTeam,
  week,
  winningTeam: actualWinningTeam,
  picks,
  users
}) {
  const MOCK_WINNER = ENABLE_MOCKS && gameId === '401671834' ? 'Browns' : undefined;
  const winningTeam = MOCK_WINNER || actualWinningTeam;

  const debug = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🎯 ${message}`, data);
    }
  };

  const didPickTeam = (team, participantId) => {
    if (!picks || !picks[participantId]) return false;
    const teamAbbrev = getEspnAbbreviation(team); // team is display name (e.g. "Commanders")
    const userPick = picks[participantId].team;    // userPick is ESPN abbrev (e.g. "WSH")
    console.log(`didPickTeam check for ${team}:`, {
      displayName: team,
      abbrev: teamAbbrev,    
      userPick,
      matches: userPick === teamAbbrev
    });
    return userPick === teamAbbrev;
  };

  const isCorrectPick = (team, participantId) => {
    if (!winningTeam || !picks?.[participantId]?.team) return false;
    const pickedTeamAbbrev = picks[participantId].team;
    const result = pickedTeamAbbrev === getEspnAbbreviation(team) && winningTeam === getDisplayName(team);
    console.log(`isCorrectPick - team: ${team}, participant: ${participantId}`, {
      pickedTeamAbbrev,
      winningTeam,
      displayName: getDisplayName(team),
      result
    });
    return result;
  };

  const getRandomCircleCheck = () => {
    const circles = [CircleCheck01, CircleCheck02, CircleCheck03];
    return circles[Math.floor(Math.random() * circles.length)];
  };

  const getTeamCircle = (teamName) => {
    if (teamName.length <= 5) return CircleTeamSm;
    if (teamName.length <= 9) return CircleTeamMd;
    return CircleTeamLg;
  };

  const renderTeamName = (team, isWinner) => {
    const displayName = getDisplayName(team);
    const TeamCircle = getTeamCircle(displayName);

    return (
      <span className="relative inline-block">
        {isWinner && week === 18 && <TeamCircle />}
        {displayName}
      </span>
    );
  };

  const renderCheckmark = (team, participantId) => {
    console.log(`Rendering checkmark for ${team}:`, {
      team,
      week,
      picks,
      participantId,
      winningTeam,
      hasTeamPick: picks?.[participantId]?.team
    });
  
    const picked = didPickTeam(team, participantId);
    console.log('Did pick team result:', picked);
  
    if (!picked) return null;
  
    const isCorrect = isCorrectPick(team, participantId);
    console.log('Is correct pick result:', isCorrect);
    
    const showCircle = isCorrect && week === 18 && team === winningTeam;
  
    return (
      <div className="relative">
        {showCircle && <CircleCheck />}
        ✔
      </div>
    );
  };

  return (
    <div className="flex flex-col jim-casual lg:text-5xl md:text-4xl text-3xl">
      {/* Home Team Row */}
      <div className="flex flex-row">
        <div className="flex-1 h-auto min-w-[150px] flex items-center justify-start py-2 bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
          <div className="md:px-8 px-2">{renderTeamName(homeTeam, winningTeam === homeTeam)}</div>
        </div>

        {users.map((user) => (
          <React.Fragment key={user.id}>
            <div className="w-[1.5px] bg-black" />
            <div className="flex-1 h-auto min-w-[30px] flex items-center justify-center">
              {renderCheckmark(homeTeam, user.id)}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-[1.5px] bg-black" />

      {/* Away Team Row */}
      <div className="flex flex-row">
        <div className="flex-1 h-auto min-w-[150px] flex items-center justify-start py-2 bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
          <div className="md:px-8 px-2">{renderTeamName(awayTeam, winningTeam === awayTeam)}</div>
        </div>

        {users.map((user) => (
          <React.Fragment key={user.id}>
            <div className="w-[1.5px] bg-black" />
            <div className="flex-1 h-auto min-w-[30px] flex items-center justify-center">
              {renderCheckmark(awayTeam, user.id)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});