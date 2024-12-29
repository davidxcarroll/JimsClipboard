import { NavLink } from 'react-router-dom'

export function Navigation() {
  return (
    <nav className="
      relative z-50 sm:w-full w-screen md:h-32 sm:h-28 h-fit max-sm:mb-16
      flex flex-row flex-wrap items-center justify-between
      chakra lg:text-2xl md:text-xl text-lg text-white
    ">
      <NavLink 
        to="/"
        className={({ isActive }) => `
          flex flex-1 flex-row whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">
          Week 5
          <span className="material-symbols-sharp align-middle">
            arrow_drop_down
          </span>
        </p>
      </NavLink>

      <NavLink 
        to="/picks"
        className={({ isActive }) => `
          flex flex-1 flex-row whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Your Picks</p>
      </NavLink>

      <div className="flex flex-1 max-sm:hidden" />

      <NavLink 
        to="/standings"
        className={({ isActive }) => `
          flex flex-1 flex-row whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Standings</p>
      </NavLink>

      <NavLink 
        to="/settings"
        className={({ isActive }) => `
          flex flex-1 flex-row whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Settings</p>
      </NavLink>
    </nav>
  )
}