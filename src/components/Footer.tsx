import { Link } from 'react-router-dom'
import devasign from '../assets/devasign.svg'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 glass-strong">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/" className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 no-underline">
            Home
          </Link>
          <Link to="/gallery" className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 no-underline">
            Gallery
          </Link>
          <a href="https://patreon.com/deva.png" rel="noopener" className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 no-underline">
            Patreon
          </a>
          <Link to="/terms" className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 no-underline">
            ToS
          </Link>
        </div>

        <img className="h-8 w-auto opacity-60" src={devasign} alt="Deva logo" />

        <p className="text-white/60 text-xs text-center">
          &copy; 2025<br />Designed by Burpies.
        </p>
      </div>
    </footer>
  )
}
