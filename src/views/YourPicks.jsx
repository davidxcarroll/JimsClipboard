import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { scheduleService } from '../services/espn/schedule'
import { formatGameDate, formatGameTime, isPSTDateInFuture } from '../utils/dateUtils'
import { useTeam } from '../hooks/useTeam'
import { ESPN_TEAM_ABBREVIATIONS, getDisplayName, getEspnAbbreviation } from '../utils/teamMapping'

export function YourPicks() {
    const location = useLocation()
    const navigate = useNavigate()
    const { team, updateTeam } = useTeam()
    const [picks, setPicks] = useState({})
    const [weekData, setWeekData] = useState(null)
    const [currentWeek, setCurrentWeek] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const hasChanges = useMemo(() => {
        if (!currentWeek?.number || !team) return false;
        const savedPicks = team.seasons?.[2024]?.regular_season?.[currentWeek.number] || {};
        return JSON.stringify(picks) !== JSON.stringify(savedPicks);
    }, [picks, team, currentWeek?.number]);

    // Load current week and games
    useEffect(() => {
        loadCurrentWeek();
    }, []);

    useEffect(() => {
        if (team && currentWeek?.number) {
          const savedPicks = team.seasons?.[2024]?.regular_season?.[currentWeek.number] || {};
          setPicks(savedPicks);
          setIsLoading(false);
        }
      }, [team, currentWeek?.number]);

    const loadCurrentWeek = async () => {
        try {
            // Check if week was passed through navigation state
            const passedWeek = location.state?.week;
            
            let week;
            if (passedWeek) {
                // Use the passed week
                week = passedWeek;
                setCurrentWeek(week);
            } else {
                // Fallback to getting current week from API
                week = await scheduleService.getCurrentWeek();
                setCurrentWeek(week);
            }
    
            const games = await scheduleService.getWeekGames(week.number, week.type)

            // Convert team abbreviations to full names using getDisplayName
            const gamesWithFullNames = games.map(game => ({
                ...game,
                homeTeam: getDisplayName(game.homeTeam),
                awayTeam: getDisplayName(game.awayTeam),
                date: new Date(game.utcDate)
            }));

            // Group games by date and time
            const groupedGames = gamesWithFullNames.reduce((groups, game) => {
                const dateStr = formatGameDate(game.date)
                const timeStr = formatGameTime(game.date)
                const key = `${dateStr}-${timeStr}`

                if (!groups[key]) {
                    groups[key] = {
                        date: dateStr,
                        time: timeStr,
                        games: []
                    }
                }
                groups[key].games.push(game)
                return groups
            }, {})

            setWeekData(Object.values(groupedGames).sort((a, b) =>
                new Date(a.games[0].date) - new Date(b.games[0].date)
            ))
        } catch (error) {
            console.error('Error loading week data:', error)
            toast.error('Failed to load games')
        }
    }

    const handleTeamClick = async (gameId, selectedTeam) => {
        // Convert to ESPN abbreviation for storage
        const espnAbbrev = getEspnAbbreviation(selectedTeam);
        setPicks(prevPicks => ({
            ...prevPicks,
            [gameId]: prevPicks[gameId] === espnAbbrev ? undefined : espnAbbrev
        }));
    }

    const handleSave = async () => {
        if (!team || !currentWeek?.number) {
          toast.error('Unable to save picks at this time');
          return;
        }
      
        try {
          const updatedUser = {
            ...team,
            seasons: {
              ...team.seasons,
              2024: {
                ...team.seasons?.[2024],
                regular_season: {
                  ...team.seasons?.[2024]?.regular_season,
                  [currentWeek.number]: picks
                }
              }
            }
          };
          await updateTeam(updatedUser);
          toast.success('Picks saved!');
          navigate('/', { state: { refreshData: true, timestamp: Date.now() } });
        } catch (error) {
          console.error('Error saving picks:', error);
          toast.error('Could not save picks');
        }
      };

    useEffect(() => {
        console.log('Current state:', {
            picks,
            currentWeek,
            teamPicks: team?.picks,
            hasChanges
        });
    }, [picks, currentWeek, team?.picks, hasChanges]);

    if (isLoading) {
        return <div className="w-fit chakra mx-auto mt-48 px-2 text-2xl text-white bg-black">Loading...</div>;
    }

    return (
        <>
            <div className="relative flex flex-col">
                <div className="shadow-[5px_-5px_5px_rgba(0,0,0,.1),-5px_5px_5px_rgba(0,0,0,.1)] z-[2] flex flex-col lg:gap-8 gap-4 bg-neutral-100 pb-24 lg:pt-32 md:pt-28 sm:pt-24 xs:pt-20 pt-12">
                    <div className="xl:absolute top-12 left-12 w-fit flex self-center items-center gap-1 justify-center -rotate-2 px-2 chakra uppercase text-base bg-blue-200 text-blue-700">
                        <span className="material-symbols-sharp">lock</span> Games lock at kickoff
                    </div>

                    <div className="
                        flex items-center justify-center
                        chakra uppercase
                        lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl text-xl
                    ">
                        {currentWeek?.type === 1 ? "Wild Card" :
                        currentWeek?.type === 2 ? "Divisional" :
                        currentWeek?.type === 3 ? "Conference" :
                        currentWeek?.type === 4 ? "Super Bowl" :
                        `Week ${currentWeek?.number}`} Picks
                    </div>

                    {weekData && weekData.map((timeGroup, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col">
                            {/* Date & Time Header */}
                            <div className="flex items-center justify-center h-12 chakra bg-neutral-100 sticky top-0 z-20 uppercase lg:text-xl md:text-lg text-base text-black shadow-[0_1px_0_#000]">
                                {timeGroup.date} — {timeGroup.time}
                                {!isPSTDateInFuture(timeGroup.games[0].date) && <span className="material-symbols-sharp ml-2 md:text-2xl text-lg">lock</span>}
                            </div>

                            {/* Games */}
                            {timeGroup.games.map((game, gameIndex) => {
                                const selectedTeam = picks[game.id] ? getDisplayName(picks[game.id]) : null;
                                const gameStarted = !isPSTDateInFuture(game.date)

                                return (
                                    <div key={gameIndex} className="relative flex flex-row items-stretch justify-center">
                                        {/* Home Team */}
                                        <div
                                            onClick={() => !gameStarted && handleTeamClick(game.id, game.homeTeam)}
                                            className={`
                                                w-1/2 flex items-center justify-center p-8 jim-casual text-center 
                                                lg:text-8xl md:text-6xl sm:text-5xl xs:text-4xl text-3xl
                                                ${gameStarted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                ${selectedTeam === game.homeTeam ? '' : 'text-black'}
                                            `}
                                        >
                                            {game.homeTeam} {selectedTeam === game.homeTeam && '✔'}
                                        </div>

                                        {/* @ Symbol */}
                                        <div className="absolute w-10 h-10 z-0 flex items-center justify-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 chakra lg:text-xl md:text-lg text-base text-black">
                                            @
                                        </div>

                                        {/* Away Team */}
                                        <div
                                            onClick={() => !gameStarted && handleTeamClick(game.id, game.awayTeam)}
                                            className={`
                                                w-1/2 flex items-center justify-center p-8 jim-casual text-center 
                                                lg:text-8xl md:text-6xl sm:text-5xl xs:text-4xl text-3xl
                                                ${gameStarted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                ${selectedTeam === game.awayTeam ? '' : 'text-black'}
                                            `}
                                        >
                                            {game.awayTeam} {selectedTeam === game.awayTeam && '✔'}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}

                    {/* Save Button */}
                    <div className="group flex flex-col gap-8 items-center justify-center mt-8 sticky bottom-0 z-50 bg-gradient-to-t from-neutral-100/90 from-50% to-neutral-100/0">
                        <div
                            onClick={handleSave}
                            className="flex items-center justify-center py-4 px-8 bg-black group-hover:bg-neutral-900 cursor-pointer chakra uppercase text-white lg:text-3xl md:text-2xl sm:text-xl text-lg"
                        >
                            Done
                        </div>
                    </div>
                    
                </div>

                {/* Background Elements */}
                <div className="absolute -top-2 md:left-12 left-4 z-0 w-11/12 rotate-1 h-10 bg-neutral-200" />
                <div className="absolute -bottom-2 md:right-12 right-4 z-0 w-11/12 rotate-1 h-10 bg-neutral-200" />
            </div>
        </>
    )
}