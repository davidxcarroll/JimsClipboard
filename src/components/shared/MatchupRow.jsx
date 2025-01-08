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
  // Mock logic only runs if enabled
  const MOCK_WINNER = ENABLE_MOCKS && gameId === '401671834' ? 'Browns' : undefined;
  const winningTeam = MOCK_WINNER || actualWinningTeam;

  // Consolidate logging into debug function
  const debug = (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🎯 ${message}`, data);
    }
  };

  const checkPick = (team, participant) => {
    const espnAbbrev = getEspnAbbreviation(team);
    debug('Checking pick', { gameId, team, participant, espnAbbrev, picks });
    return picks?.[participant]?.team === espnAbbrev;
  };

  // Helper to check if participant picked this team
  const didPickTeam = (team, participant) => {
    const espnAbbrev = getEspnAbbreviation(team);
    const hasPick = picks?.[participant] === espnAbbrev;

    // console.log('🎯 Checking pick in MatchupRow:', {
    //   gameId,
    //   team,
    //   participant,
    //   espnAbbrev,
    //   picks,
    //   participantPick: picks?.[participant],
    //   hasPick
    // });

    return hasPick;
  }

  // Helper to check if pick was correct
  const isCorrectPick = (team, participant) => {
    return winningTeam && didPickTeam(team, participant)
  }

  // console.log('🏆 MatchupRow props:', {
  //   gameId,
  //   homeTeam,
  //   awayTeam,
  //   week,
  //   winningTeam,
  //   actualWinningTeam,
  //   picks
  // });

  // Helper to get random circle check component
  const getRandomCircleCheck = () => {
    const circles = [CircleCheck01, CircleCheck02, CircleCheck03]
    const randomIndex = Math.floor(Math.random() * circles.length)
    return circles[randomIndex]
  }

  // Helper to determine team name length and get appropriate circle
  const getTeamCircle = (teamName) => {
    if (teamName.length <= 5) return CircleTeamSm
    if (teamName.length <= 9) return CircleTeamMd
    return CircleTeamLg
  }

  const renderTeamName = (team, isWinner) => {
    const displayName = getDisplayName(team);
    const TeamCircle = getTeamCircle(displayName);
    
    return (
      <span className="relative inline-block">
        {isWinner && week === 18 && <TeamCircle />}
        {displayName}
      </span>
    )
  }

  const renderCheckmark = (team, participant) => {
    if (week === 3) return null

    const picked = didPickTeam(team, participant)
    if (!picked) return null

    const isCorrect = isCorrectPick(team, participant)
    const showCircle = isCorrect && week === 18 && team === winningTeam

    if (showCircle) {
      const CircleCheck = getRandomCircleCheck()
      return (
        <div className="relative">
          <CircleCheck />
          ✔
        </div>
      )
    }

    return (
      <div className="relative">
        ✔
      </div>
    )
  }

  // console.log('MatchupRow render:', { gameId, homeTeam, awayTeam, week, winningTeam, picks, users });

  return (
    <div className="flex flex-col jim-casual lg:text-5xl md:text-4xl text-3xl">
      {/* Home Team Row */}
      <div className="flex flex-row">
        <div className="flex-1 h-auto min-w-[150px] flex items-center justify-start py-2 bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
          <div className="md:px-8 px-2">{renderTeamName(homeTeam, winningTeam === homeTeam)}</div>
        </div>

        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="w-[1.5px] bg-neutral-200" />
            <div className="flex-1 h-auto min-w-[30px] flex items-center justify-center">
              {renderCheckmark(homeTeam, user.id)}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-neutral-200" />

      {/* Away Team Row */}
      <div className="flex flex-row">
        <div className="flex-1 h-auto min-w-[150px] flex items-center justify-start py-2 bg-gradient-to-r from-neutral-100 from-80% to-neutral-100/0 sticky left-0 z-10">
          <div className="md:px-8 px-2">{renderTeamName(awayTeam, winningTeam === awayTeam)}</div>
        </div>

        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="w-[1.5px] bg-neutral-200" />
            <div className="flex-1 h-auto min-w-[30px] flex items-center justify-center">
              {renderCheckmark(awayTeam, user.id)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});