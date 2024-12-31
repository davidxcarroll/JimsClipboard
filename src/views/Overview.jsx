import { useState, useRef } from 'react'
import { getWeekSchedule } from '../data/schedule'
import { ParticipantsHeader } from '../components/shared/ParticipantsHeader'
import { MatchupRow } from '../components/shared/MatchupRow'
import { CircleCheck01 } from '../components/circles/circleCheck01'
import { CircleCheck02 } from '../components/circles/circleCheck02'
import { CircleCheck03 } from '../components/circles/circleCheck03'
import { CircleTeamSm } from '../components/circles/circleTeamSm'
import { CircleTeamMd } from '../components/circles/circleTeamMd'
import { CircleTeamLg } from '../components/circles/circleTeamLg'
import clipImage from '../assets/clip-305.png'

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
        <div className="flex flex-col lg:gap-8 gap-4 bg-neutral-100 pb-32">
            <div className="
                relative z-[100] flex flex-col items-center justify-center
                lg:-mt-28 md:-mt-24 xs:-mt-20 -mt-20
            ">
                <img
                    className="lg:w-[700px] md:w-[600px] w-[500px] min-w-[340px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />

                {/* Week Selection Controls */}
                {/* <div className="
                absolute left-1/2 -translate-x-1/2
                lg:bottom-8 md:bottom-5 sm:bottom-2 xs:bottom-4 bottom-2
                bg-amber-200 mix-blend-hard-light shadow-[-1px_1px_1px_rgba(0,0,0,.1)]
                -rotate-2 rounded-sm
                flex flex-row justify-center items-center
                xl:mt-0 mt-2
                chakra uppercase lg:text-xl md:text-lg text-base text-center
                ">
                    <button
                        onClick={handlePrevWeek}
                        disabled={currentWeek === 1}
                        className="flex items-center justify-center material-symbols-sharp rounded-full sm:text-3xl text-2xl disabled:opacity-10 disabled:cursor-not-allowed"
                    >
                        arrow_left_alt
                    </button>

                    <button
                        onClick={handleWeekClick}
                        className="
                            flex items-center justify-center
                            p-1 pl-4 uppercase align-middle
                        ">
                        Week {currentWeek} <span className="material-symbols-sharp">arrow_drop_down</span>
                    </button>

                    <select
                        ref={selectRef}
                        value={currentWeek}
                        onChange={(e) => setCurrentWeek(Number(e.target.value))}
                        className="absolute opacity-0 cursor-pointer"
                    >
                        <option value={1}>WEEK 1</option>
                        <option value={2}>WEEK 2</option>
                        <option value={3}>WEEK 3</option>
                    </select>

                    <button
                        onClick={handleNextWeek}
                        disabled={currentWeek === 3}
                        className="flex items-center justify-center material-symbols-sharp rounded-full sm:text-3xl text-2xl disabled:opacity-10 disabled:cursor-not-allowed"
                    >
                        arrow_right_alt
                    </button>
                </div> */}

            </div>

            <ParticipantsHeader />

            {/* Week Selection Controls */}
            <div className="
            relative z-[100]
            flex items-center
            h-12 chakra
            sm:-mt-20 -mt-16
            uppercase lg:text-xl md:text-lg text-base
            ">
                {/* <button
                    onClick={handlePrevWeek}
                    disabled={currentWeek === 1}
                    className="max-sm:hidden flex items-center justify-center material-symbols-sharp w-8 sm:text-3xl text-2xl disabled:opacity-10 disabled:cursor-not-allowed"
                >
                    arrow_left_alt
                </button> */}

                <div className="relative md:px-8 px-2 sticky left-0">

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
                        className="bg-blue-500/50
                            absolute top-1/2 -translate-y-1/2 opacity-0 cursor-pointer sm:w-32 w-28 h-8
                        ">
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