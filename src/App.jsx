import { Navigation } from './components/layout/Navigation'
import { Overview } from './views/Overview'
import { YourPicks } from './views/YourPicks'
import { Settings } from './views/Settings'
import { Navigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase'

function App() {
  const [user] = useAuthState(auth)

  return (
    <>
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
            {/* Redirect root based on auth state */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/overview" /> : <Navigate to="/settings" />} 
            />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/overview" element={
              user ? <Overview /> : <Navigate to="/settings" />
            } />
            <Route path="/picks" element={
              user ? <YourPicks /> : <Navigate to="/settings" />
            } />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App