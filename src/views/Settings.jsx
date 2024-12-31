import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useTeamLogo } from '../hooks/useTeamLogo'

export function Settings() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState('')
    const [emailOptOut, setEmailOptOut] = useState(true)
    const { logoUrl, loading: logoLoading } = useTeamLogo(selectedTeam)

    const teams = [
        "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
        "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
        "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
        "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
        "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
        "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
        "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
        "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
    ]

    const handleAuth = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password)
                setSuccess('Account created successfully!')
            } else {
                await signInWithEmailAndPassword(auth, email, password)
                setSuccess('Signed in successfully!')
            }
        } catch (error) {
            console.error('Auth error:', error)
            setError(error.message)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            // Clear form fields after logout
            setEmail('')
            setPassword('')
            setError(null)
            setSuccess(false)
            setIsSignUp(false)
        } catch (error) {
            console.error('Logout error:', error)
            setError(error.message)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center pt-20">Loading...</div>
    }

    if (user) {
        return (
            <div className="
        flex flex-col md:gap-12 gap-8 items-center justify-center
        bg-neutral-100 md:pb-24 pb-20
        sm:pt-32 xs:pt-24 pt-16
        chakra sm:text-xl text-lg
        ">

                <div className="
            flex items-center justify-center marker
            lg:text-5xl text-4xl
            ">
                    Settings
                </div>

                <div className="flex flex-col gap-2 justify-center items-center max-w-xl md:mx-auto mx-4 w-full px-4">
                    <label className="font-medium">2026 Super Bowl pick</label>
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full p-4 marker text-center sm:text-2xl text-xl border-none focus:outline focus:outline-black focus:outline-4"
                    >
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    {selectedTeam && (
                        <div className="mt-4">
                            {logoLoading ? (
                                <div className="h-24 w-24 animate-pulse bg-gray-200 rounded-full" />
                            ) : (
                                logoUrl && <img
                                    src={logoUrl}
                                    alt={selectedTeam}
                                    className="h-24 w-24 object-contain"
                                />
                            )}
                        </div>
                    )}
                    <span className="uppercase text-base opacity-50">Deadline: Sep 24, 2025</span>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="emailOptOut"
                        checked={emailOptOut}
                        onChange={(e) => setEmailOptOut(e.target.checked)}
                        className="h-6 w-6 bg-transparent border-2 text-black accent-black"
                    />
                    <label htmlFor="emailOptOut" className="inline">Get reminder emails</label>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleLogout}
                        className="
                        flex items-center justify-center py-2 bg-black/10 cursor-pointer
                        max-w-xl md:mx-auto mx-4 w-full px-4
                        chakra uppercase
                    ">
                        Sign Out
                    </button>
                </div>

            </div>
        )
    }

    return (
        <div className="
        flex flex-col lg:gap-8 gap-4 bg-neutral-100 md:pb-24 pb-20
        sm:pt-32 xs:pt-24 pt-16
        ">

            <div className="
            flex items-center justify-center marker
            lg:text-5xl text-4xl
            ">
                👋 Hiya
            </div>


            <form onSubmit={handleAuth} className="flex flex-col gap-4 max-w-xl mx-auto w-full px-4 chakra">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="p-4 border-none focus:outline focus:outline-black focus:outline-4 text-center chakra text-xl"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="p-4 border-none focus:outline focus:outline-black focus:outline-4 text-center chakra text-xl"
                />
                <button
                    type="submit"
                    className="
                flex items-center justify-center py-4 px-8 bg-black cursor-pointer
                uppercase text-white
                lg:text-3xl md:text-2xl sm:text-xl text-lg
                ">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="chakra hover:underline mt-4 opacity-50"
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
            </form>
        </div>
    )
}