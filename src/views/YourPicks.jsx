import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWeekSchedule } from '../data/schedule'
import clipImage from '../assets/clip-305.png'

export function YourPicks() {
    const navigate = useNavigate()  // Add this hook
    const [picks, setPicks] = useState({})
    const weekData = getWeekSchedule(1) // Always week 1 for picks

    const handleSave = () => {
        // TODO: Save picks to database
        navigate('/')  // Navigate back to overview
    }

    const handleTeamClick = (gameId, team) => {
        setPicks(prevPicks => {
            // If clicking the same team that's already picked, remove it
            if (prevPicks[gameId] === team) {
                const newPicks = { ...prevPicks }
                delete newPicks[gameId]
                return newPicks
            }
            // Otherwise set/update the pick for this game
            return {
                ...prevPicks,
                [gameId]: team
            }
        })
    }

    return (
        <div className="
        relative
        flex flex-col
        ">

            <div className="
            shadow-[5px_-5px_5px_rgba(0,0,0,.1),-5px_5px_5px_rgba(0,0,0,.1)] z-[2]
            flex flex-col lg:gap-8 gap-4 bg-neutral-100 pb-24
            lg:pt-32 md:pt-28 sm:pt-24 xs:pt-20 pt-12
            ">

                {weekData && weekData.matchups.map((dateGroup, dateIndex) => (
                    <div key={dateIndex} className="flex flex-col">
                        {/* Date Header */}
                        <div className="
                            flex items-center justify-center h-12 chakra bg-neutral-100 sticky top-0 z-20
                            uppercase lg:text-xl md:text-lg text-base text-neutral-400
                            shadow-[0_1px_0_#ddd]
                        ">
                            {dateGroup.day} {new Date(dateGroup.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>

                        {/* Games */}
                        {dateGroup.games.map((game, gameIndex) => {
                            const gameId = `${dateIndex}-${gameIndex}`
                            const selectedTeam = picks[gameId]

                            return (
                                <div key={gameIndex} className="relative flex flex-row items-stretch justify-center">
                                    {/* Home Team */}
                                    <div
                                        onClick={() => handleTeamClick(gameId, game.homeTeam)}
                                        className={`
                                            w-1/2 flex items-center justify-center p-8 marker text-center 
                                            lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl text-xl cursor-pointer
                                            ${selectedTeam === game.homeTeam ? '' : 'text-neutral-400'}
                                        `}
                                    >
                                        {game.homeTeam} {selectedTeam === game.homeTeam && '✔'}
                                    </div>

                                    {/* @ Symbol */}
                                    <div className="
                                        absolute w-10 h-10 z-0 
                                        flex items-center justify-center 
                                        top-1/2 -translate-y-1/2 
                                        left-1/2 -translate-x-1/2 
                                        chakra lg:text-xl md:text-lg text-base text-neutral-400
                                    ">
                                        @
                                    </div>

                                    {/* Away Team */}
                                    <div
                                        onClick={() => handleTeamClick(gameId, game.awayTeam)}
                                        className={`
                                            w-1/2 flex items-center justify-center p-8 marker text-center 
                                            lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl text-xl cursor-pointer
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

                {/* Divider */}
                <div className="w-full h-[1px] sm:my-12 my-8 bg-neutral-200" />

                <div className="flex flex-col gap-8 items-center justify-center">
                    <div
                    onClick={handleSave}
                    className="
                    flex items-center justify-center py-4 px-8 bg-black cursor-pointer
                    chakra uppercase text-white
                    lg:text-3xl md:text-2xl sm:text-xl text-lg
                    ">
                        Save
                    </div>

                    <span className="chakra uppercase text-base text-neutral-500"><i>🔒</i> Deadline: Sep 5, 2025, 9:00 AM PST</span>

                </div>

            </div>

            <div className="absolute -top-2 md:left-12 left-4 z-0 w-11/12 rotate-1 h-10 bg-neutral-200" />

            <div className="absolute -bottom-2 md:right-12 right-4 z-0 w-11/12 rotate-1 h-10 bg-neutral-200" />

        </div>
    )
}