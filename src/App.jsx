import { MatchupRow } from './components/MatchupRow'
import { getWeekSchedule } from './data/schedule'
import { Clip } from './components/Clip'
import { CircleCheck01 } from './components/circles/circleCheck01'
import { CircleCheck02 } from './components/circles/circleCheck02'
import { CircleCheck03 } from './components/circles/circleCheck03'
import { CircleTeamSm } from './components/circles/circleTeamSm'
import { CircleTeamMd } from './components/circles/circleTeamMd'
import { CircleTeamLg } from './components/circles/circleTeamLg'
import clipImage from './assets/clip-303.png'

function App() {
  const currentWeek = getWeekSchedule(1)
  return (
    <div className="min-h-screen w-full flex flex-col">

      <div className="
        absolute z-10 w-full lg:h-32 md:h-28 h-24
        flex flex-row items-center justify-between p-8
        font-telegraf lg:text-3xl md:text-2xl text-xl
      ">
        <div className="flex flex-row gap-2 justify-start items-center text-white">
          <p className="text-center">Jim's Clipboard</p>
        </div>
        <div className="flex flex-row gap-2 justify-end items-center text-white">
          <p className="text-center">&larr;</p>
          <p className="text-center">Week 5</p>
          <p className="text-center">&rarr;</p>
        </div>
      </div>

      <div className="relative z-50 flex items-center justify-center">
        <img
          className="lg:w-[500px] md:w-[450px] w-[400px] h-auto"
          src={clipImage}
          alt="Clipboard"
        />
      </div>
      
      <div className="
        flex flex-col gap-12 px-8 bg-white
        lg:py-28 md:py-24 py-20
        lg:-mt-20 md:-mt-16 -mt-14
      ">

        <div className="
          flex flex-row gap-2 h-10 -mb-12 marker sticky top-0 z-50
          lg:text-3xl md:text-2xl text-xl
        ">
          <div className="w-1/5 min-w-[120px] flex items-center justify-center"></div>
          <div className="w-1/5 flex items-center justify-center">
            Jim
          </div>
          <div className="w-1/5 flex items-center justify-center">
            Monty
          </div>
          <div className="w-1/5 flex items-center justify-center">
            Dan
          </div>
          <div className="w-1/5 flex items-center justify-center">
            David
          </div>
        </div>
        
        {/* Games grouped by date */}
        {currentWeek.matchups.map((dateGroup, index) => (
          <div className="flex flex-col gap-12" key={index}>

            {/* Date Header */}
            <div className="
              flex items-center h-12 font-telegraf bg-white sticky top-0
              uppercase lg:text-xl md:text-lg text-base
            ">
              {dateGroup.day.slice(0,3)} {new Date(dateGroup.date).toLocaleDateString('en-US', {
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

        <div className="mt-20 text-red-500">Static test</div>

        {/* matchup row */}
        <div className="flex flex-col gap-2 marker">

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

          <div className="flex flex-row gap-2">
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

    </div>
  )
}

export default App