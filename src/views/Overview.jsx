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
        const testAPI = async () => {
            try {
                console.log('🧪 Starting ESPN API Test...\n');

                // Test 1: Get Current Week
                const week = await scheduleService.getCurrentWeek();
                console.log('📅 Current Week:', {
                    number: week?.number,
                    type: week?.type
                });

                if (week?.number) {
                    // Test 2: Get Games
                    const games = await scheduleService.getWeekGames(week.number);
                    console.log(`\n🏈 Found ${games.length} games for Week ${week.number}`);

                    // Test 3: Game Details
                    games.forEach(game => {
                        console.log('\n-------------------');
                        console.log(`${game.awayTeam} @ ${game.homeTeam}`);
                        console.log(`Status: ${game.status}`);
                        console.log(`Score: ${game.awayTeam} ${game.score.away} - ${game.score.home} ${game.homeTeam}`);
                        console.log(`Winner: ${game.winner || 'Not finished'}`);
                        console.log(`Date: ${new Date(game.utcDate).toLocaleString()}`);
                    });

                    // Test 4: Game States
                    const gameStates = games.reduce((acc, game) => {
                        acc[game.status] = (acc[game.status] || 0) + 1;
                        return acc;
                    }, {});
                    console.log('\n📊 Game States:', gameStates);

                    // Test 5: Winners Check
                    const gamesWithWinners = games.filter(g => g.winner);
                    console.log('\n🏆 Games with Winners:', gamesWithWinners.length);
                }
            } catch (error) {
                console.error('❌ API Test Error:', error);
            }
        };

        testAPI();
    }, []); // Run once on component mount

    useEffect(() => {
        if (location.state?.refreshData) {
            setLoading(true) // Force loading state
            loadData()  // Your existing data loading function
        }
    }, [location.state?.refreshData])

    const processGamesWithPicks = (games) => {
        if (!users || !currentWeek?.number) return games;

        return games.map(game => {
            const gamePicks = {};
            let correctPicks = 0;
            let totalPicks = 0;

            users.forEach(user => {
                const userPicks = user.picks?.[currentWeek.number];
                if (userPicks) {
                    const gamePick = userPicks[game.id];
                    if (gamePick) {
                        gamePicks[user.id] = gamePick;
                        totalPicks++;
                        // Check if pick was correct (only for completed games)
                        if (game.status === 'post' && game.winner === gamePick) {
                            correctPicks++;
                        }
                    }
                }
            });

            return {
                ...game,
                picks: gamePicks,
                pickStats: {
                    total: totalPicks,
                    correct: correctPicks
                }
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

    if (loading) return <div className="w-fit chakra mx-auto mt-48 px-2 text-2xl text-white bg-black">Loading...</div>;

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

    if (loading || usersLoading) return <div className="w-fit chakra mx-auto mt-48 px-2 text-2xl text-white bg-black">Loading...</div>;

    return (
        <div className="
            flex flex-col lg:gap-10 gap-6 bg-neutral-100 pb-24
            xl:pt-8 md:pt-28 sm:pt-24 xs:pt-20 pt-14
        ">

            <div className="flex flex-row items-center xl:justify-between sm:justify-center justify-evenly xs:gap-4 lg:mx-8 mx-2 z-20">

                {picksStillAllowed && (
                    <NavLink
                        to="/picks"
                        className="
                group
                flex flex-row items-center justify-center gap-1
                lg:py-2 py-2 lg:pl-4 pl-2 lg:pr-6 pr-4
                chakra uppercase -rotate-2
                bg-amber-300 hover:bg-yellow-300
                lg:text-xl md:text-lg text-base
                ">
                        {/* <i className="mr-2 max-xs:hidden">✔</i> */}
                        <span className="material-symbols-sharp">checklist</span>
                        Pick Week {currentWeek?.number}
                    </NavLink>
                )}

                <NavLink
                    to="/settings"
                    className="
                    group
                    flex flex-row items-center justify-center gap-1
                    lg:py-2 py-2 lg:pl-4 pl-2 lg:pr-6 pr-4
                    chakra uppercase opacity-50
                    lg:text-xl md:text-lg text-base
                    ">
                    {/* <i className="mr-1">⚙</i> */}
                    <span className="material-symbols-sharp">tune</span>
                    Settings
                </NavLink>

            </div>

            <ParticipantsHeader />

            <div className="
                md:px-8 px-2 chakra uppercase lg:text-xl md:text-lg text-base text-neutral-400
                lg:-mt-20 md:-mt-16 sm:-mt-14 xs:-mt-16 -mt-14
            ">
                Week 18
            </div>

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