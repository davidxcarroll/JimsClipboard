import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { scheduleService } from '../services/espn/schedule'
import { formatGameDate, formatGameTime, isPSTDateInFuture } from '../utils/dateUtils'
import { useTeam } from '../hooks/useTeam'
import { ESPN_TEAM_ABBREVIATIONS, getDisplayName, getEspnAbbreviation } from '../utils/teamMapping'

export function YourPicks() {
    const navigate = useNavigate()
    const { team, updateTeam } = useTeam()
    const [picks, setPicks] = useState({})
    const [weekData, setWeekData] = useState(null)
    const [currentWeek, setCurrentWeek] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const hasChanges = useMemo(() => {
        if (!currentWeek?.number || !team) {
            console.log('Missing data:', { currentWeek, team });
            return false;
        }
        const savedPicks = team.picks?.[currentWeek.number] || {};
        console.log('Comparing picks:', {
            current: picks,
            saved: savedPicks,
            areEqual: JSON.stringify(picks) === JSON.stringify(savedPicks),
            team
        });
        return JSON.stringify(picks) !== JSON.stringify(savedPicks);
    }, [picks, team, currentWeek?.number]);

    // Load current week and games
    useEffect(() => {
        loadCurrentWeek();
    }, []);

    useEffect(() => {
        console.log('Team or week changed:', { team, currentWeek });
        if (team && currentWeek?.number) {
            const savedPicks = team.picks?.[currentWeek.number] || {};
            console.log('Loading saved picks:', savedPicks);
            setPicks(savedPicks);
            setIsLoading(false);
        }
    }, [team, currentWeek?.number]);

    // Load saved picks when week changes or team data updates
    useEffect(() => {
        if (team?.picks && currentWeek?.number) {
            setPicks(team.picks[currentWeek.number] || {});
        }
    }, [team?.picks, currentWeek?.number]);

    const loadCurrentWeek = async () => {
        try {
            const week = await scheduleService.getCurrentWeek()
            setCurrentWeek(week)
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
            toast.error('Unable to save picks at this time')
            return
        }
    
        try {
            const updatedUser = {
                ...team,
                picks: {
                    ...team.picks,
                    [currentWeek.number]: picks
                }
            }
            
            console.log('Saving picks:', {
                userId: team.id,
                weekNumber: currentWeek.number,
                picks,
                updatedUser
            });
    
            await updateTeam(updatedUser)
            toast.success('Picks saved!')
            
            // Force Overview to reload by adding state to navigation
            navigate('/', { 
                state: { 
                    refreshData: true,
                    timestamp: Date.now() 
                } 
            })
        } catch (error) {
            console.error('Error saving picks:', error)
            toast.error('Could not save picks')
        }
    }

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
                        <span className="material-symbols-sharp">warning</span> Picks lock at kickoff
                    </div>

                    {weekData && weekData.map((timeGroup, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col">
                            {/* Date & Time Header */}
                            <div className="flex items-center justify-center h-12 chakra bg-neutral-100 sticky top-0 z-20 uppercase lg:text-xl md:text-lg text-base text-neutral-400 shadow-[0_1px_0_#ddd]">
                                {timeGroup.date} — {timeGroup.time}
                                {!isPSTDateInFuture(timeGroup.games[0].date) && <span className="material-symbols-sharp ml-2">lock</span>}
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
                                                w-1/2 flex items-center justify-center p-8 marker text-center 
                                                lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl text-xl
                                                ${gameStarted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                ${selectedTeam === game.homeTeam ? '' : 'text-neutral-400'}
                                            `}
                                        >
                                            {game.homeTeam} {selectedTeam === game.homeTeam && '✔'}
                                        </div>

                                        {/* @ Symbol */}
                                        <div className="absolute w-10 h-10 z-0 flex items-center justify-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 chakra lg:text-xl md:text-lg text-base text-neutral-400">
                                            @
                                        </div>

                                        {/* Away Team */}
                                        <div
                                            onClick={() => !gameStarted && handleTeamClick(game.id, game.awayTeam)}
                                            className={`
                                                w-1/2 flex items-center justify-center p-8 marker text-center 
                                                lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl text-xl
                                                ${gameStarted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                ${selectedTeam === game.awayTeam ? '' : 'text-neutral-400'}
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