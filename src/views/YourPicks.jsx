import { useState } from 'react'
import { getWeekSchedule } from '../data/schedule'
import clipImage from '../assets/clip-305.png'

export function YourPicks() {
    const [picks, setPicks] = useState({})
    const weekData = getWeekSchedule(1) // Always week 1 for picks

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
        <div className="flex flex-col bg-neutral-100 pb-12">

            <div className="relative z-[100] flex flex-col items-center justify-center mb-4 lg:-mt-28 md:-mt-24 xs:-mt-20 -mt-20">
                <img
                    className="lg:w-[700px] md:w-[600px] w-[500px] min-w-[340px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />
            </div>

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
            <div className="w-full h-[1px] sm:mt-24 mt-12 bg-neutral-200" />

            <div className="flex items-center justify-center p-8">
                <div className="
                    flex items-center justify-center py-4 px-8 bg-black cursor-pointer
                    chakra uppercase text-white
                    lg:text-3xl md:text-2xl sm:text-xl text-lg
                ">
                    Save
                </div>
            </div>



        </div>
    )
}