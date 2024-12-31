export function ParticipantsHeader() {
  const participants = ['Jim', 'Monty', 'Dan', 'David']
  
  const truncateName = (name) => name.slice(0, 8)

  return (
    <div className="
      flex flex-row h-12 marker sticky top-0 z-50
      lg:text-3xl md:text-2xl text-xl
      shadow-[0_1px_0_rgba(0,0,0,.1)]
    ">
      <div className="w-1/5 min-w-[150px] flex items-center justify-center" />

      <div className="w-[1.5px] bg-neutral-200" />
      
      {participants.map((name, index) => (
        <>
          <div key={name} className="w-1/5 min-w-[50px] flex sm:items-center items-start justify-center max-sm:pt-3">
            <span className="max-[450px]:-rotate-45">{truncateName(name)}</span>
          </div>
          {index < participants.length - 1 && (
            <div className="w-[1.5px] bg-neutral-200" />
          )}
        </>
      ))}
    </div>
  )
}