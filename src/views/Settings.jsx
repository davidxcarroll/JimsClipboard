import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useTeam } from '../hooks/useTeam'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import emailjs from '@emailjs/browser'
import { NFL_TEAMS } from '../store/nfl/teams'

export function Settings() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState('')
    const [emailOptOut, setEmailOptOut] = useState(false)
    const { teamData, loading: teamLoading } = useTeam(selectedTeam)
    const [isSaving, setIsSaving] = useState(false)

    // Load existing pick when component mounts
    useEffect(() => {
        let isMounted = true  // For cleanup

        async function loadPick() {
            // Clear the selected team when there's no user
            if (!user) {
                setSelectedTeam('')
                return
            }

            try {
                const docRef = doc(db, 'superBowlPicks', '2026', 'users', user.uid)
                const docSnap = await getDoc(docRef)

                // Only set state if component is still mounted
                if (isMounted) {
                    if (docSnap.exists()) {
                        setSelectedTeam(docSnap.data().team)
                    } else {
                        setSelectedTeam('')
                    }
                }
            } catch (err) {
                console.error('Error loading pick:', err)
                if (isMounted) {
                    setSelectedTeam('')
                }
            }
        }

        loadPick()

        return () => {
            isMounted = false
            setSelectedTeam('')  // Clear selection when component unmounts
        }
    }, [user])

    const handleTeamSelect = (e) => {
        const team = e.target.value
        setSelectedTeam(team)
        if (team) {
            savePick(team)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center m-24 p-24 chakra text-xl">Loading...</div>
    }

    const savePick = async (team) => {
        if (!user) return

        setIsSaving(true)
        const promise = setDoc(doc(db, 'superBowlPicks', '2026', 'users', user.uid), {
            team,
            timestamp: new Date().toISOString(),
            email: user.email
        })

        toast.promise(promise, {
            loading: 'Saving...',
            success: 'Pick saved successfully!',
            error: (err) => `Error: ${err.message}`
        })

        try {
            await promise
        } catch (err) {
            console.error('Error saving pick:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const sendWelcomeEmail = async (userEmail) => {
        try {
            await emailjs.send(
                'service_7ksu80v',
                'welcome',
                {
                    to_email: userEmail,
                    // Add any other template variables you want to use
                },
                'AnHDdctKqqd6j64nS'
            )
        } catch (error) {
            console.error('Error sending welcome email:', error)
        }
    }

    const handleAuth = async (e) => {
        e.preventDefault()

        const promise = isSignUp 
            ? createUserWithEmailAndPassword(auth, email, password)
            : signInWithEmailAndPassword(auth, email, password)

        toast.promise(promise, {
            loading: isSignUp ? 'Creating account...' : 'Signing in...',
            success: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
            error: (err) => `Error: ${err.message}`
        })

        try {
            const userCredential = await promise
            if (isSignUp) {
                // Send welcome email only for new sign-ups
                await sendWelcomeEmail(userCredential.user.email)
            }
        } catch (error) {
            console.error('Auth error:', error)
        }
    }

    const handleLogout = async () => {
        setSelectedTeam('')
        
        const promise = signOut(auth)

        toast.promise(promise, {
            loading: 'Signing out...',
            success: 'Signed out successfully!',
            error: (err) => `Error: ${err.message}`
        })

        try {
            await promise
            setEmail('')
            setPassword('')
            setIsSignUp(false)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center m-24 p-24 chakra text-xl">Loading...</div>
    }

    if (user) {
        return (
            <div className="
        flex flex-col md:gap-12 gap-8 items-center justify-center
        bg-neutral-100 md:pb-24 pb-20
        sm:pt-32 xs:pt-24 pt-16
        chakra sm:text-xl text-lg
        ">

                <div className="flex flex-col gap-2 items-center justify-center">
                    <div className="
                    flex items-center justify-center marker
                    lg:text-5xl text-4xl
                    ">
                        Settings
                    </div>
                    <div className="text-neutral-500">
                        {user.email}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex flex-col gap-2 justify-center items-center max-w-xl md:mx-auto mx-4 w-full px-4">
                    <label className="font-medium">25/26 <i>🏆</i> Super Bowl pick</label>
                    {selectedTeam && (
                        <div
                            className="w-full flex flex-col items-center justify-center"
                            style={{
                                backgroundColor: teamData?.colors?.secondary ? `#${teamData.colors.secondary}` : 'rgb(255 255 255)',
                            }}
                        >
                            {loading ? (
                                <div className="h-32 w-32 animate-pulse bg-gray-200 rounded-full" />
                            ) : (
                                teamData?.logo && (
                                    <img
                                        src={teamData.logo}
                                        alt={teamData.name}
                                        className="h-32 w-32 object-contain"
                                    />
                                )
                            )}
                        </div>
                    )}
                    <select
                        value={selectedTeam}
                        onChange={handleTeamSelect}
                        disabled={isSaving}
                        className="w-full p-4 marker text-center sm:text-2xl text-xl border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2"
                    >
                        <option value="">Select a team</option>
                        {NFL_TEAMS.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    {isSaving && <span className="text-sm text-neutral-500">Saving...</span>}
                    <span className="uppercase text-base text-neutral-500"><i>🔒</i> Deadline: Sep 5, 2025, 9:00 AM PST</span>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="emailOptOut"
                        checked={emailOptOut}
                        onChange={(e) => setEmailOptOut(e.target.checked)}
                        className="h-6 w-6 bg-transparent border-2 text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2"
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
                Hiya!
            </div>


            <form onSubmit={handleAuth} className="flex flex-col gap-4 max-w-xl mx-auto w-full px-4 chakra">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="p-4 border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2 text-center chakra text-xl"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="p-4 border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2 text-center chakra text-xl"
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