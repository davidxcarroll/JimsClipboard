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
import { signInWithGoogle } from '../hooks/useAuth';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { useTeamLogo } from '../hooks/useTeamLogo'
import { NavLink } from 'react-router-dom'
import { ESPN_TEAM_ABBREVIATIONS, getDisplayName, getEspnAbbreviation } from '../utils/teamMapping'

export function Settings() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState('')
    const [emailOptOut, setEmailOptOut] = useState(false)
    const [name, setName] = useState('')
    const { logoUrl, teamColors, loading: teamLoading } = useTeamLogo(selectedTeam)
    const [isSaving, setIsSaving] = useState(false)
    const [initialName, setInitialName] = useState('')
    const [initialTeam, setInitialTeam] = useState('')
    const [initialEmailOptOut, setInitialEmailOptOut] = useState(false)
    const [timeZone, setTimeZone] = useState('PST')
    const [initialTimeZone, setInitialTimeZone] = useState('PST')

    const getFirstName = (fullName) => {
        if (!fullName) return '';
        return fullName.split(' ')[0];
    };

    // Load existing data when component mounts
    useEffect(() => {
        let isMounted = true

        async function loadUserData() {
            if (!user) {
                // Reset all states
                setSelectedTeam('');
                setName('');
                setInitialTeam('');
                setInitialName('');
                setEmailOptOut(false);
                setInitialEmailOptOut(false);
                setTimeZone('PST');
                setInitialTimeZone('PST');
                return;
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const currentYear = '2026';
                    const superBowlPick = data.picks?.[currentYear]?.superBowl?.team || '';

                    setSelectedTeam(superBowlPick);
                    setName(data.name || getFirstName(user.displayName) || '');
                    setEmailOptOut(data.emailOptOut || false);
                    setTimeZone(data.timeZone || 'PST');

                    // Set initial values
                    setInitialTeam(superBowlPick);
                    setInitialName(data.name || getFirstName(user.displayName) || '');
                    setInitialEmailOptOut(data.emailOptOut || false);
                    setInitialTimeZone(data.timeZone || 'PST');
                } else {
                    // Set defaults for new users
                    const defaultName = getFirstName(user.displayName) || '';
                    setSelectedTeam('');
                    setName(defaultName);
                    setEmailOptOut(false);
                    setTimeZone('PST');

                    // Set initial values
                    setInitialTeam('');
                    setInitialName(defaultName);
                    setInitialEmailOptOut(false);
                    setInitialTimeZone('PST');
                }
            } catch (err) {
                console.error('Error loading user data:', err);
            }
        }

        loadUserData()

        return () => {
            isMounted = false
        }
    }, [user])

    // Handle name change
    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleTeamSelect = (e) => {
        const team = e.target.value
        setSelectedTeam(team)
        if (team) {
            savePick(team)
        }
    }

    if (loading) {
        return <div className="w-fit flex justify-center items-center self-center mt-12 chakra text-xl px-2 text-white bg-black">Loading...</div>
    }

    const savePick = async (team) => {
        if (!user) return;

        setIsSaving(true);
        const currentYear = '2026';

        try {
            const userRef = doc(db, 'users', user.uid);

            // First get the current user data
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};

            // Prepare the update object maintaining existing picks
            const updatedData = {
                ...userData,
                name,
                email: user.email,
                emailOptOut,
                timeZone,
                updatedAt: new Date().toISOString(),
                picks: {
                    ...userData.picks,
                    [currentYear]: {
                        ...userData.picks?.[currentYear],
                        superBowl: {
                            team,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }
            };

            const promise = setDoc(userRef, updatedData);

            toast.promise(promise, {
                loading: 'Saving...',
                success: 'Settings saved successfully!',
                error: 'Error saving settings'
            });

            await promise;

            // Update initial values after successful save
            setInitialTeam(team);
            setInitialName(name);
            setInitialEmailOptOut(emailOptOut);
            setInitialTimeZone(timeZone);
        } catch (err) {
            console.error('Error saving settings:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Update the condition for showing the save button
    const hasUnsavedChanges =
        name !== initialName ||
        selectedTeam !== initialTeam ||
        emailOptOut !== initialEmailOptOut ||
        timeZone !== initialTimeZone

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

        // Validate inputs
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        // Validate password length for sign up
        if (isSignUp && password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const promise = isSignUp
            ? createUserWithEmailAndPassword(auth, email, password)
            : signInWithEmailAndPassword(auth, email, password)

        toast.promise(promise, {
            loading: isSignUp ? 'Creating account...' : 'Signing in...',
            success: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
            error: (err) => {
                // Provide more user-friendly error messages
                switch (err.code) {
                    case 'auth/user-not-found':
                        return 'No account found with this email';
                    case 'auth/wrong-password':
                        return 'Incorrect password';
                    case 'auth/invalid-email':
                        return 'Invalid email address';
                    case 'auth/email-already-in-use':
                        return 'Email already registered';
                    default:
                        return `Error: ${err.message}`;
                }
            }
        })

        try {
            const userCredential = await promise
            if (isSignUp) {
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

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            // The redirect will happen automatically
            // The result will be handled in useAuth
        } catch (error) {
            console.error('Google Sign-in Error:', error);
        }
    };

    const handleYahooSignIn = async () => {
        const provider = new OAuthProvider('yahoo.com')

        try {
            const promise = signInWithPopup(auth, provider)

            toast.promise(promise, {
                loading: 'Signing in with Yahoo...',
                success: 'Signed in successfully!',
                error: (err) => `Error: ${err.message}`
            })

            await promise
        } catch (error) {
            console.error('Yahoo Sign-in Error:', error)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center m-24 p-24 chakra text-xl px-2 text-white bg-black">Loading...</div>
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

                <div className="max-w-xl md:mx-auto mx-4 px-4 w-full flex flex-col items-center justify-center gap-2">
                    <div className="uppercase text-base text-neutral-500">Name</div>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Name"
                        className="w-full p-4 border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2 text-center chakra text-xl"
                    />
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex flex-col gap-2 justify-center items-center max-w-xl md:mx-auto mx-4 w-full px-4">
                    <label className="flex flex-row items-center gap-1 font-medium">25/26 <span className="material-symbols-sharp">trophy</span> Super Bowl pick</label>
                    {selectedTeam && (
                        <div
                            className="w-full flex flex-col items-center justify-center"
                        >
                            {teamLoading ? (
                                <div className="h-32 w-32 animate-pulse bg-white" />
                            ) : logoUrl ? (
                                <div
                                    className="w-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: teamColors?.alternate || 'bg-white'
                                    }}
                                >
                                    <img
                                        src={logoUrl}
                                        alt={selectedTeam}
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>
                            ) : (
                                <div>No logo found</div>
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
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                <div className="flex flex-col gap-2 justify-center items-center max-w-xl md:mx-auto mx-4 w-full px-4">
                    <label className="flex flex-row items-center gap-1 font-medium">Time <span className="material-symbols-sharp">language</span> Zone</label>
                    <select
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="w-full p-4 marker text-center sm:text-2xl text-xl border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2"
                    >
                        <option value="America/Los_Angeles">Pacific (PT)</option>
                        <option value="America/Denver">Mountain (MT)</option>
                        <option value="America/Chicago">Central (CT)</option>
                        <option value="America/New_York">Eastern (ET)</option>
                        <option value="America/Anchorage">Alaska (AKT)</option>
                        <option value="Pacific/Honolulu">Hawaii (HT)</option>
                    </select>
                </div>

                {/* Divider */}
                {/* <div className="w-full h-[1px] bg-neutral-200" /> */}

                {/* <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="emailOptOut"
                        checked={emailOptOut}
                        onChange={(e) => setEmailOptOut(e.target.checked)}
                        className="h-6 w-6 bg-transparent border-2 text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2"
                    />
                    <label htmlFor="emailOptOut" className="inline">Get reminder emails</label>
                </div> */}

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-200" />

                {/* Save Button - only show if there are unsaved changes */}
                <div className="group flex flex-col gap-8 items-center justify-center sticky bottom-0 z-50">
                    <NavLink
                        to="/overview"
                        onClick={() => savePick(selectedTeam)}
                        className="flex items-center justify-center py-4 px-8 bg-black group-hover:bg-neutral-900 cursor-pointer chakra uppercase text-white lg:text-3xl md:text-2xl sm:text-xl text-lg"
                    >
                        Done
                    </NavLink>
                </div>

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
                    required
                    className="p-4 border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2 text-center chakra text-xl"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={6}
                    className="p-4 border-none text-black accent-black focus:ring-black focus:ring-4 focus:ring-offset-2 text-center chakra text-xl"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center py-4 px-8 bg-black cursor-pointer uppercase text-white lg:text-3xl md:text-2xl sm:text-xl text-lg"
                >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>

                {/* <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-neutral-200"></div>
                    <span className="text-neutral-500">or</span>
                    <div className="flex-1 h-px bg-neutral-200"></div>
                </div> */}

                {/* <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 py-4 px-8 border border-neutral-200 hover:border-black"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button> */}

                {/* <button
                    type="button"
                    onClick={handleYahooSignIn}
                    className="flex items-center justify-center gap-3 py-4 px-8 border border-neutral-200 hover:border-black"
                >
                    <img
                        src="https://www.yahoo.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Continue with Yahoo
                </button> */}

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