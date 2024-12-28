export function MatchupRow({ homeTeam, awayTeam }) {
  return (
    <div className="
      flex flex-col gap-2
      marker
      lg:text-3xl md:text-2xl text-xl
    ">
      {/* Home Team Row */}
      <div className="flex flex-row gap-2">
        <div className="w-1/5 min-w-[120px] flex items-center justify-start">
          {homeTeam}
        </div>
        <div className="w-1/5 flex items-center justify-center">✔</div>
        <div className="w-1/5 flex items-center justify-center"></div>
        <div className="w-1/5 flex items-center justify-center">✔</div>
        <div className="w-1/5 flex items-center justify-center">✔</div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-black/10" />

      {/* Away Team Row */}
      <div className="flex flex-row gap-2">
        <div className="w-1/5 min-w-[120px] flex items-center justify-start">
          {awayTeam}
        </div>
        <div className="w-1/5 flex items-center justify-center"></div>
        <div className="w-1/5 flex items-center justify-center">✔</div>
        <div className="w-1/5 flex items-center justify-center"></div>
        <div className="w-1/5 flex items-center justify-center"></div>
      </div>
    </div>
  )
}