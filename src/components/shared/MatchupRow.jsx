import React from 'react';
import { getDisplayName, getEspnAbbreviation } from '../../utils/teamMapping';
import { CircleCheck01 } from '../circles/circleCheck01'
import { CircleCheck02 } from '../circles/circleCheck02'
import { CircleCheck03 } from '../circles/circleCheck03'
import { CircleCheck04 } from '../circles/circleCheck04'
import { CircleCheck05 } from '../circles/circleCheck05'
import { CircleCheck06 } from '../circles/circleCheck06'
import { CircleCheck07 } from '../circles/circleCheck07'
import { CircleCheck08 } from '../circles/circleCheck08'
import { CircleCheck09 } from '../circles/circleCheck09'
import { CircleTeamSm01 } from '../circles/circleTeamSm01'
import { CircleTeamSm02 } from '../circles/circleTeamSm02'
import { CircleTeamSm03 } from '../circles/circleTeamSm03'
import { CircleTeamMd01 } from '../circles/circleTeamMd01'
import { CircleTeamMd02 } from '../circles/circleTeamMd02'
import { CircleTeamMd03 } from '../circles/circleTeamMd03'
import { CircleTeamLg01 } from '../circles/circleTeamLg01'
import { CircleTeamLg02 } from '../circles/circleTeamLg02'
import { CircleTeamLg03 } from '../circles/circleTeamLg03'
import { Check01 } from '../checks/check01'
import { Check02 } from '../checks/check02'
import { Check03 } from '../checks/check03'
import { Check04 } from '../checks/check04'
import { Check05 } from '../checks/check05'
import { Check06 } from '../checks/check06'
import { Check07 } from '../checks/check07'

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

  const didPickTeam = (team, participantId) => {
    if (!picks || !picks[participantId]) return false;
    const teamAbbrev = getEspnAbbreviation(team);
    const userPick = picks[participantId].team;
    return userPick === teamAbbrev;
  };

  const isCorrectPick = (team, participantId) => {
    if (!winningTeam || !picks?.[participantId]?.team) return false;
    const pickedTeamAbbrev = picks[participantId].team;
    return pickedTeamAbbrev === getEspnAbbreviation(team) && winningTeam === getDisplayName(team);
  };

  const getRandomCircleCheck = () => {
    const circles = [CircleCheck01, CircleCheck02, CircleCheck03, CircleCheck04, CircleCheck05, CircleCheck06, CircleCheck07, CircleCheck08, CircleCheck09];
    return circles[Math.floor(Math.random() * circles.length)];
  };

  const getRandomCheck = () => {
    const checks = [Check01, Check02, Check03, Check04, Check05, Check06, Check07];
    return checks[Math.floor(Math.random() * checks.length)];
  };

  const getRandomSmallCircle = () => {
    const circles = [CircleTeamSm01, CircleTeamSm02, CircleTeamSm03];
    return circles[Math.floor(Math.random() * circles.length)];
  };

  const getRandomMediumCircle = () => {
    const circles = [CircleTeamMd01];
    return circles[Math.floor(Math.random() * circles.length)];
  };

  const getRandomLargeCircle = () => {
    const circles = [CircleTeamLg01, CircleTeamLg02, CircleTeamLg03];
    return circles[Math.floor(Math.random() * circles.length)];
  };

  const getTeamCircle = (teamName) => {
    if (teamName.length <= 5) return getRandomSmallCircle();
    if (teamName.length <= 9) return getRandomMediumCircle();
    return getRandomLargeCircle();
  };

  const renderTeamName = (team, isWinner) => {
    const displayName = getDisplayName(team);
    const TeamCircle = React.useMemo(() => getTeamCircle(displayName), [team]);
  
    return (
      <span className="relative">
        {isWinner && <TeamCircle />}
        {displayName}
      </span>
    );
  };

  const renderCheckmark = (team, participantId) => {
    const picked = didPickTeam(team, participantId);
    const correct = isCorrectPick(team, participantId);
  
    if (!picked) return null;
  
    const [RandomCircleCheck, RandomCheck] = React.useMemo(() => [
      getRandomCircleCheck(),
      getRandomCheck()
    ], [team, participantId]);
  
    return (
      <div className="relative">
        {correct && (
            <RandomCircleCheck className="" />
        )}
          <RandomCheck className="h-[.8em] absolute top-[calc(50%-5px)] left-[calc(50%+10px)] -translate-y-1/2 -translate-x-1/2" />
      </div>
    );
};

  return (
    <div className="flex flex-col jim-casual lg:text-5xl md:text-4xl text-3xl">
      {/* Home Team Row */}
      <div className="flex flex-row">
        <div className="flex-1 h-12 min-w-[150px] flex items-center justify-start bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
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
        <div className="flex-1 h-12 min-w-[150px] flex items-center justify-start bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
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