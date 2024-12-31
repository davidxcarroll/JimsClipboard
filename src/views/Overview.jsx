import { useState, useRef } from 'react'
import { getWeekSchedule } from '../data/schedule'
import { ParticipantsHeader } from '../components/shared/ParticipantsHeader'
import { MatchupRow } from '../components/shared/MatchupRow'
import { NavLink } from 'react-router-dom'

export function Overview() {
    const [currentWeek, setCurrentWeek] = useState(1)
    const selectRef = useRef(null)
    const weekData = getWeekSchedule(currentWeek)

    const handlePrevWeek = () => {
        if (currentWeek > 1) {
            setCurrentWeek(currentWeek - 1)
        }
    }

    const handleNextWeek = () => {
        if (currentWeek < 3) {
            setCurrentWeek(currentWeek + 1)
        }
    }

    const handleWeekClick = () => {
        selectRef.current?.click()
    }

    return (
        <div className="
            flex flex-col lg:gap-8 gap-4 bg-neutral-100 pb-24
            lg:pt-28 md:pt-24 sm:pt-20 xs:pt-16 pt-12
        ">

            {currentWeek === 3 && (
                <NavLink
                to="/picks"
                className="
                flex flex-row items-center justify-center my-2
                lg:mx-8 mx-2
                lg:p-8 p-6
                chakra uppercase
                cursor-pointer bg-amber-400
                lg:text-3xl md:text-2xl text-xl
                ">
                    <i className="mr-2">👉</i> Pick Week {currentWeek} <i className="ml-2">👈</i>
                </NavLink>
            )}

            <ParticipantsHeader />

            {/* Week Selection Controls */}
            <div className="
            relative z-[100]
            flex items-center
            h-12 chakra
            lg:-mt-20 -mt-16
            uppercase lg:text-xl md:text-lg text-base
            ">
                {/* <button
                    onClick={handlePrevWeek}
                    disabled={currentWeek === 1}
                    className="max-sm:hidden flex items-center justify-center material-symbols-sharp w-8 sm:text-3xl text-2xl disabled:opacity-10 disabled:cursor-not-allowed"
                >
                    arrow_left_alt
                </button> */}

                <div className="md:px-8 px-2 sticky left-0">

                    <button
                        onClick={handleWeekClick}
                        className="
                            sm:w-32 w-28
                            flex items-center justify-start
                            uppercase align-middle
                        ">
                        Week {currentWeek} <span className="material-symbols-sharp">arrow_drop_down</span>
                    </button>

                    <select
                        ref={selectRef}
                        value={currentWeek}
                        onChange={(e) => setCurrentWeek(Number(e.target.value))}
                        className="absolute top-1/2 -translate-y-1/2 opacity-0 cursor-pointer sm:w-32 w-28 h-8">
                        <option value={1}>WEEK 1</option>
                        <option value={2}>WEEK 2</option>
                        <option value={3}>WEEK 3</option>
                    </select>

                </div>

                {/* <button
                    onClick={handleNextWeek}
                    disabled={currentWeek === 3}
                    className="max-sm:hidden flex items-center justify-center material-symbols-sharp w-8 sm:text-3xl text-2xl disabled:opacity-10 disabled:cursor-not-allowed"
                >
                    arrow_right_alt
                </button> */}
            </div>

            {weekData && weekData.matchups.map((dateGroup, index) => (
                <div className="flex flex-col lg:gap-12 gap-8" key={index}>

                    {/* Date Header */}
                    <div className="
                    flex items-center h-12 chakra bg-neutral-100 sticky top-0 z-20
                    md:px-8 px-2 py-2
                    uppercase lg:text-xl md:text-lg text-base text-neutral-400
                    ">
                        {dateGroup.day.slice(0, 3)} {new Date(dateGroup.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>

                    {/* Games for this date */}
                    {dateGroup.games.map((game, gameIndex) => (
                    <MatchupRow
                        key={gameIndex}
                        homeTeam={game.homeTeam}
                        awayTeam={game.awayTeam}
                        week={currentWeek}
                        winningTeam={game.winner} // Add this to your data
                        picks={game.picks} // Add this to your data structure
                    />
                    ))}

                </div>
            ))}

        </div>
    )
}