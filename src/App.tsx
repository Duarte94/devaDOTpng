import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const el = document.getElementById('main-scroll')
    if (el) el.scrollTop = 0
  }, [pathname])
  return null
}
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Background from './components/Background'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Commissions from './pages/Commissions'
import Fanarts from './pages/Fanarts'
import Nsfw from './pages/Nsfw'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <div className="h-dvh flex flex-col bg-black font-['REM'] relative uppercase tracking-wide leading-none">
          <Background />
          <Navbar />
          <div id="main-scroll" className="flex-1 relative z-0 overflow-y-auto">
            <div className="min-h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/commissions" element={<Commissions />} />
                <Route path="/fanarts" element={<Fanarts />} />
                <Route path="/nsfw" element={<Nsfw />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </MotionConfig>
  )
}
