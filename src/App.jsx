import { Navigation } from './components/layout/Navigation'
import { Overview } from './views/Overview'
import { YourPicks } from './views/YourPicks'
import { Settings } from './views/Settings'
import { Navigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase'
import { SettingsProvider } from './contexts/SettingsContext'

function App() {
  const [user, loading] = useAuthState(auth)

  // Debug log
  console.log('App auth state:', { user, loading });

  // Wait for auth to initialize
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <SettingsProvider>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            fontFamily: 'Chakra Petch'
          }
        }}
      />
      <Router>
        <div className="min-h-screen min-w-full w-fit pb-12 flex flex-col lg:px-4 bg-[url('assets/board-102.jpg')] bg-repeat bg-[length:1500px_auto] lg:rounded-[3em] sm:rounded-[2.5em] rounded-[2em]">
          <Navigation />
          <Routes>
            {/* Root route with explicit condition */}
            <Route 
              path="/" 
              element={
                user ? (
                  <Navigate to="/overview" replace />
                ) : (
                  <Navigate to="/settings" replace />
                )
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/overview" 
              element={
                user ? (
                  <Overview />
                ) : (
                  <Navigate to="/settings" replace />
                )
              } 
            />
            <Route 
              path="/picks" 
              element={
                user ? (
                  <YourPicks />
                ) : (
                  <Navigate to="/settings" replace />
                )
              } 
            />

            {/* Public route */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  )
}

export default App