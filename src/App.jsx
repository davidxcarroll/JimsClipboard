import { Navigation } from './components/layout/Navigation'
import { Overview } from './views/Overview'
import { YourPicks } from './views/YourPicks'
import { Settings } from './views/Settings'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="bottom-left" />
      <Router>
        <div className="
          min-h-screen min-w-full w-fit pb-12
          flex flex-col
          lg:px-4
          bg-[url('assets/board-102.jpg')] bg-repeat bg-[length:1500px_auto]
          lg:rounded-[3em] sm:rounded-[2.5em] rounded-[2em]
        ">
          {/* <Header /> */}
          <Navigation />
          <Routes>
            <Route path="/settings" element={<Settings />} />
            {/* All other routes are protected */}
            <Route path="/" element={<Overview />} />
            <Route path="/picks" element={<YourPicks />} />
            {/* Add other protected routes here */}
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App