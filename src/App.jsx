import { Navigation } from './components/layout/Navigation'
import { CurrentWeek } from './views/CurrentWeek'
import { YourPicks } from './views/YourPicks'
import { Standings } from './views/Standings'
import { Settings } from './views/Settings'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen min-w-full w-fit flex flex-col">
        {/* <Header /> */}
        <Navigation />
        <Routes>
          <Route path="/" element={<CurrentWeek />} />
          <Route path="/picks" element={<YourPicks />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App