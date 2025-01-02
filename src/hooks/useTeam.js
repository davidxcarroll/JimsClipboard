import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../config/firebase'

export function useTeam() {
    const [team, setTeam] = useState(null)
    const [user] = useAuthState(auth)

    useEffect(() => {
        if (!user) return

        const userRef = doc(db, 'users', user.uid)
        getDoc(userRef).then(docSnap => {
            if (docSnap.exists()) {
                setTeam(docSnap.data())
            }
        })
    }, [user])

    const updateTeam = async (updatedData) => {
        if (!user) return

        const userRef = doc(db, 'users', user.uid)
        await setDoc(userRef, updatedData, { merge: true })
        setTeam(updatedData)
    }

    return { team, updateTeam }
}