import { NavLink } from 'react-router-dom'

export function Navigation() {
  return (
    <nav className="
      relative z-50 sm:w-full min-w-[360px] md:h-32 sm:h-28 h-fit
      grid sm:grid-cols-5 grid-cols-4 max-[450px]:grid-cols-2 auto-rows-fr
      chakra lg:text-2xl md:text-xl text-lg text-white
    ">
      <NavLink 
        to="/"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">
          Overview
        </p>
      </NavLink>

      <NavLink 
        to="/picks"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Your Picks</p>
      </NavLink>

      <div className="max-sm:hidden" />

      <NavLink 
        to="/standings"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Standings</p>
      </NavLink>

      <NavLink 
        to="/settings"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center sm:items-center items-start p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Settings</p>
      </NavLink>
    </nav>
  )
}