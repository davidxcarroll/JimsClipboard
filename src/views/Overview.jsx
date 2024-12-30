import { useState, useRef } from 'react'
import { getWeekSchedule } from '../data/schedule'
import { MatchupRow } from '../components/shared/MatchupRow'
import { CircleCheck01 } from '../components/circles/circleCheck01'
import { CircleCheck02 } from '../components/circles/circleCheck02'
import { CircleCheck03 } from '../components/circles/circleCheck03'
import { CircleTeamSm } from '../components/circles/circleTeamSm'
import { CircleTeamMd } from '../components/circles/circleTeamMd'
import { CircleTeamLg } from '../components/circles/circleTeamLg'
import clipImage from '../assets/clip-305.png'

export function Overview() {
    const [currentWeek, setCurrentWeek] = useState(2)
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
        <div className="flex flex-col gap-8 bg-white sm:px-8">
            <div className="
        relative z-10 flex flex-col items-center justify-center
        lg:-mt-32 md:-mt-32 sm:-mt-28 xs:-mt-20 -mt-14
      ">
                <img
                    className="lg:w-[700px] sm:w-[600px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />

                {/* Week Selection Controls */}
                <div className="
                xl:absolute bottom-0 left-0
                flex flex-row justify-center items-center
                xl:mt-0 mt-4
                chakra uppercase lg:text-xl md:text-lg text-base text-neutral-400 text-center
                ">
                    <button
                        onClick={handlePrevWeek}
                        disabled={currentWeek === 1}
                        className="flex items-center justify-center p-2 material-symbols-sharp disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        arrow_left_alt
                    </button>

                    <button
                        onClick={handleWeekClick}
                        className="
                            flex items-center justify-center
                            p-2 pl-4 uppercase align-middle
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
                        className="flex items-center justify-center p-2 material-symbols-sharp disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        arrow_right_alt
                    </button>
                </div>
            </div>

            <div className="
            flex flex-row h-12 marker sticky top-0 z-50
            lg:text-3xl md:text-2xl text-xl
            shadow-[0_1px_0_rgba(0,0,0,.1)]
            ">
                <div className="w-1/5 min-w-[120px] flex items-center justify-center"></div>
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Jim</span>
                </div>
                <div className="w-[1.5px] bg-neutral-200" />
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Monty</span>
                </div>
                <div className="w-[1.5px] bg-neutral-200" />
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Dan</span>
                </div>
                <div className="w-[1.5px] bg-neutral-200" />
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">David</span>
                </div>
                <div className="w-[1.5px] bg-neutral-200" />
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Greg</span>
                </div>
            </div>

            {weekData && weekData.matchups.map((dateGroup, index) => (
                <div className="flex flex-col lg:gap-8 gap-8" key={index}>

                    {/* Date Header */}
                    <div className="
                    flex items-center h-12 max-sm:pl-2 chakra bg-white sticky top-0 z-10
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
                        />
                    ))}

                </div>
            ))}

            <div className="mt-20 text-3xl text-blue-500">Static test</div>

            {/* matchup row */}
            <div className="
                flex flex-col gap-2 marker mb-12
                marker
                lg:text-3xl md:text-2xl text-xl
            ">

                <div className="flex flex-row gap-2">
                    <div className="w-1/5 flex items-center justify-start">
                        <div className="relative inline">
                            Seahawks
                        </div>
                    </div>
                    <div className="w-1/5 flex items-center justify-center">✔</div>
                    <div className="w-1/5 flex items-center justify-center"></div>
                    <div className="w-1/5 flex items-center justify-center">✔</div>
                    <div className="w-1/5 flex items-center justify-center">✔</div>
                </div>

                <div className="w-full h-[1px] bg-black/10" />

                <div className="flex flex-row gap-2 mb-12">
                    <div className="w-1/5 flex items-center justify-start">
                        <div className="relative inline">
                            <CircleTeamSm />49ers
                        </div>
                    </div>
                    <div className="w-1/5 flex items-center justify-center"></div>
                    <div className="relative w-1/5 flex items-center justify-center">
                        <CircleCheck01 />✔
                    </div>
                    <div className="w-1/5 flex items-center justify-center"></div>
                    <div className="w-1/5 flex items-center justify-center"></div>
                </div>

            </div>

        </div>
    )
}