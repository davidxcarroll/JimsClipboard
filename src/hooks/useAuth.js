import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
    onAuthStateChanged, 
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
    // Add these parameters
    auth_host: 'https://jims-clipboard.firebaseapp.com',
    authtype: 'redirected'
});

export const signInWithGoogle = async () => {
    try {
        // Clear any existing auth state
        if (auth.currentUser) {
            await auth.signOut();
        }
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            console.error('Google Sign-in Error:', error);
        }
        throw error;
    }
};

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { user, loading };
}