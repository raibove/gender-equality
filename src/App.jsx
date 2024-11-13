import CharacterCard from './Character'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleplayChat from './Chat';
function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<CharacterCard />} />
      <Route path="/chat" element={<RoleplayChat />} />
    </Routes>
    </Router>
  )
}

export default App
