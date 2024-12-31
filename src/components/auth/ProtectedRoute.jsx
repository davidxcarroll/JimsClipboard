import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../config/firebase'

export function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth)

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/settings" replace />
    }

    return children
}