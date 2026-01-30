import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Collections from './pages/Collections'
import Profile from './pages/Profile'
import ListNFT from './pages/ListNFT'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-dark via-dark to-card">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list-nft" element={<ListNFT />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
