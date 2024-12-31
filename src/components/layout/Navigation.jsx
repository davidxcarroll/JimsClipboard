import { NavLink } from 'react-router-dom'
import clipImage from '../../assets/clip-305.png'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../config/firebase'

export function Navigation() {
  const [user] = useAuthState(auth)

  return (
    <nav className="
      relative
      sm:w-full min-w-[360px]
      lg:h-28 sm:h-24 h-20
      flex flex-row gap-20
      chakra lg:text-2xl md:text-xl text-lg
    ">
      {user && (
        <>
          <NavLink
            to="/"
            className={({ isActive }) => `z-20
              w-full flex whitespace-nowrap justify-center items-center xs:p-8 p-4
              hover:underline cursor-pointer ${isActive ? 'underline' : ''}
            `}
          >
            <p className="uppercase text-center">
              The Picks
            </p>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `z-20
              w-full flex whitespace-nowrap justify-center items-center xs:p-8 p-4
              hover:underline cursor-pointer ${isActive ? 'underline' : ''}
            `}
          >
            <p className="uppercase text-center">Settings</p>
          </NavLink>
        </>
      )}

      <div className="
      absolute left-1/2 -translate-x-1/2 z-10
      md:top-0 top-6
      w-full
      flex flex-col items-center justify-center
      ">
        <div className="
        absolute left-1/2 -translate-x-1/2 p-2
        md:bottom-4 sm:bottom-3 xs:bottom-1 bottom-0
        text-white text-center uppercase
        flex items-center justify-center gap-1
        md:flex-col flex-row
        ">
          <span className="inline w-fit px-2 bg-black tracking-wider -rotate-1 sm:-ml-4">Jim's</span>
          <span className="inline w-fit px-2 bg-black tracking-wider -rotate-2">Clipboard</span>
        </div>
        <img
          className="h-auto
            lg:w-[650px] md:w-[600px] sm:w-[500px] xs:w-[400px] w-[320px]
          "
          src={clipImage}
          alt="Clipboard"
        />
      </div>

    </nav>
  )
}