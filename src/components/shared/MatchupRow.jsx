export function MatchupRow({ homeTeam, awayTeam }) {
  return (
    <div className="
      flex flex-col gap-2
      marker
      lg:text-3xl md:text-2xl text-xl
    ">
      {/* Home Team Row */}
      <div className="flex flex-row gap-2">
        <div className="w-1/5 min-w-[120px] flex items-center justify-start sticky left-0 z-0">
          <span className="bg-white max-sm:pl-2">{homeTeam}</span>
        </div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center">✔</div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center"></div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center">✔</div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center">✔</div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-black/10" />

      {/* Away Team Row */}
      <div className="flex flex-row gap-2">
        <div className="w-1/5 min-w-[120px] flex items-center justify-start sticky left-0 z-0">
          <span className="bg-white max-sm:pl-2">{awayTeam}</span>
        </div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center"></div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center">✔</div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center"></div>
        <div className="w-1/5 min-w-[50px] flex items-center justify-center"></div>
      </div>
    </div>
  )
}