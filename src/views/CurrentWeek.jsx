import { getWeekSchedule } from '../data/schedule'
import { MatchupRow } from '../components/shared/MatchupRow'
import { CircleCheck01 } from '../components/circles/circleCheck01'
import { CircleCheck02 } from '../components/circles/circleCheck02'
import { CircleCheck03 } from '../components/circles/circleCheck03'
import { CircleTeamSm } from '../components/circles/circleTeamSm'
import { CircleTeamMd } from '../components/circles/circleTeamMd'
import { CircleTeamLg } from '../components/circles/circleTeamLg'
import clipImage from '../assets/clip-305.png'

export function CurrentWeek() {
    const currentWeek = getWeekSchedule(1) // or whichever week number

    if (!currentWeek) {
        return <div>Loading...</div>
    }

    return (
        <div className="
            flex flex-col gap-12 bg-white sm:px-8
            md:mt-0 sm:mt-0 xs:mt-24 mt-12
        ">

            <div className="
            relative z-10 flex items-center justify-center max-md:-mb-8
            lg:-mt-32 md:-mt-32 sm:-mt-28 xs:-mt-24 -mt-16
            ">
                <img
                    className="lg:w-[700px] sm:w-[600px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />
            </div>

            <div className="
            flex flex-row gap-2 h-12 -mb-12 marker sticky top-0 z-50
            lg:text-3xl md:text-2xl text-xl
            shadow-[0_1px_0_rgba(0,0,0,.1)]
            ">
                <div className="w-1/5 min-w-[120px] flex items-center justify-center"></div>
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Jim</span>
                </div>
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Monty</span>
                </div>
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">Dan</span>
                </div>
                <div className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
                    <span className="max-[450px]:-rotate-45">David</span>
                </div>
            </div>

            {/* Games grouped by date */}
            {currentWeek.matchups.map((dateGroup, index) => (
                <div className="flex flex-col gap-12" key={index}>

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