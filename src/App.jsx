import CharacterCard from './Character'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleplayChat from './Chat';
function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<CharacterCard />} />
      <Route path="/chat/:id" element={<RoleplayChat />} />
      <Route path="*" element={<CharacterCard/>}/>
    </Routes>
    </Router>
  )
}

export default App
