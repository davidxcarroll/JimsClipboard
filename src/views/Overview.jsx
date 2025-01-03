import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ParticipantsHeader } from '../components/shared/ParticipantsHeader'
import { MatchupRow } from '../components/shared/MatchupRow'
import { scheduleService } from '../services/espn/schedule'
import { formatGameDate, getDateKey, isPSTDateInFuture } from '../utils/dateUtils';
import { ESPN_TEAM_ABBREVIATIONS, getDisplayName, getEspnAbbreviation } from '../utils/teamMapping'
import { useUsers } from '../hooks/useUsers'
import { useLocation } from 'react-router-dom'

export function Overview() {
    const [currentWeek, setCurrentWeek] = useState(null);
    const [weekData, setWeekData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { users, loading: usersLoading } = useUsers()
    const location = useLocation()

    useEffect(() => {
        if (location.state?.refreshData) {
            setLoading(true) // Force loading state
            loadData()  // Your existing data loading function
        }
    }, [location.state?.refreshData])

    const processGamesWithPicks = (games) => {
        if (!users || !currentWeek?.number) return games;

        return games.map(game => {
            // Create a picks object for this game
            const gamePicks = {};
            users.forEach(user => {
                // Changed from user.data?.picks to user.picks
                const userPicks = user.picks?.[currentWeek.number];
                if (userPicks) {
                    // Store the pick for this game if it exists
                    const gamePick = userPicks[game.id];
                    if (gamePick) {
                        gamePicks[user.id] = gamePick;
                    }
                }
            });

            return {
                ...game,
                picks: gamePicks
            };
        });
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const weekResponse = await scheduleService.getCurrentWeek();
                setCurrentWeek(weekResponse);

                if (weekResponse?.number) {
                    const games = await scheduleService.getWeekGames(weekResponse.number, weekResponse.type);
                    // Map the ESPN abbreviations to display names
                    const gamesWithDisplayNames = games.map(game => ({
                        ...game,
                        id: game.id,
                        homeTeam: getDisplayName(game.homeTeam),
                        awayTeam: getDisplayName(game.awayTeam),
                        homeTeamAbbrev: game.homeTeam,
                        awayTeamAbbrev: game.awayTeam,
                        date: new Date(game.utcDate)
                    }));

                    // Add picks data to games
                    const gamesWithPicks = processGamesWithPicks(gamesWithDisplayNames);
                    setWeekData(gamesWithPicks);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [users]); // Keep users as dependency

    if (loading) return <div className="w-fit chakra mx-auto mt-8 px-2 text-2xl text-white bg-black">Loading...</div>;

    // Check if picks are still allowed for this week
    const now = new Date();
    const firstGame = weekData?.[0];
    const picksStillAllowed = weekData?.[0] && isPSTDateInFuture(weekData[0].date);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',  // "Sat"
            month: 'short',    // "Jan"
            day: 'numeric'     // "4"
        });
    };

    // Group games by date
    const gamesByDate = weekData?.reduce((groups, game) => {
        const dateKey = getDateKey(game.date);

        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: dateKey,
                day: formatGameDate(game.date),
                games: []
            };
        }
        groups[dateKey].games.push(game);
        return groups;
    }, {});

    // Convert gamesByDate object to sorted array
    const sortedDateGroups = gamesByDate ?
        Object.values(gamesByDate).sort((a, b) => new Date(a.date) - new Date(b.date))
        : [];

    if (loading || usersLoading) return <div className="w-fit chakra mx-auto mt-8 px-2 text-2xl text-white bg-black">Loading...</div>;

    return (
        <div className="
            flex flex-col lg:gap-8 gap-4 bg-neutral-100 pb-24
            lg:pt-28 md:pt-24 sm:pt-20 xs:pt-16 pt-12
        ">
            {picksStillAllowed && (
                <NavLink
                    to="/picks"
                    className="
                group
                flex flex-row items-center justify-center
                lg:mx-8 mx-2
                lg:p-2 p-2
                chakra uppercase
                cursor-pointer bg-amber-300
                lg:text-3xl md:text-2xl text-xl
                ">
                    <i className="mr-4 group-hover:mr-2 ease-in-out transition-[margin] duration-100">👉</i>
                    Pick Week {currentWeek?.number}
                    <i className="ml-4 group-hover:ml-2 ease-in-out transition-[margin] duration-100">👈</i>
                </NavLink>
            )}

            <ParticipantsHeader />

            {sortedDateGroups.map((dateGroup, index) => (
                <div className="flex flex-col lg:gap-8 gap-4" key={dateGroup.date}>  {/* Use date as key instead of index */}
                    {/* Date Header */}
                    <div className="
        flex items-center h-12 chakra bg-neutral-100 sticky top-0 z-20
        py-2
        uppercase lg:text-xl md:text-lg text-base text-neutral-400
        ">
                        <div className="md:px-8 px-2">{dateGroup.day}</div>
                    </div>

                    {/* Games for this date */}
                        {dateGroup.games.map(game => (
                            <MatchupRow
                                key={game.id}
                                gameId={game.id}
                                homeTeam={game.homeTeam}
                                awayTeam={game.awayTeam}
                                week={currentWeek.number}
                                winningTeam={game.winningTeam}
                                picks={game.picks}
                                users={users}
                            />
                        ))}

                </div>
            ))}

        </div>
    )
}