import { MatchupRow } from './components/MatchupRow'
import { getWeekSchedule } from './data/schedule'

function App() {
  const currentWeek = getWeekSchedule(1)
  return (
    <div className="min-h-screen w-full flex flex-col pb-24 lg:text-3xl md:text-2xl text-xl">

      <div className="relative z-10 flex flex-row gap-2 lg:-mb-10 max-lg:p-8 items-center justify-between px-8 font-chakra uppercase text-neutral-900/50">
        <div className="w-full flex flex-row gap-2 justify-start items-center">
          {/* <p className="">&larr;</p> */}
          <p className="">Week 5</p>
          {/* <p className="">&rarr;</p> */}
        </div>
        <div className="relative w-full flex flex-row gap-2 justify-center items-center">
          <h1 className="lg:absolute lg:top-2/3 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 leading-7 text-center">Jim's<br/>Clipboard</h1>
          <svg className="w-[600px] max-lg:hidden overflow-visible" viewBox="0 0 641 193" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="fill-neutral-300"
              style={{ filter: 'drop-shadow(0px -5px 5px rgba(0,0,0,.2))' }}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M181.28 98.1541V122.579L92.8031 127.833C47.1244 131.917 10.9232 135.154 0.514046 182.99C-0.631653 188.256 4.08939 193 10.1192 193H630.564C636.594 193 641.315 188.256 640.169 182.99C629.76 135.154 593.559 131.917 547.88 127.833L459.404 122.579V98.1541C459.404 94.2308 456.48 90.8165 452.422 89.278C425.936 79.2363 377.047 68.8106 368.873 40.0281C362.603 17.949 351.453 0 320.342 0C289.231 0 278.081 17.949 271.81 40.0281C263.636 68.8106 214.747 79.2363 188.262 89.278C184.204 90.8165 181.28 94.2308 181.28 98.1541ZM320.342 66.0791C330.801 66.0791 339.28 57.3778 339.28 46.6441C339.28 35.9104 330.801 27.2091 320.342 27.2091C309.882 27.2091 301.403 35.9104 301.403 46.6441C301.403 57.3778 309.882 66.0791 320.342 66.0791Z"
            />
          </svg>
        </div>
        <div className="w-full flex flex-row gap-2 justify-end items-center">
          {/* <p className="">&larr;</p> */}
          <p className="">24-25</p>
          {/* <p className="">&rarr;</p> */}
        </div>
      </div>
      
      <div className="flex flex-col gap-12 lg:py-24 py-8 px-8 bg-white">

        <div className="flex flex-row gap-2 font-marker bg-white sticky top-0 z-50">
          <div className="w-1/5 flex items-center justify-center"></div>
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
            <div className="font-chakra uppercase text-neutral-500/50 bg-white sticky top-8">
              {dateGroup.day}, {new Date(dateGroup.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
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

      </div>

    </div>
  )
}

export default App