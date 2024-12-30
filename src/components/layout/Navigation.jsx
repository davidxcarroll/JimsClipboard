import { NavLink } from 'react-router-dom'

export function Navigation() {
  return (
    // sm:grid sm:grid-cols-5 grid-cols-2 auto-rows-fr
    <nav className="
      relative z-[500]
      sm:w-full min-w-[360px]
      lg:h-28 sm:h-24 h-20
      flex flex-row gap-20
      chakra lg:text-2xl md:text-xl text-lg
    ">
      <NavLink 
        to="/"
        className={({ isActive }) => `
          w-full flex whitespace-nowrap justify-center items-center xs:p-8 p-4
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
          w-full flex whitespace-nowrap justify-center items-center xs:p-8 p-4
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Your Picks</p>
      </NavLink>

      {/* <div className="max-sm:hidden" /> */}

      {/* <NavLink 
        to="/standings"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center items-center p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Standings</p>
      </NavLink> */}

      {/* <NavLink 
        to="/settings"
        className={({ isActive }) => `
          flex whitespace-nowrap justify-center items-center p-2 
          hover:underline cursor-pointer ${isActive ? 'underline' : ''}
        `}
      >
        <p className="text-center">Settings</p>
      </NavLink> */}

    </nav>
  )
}