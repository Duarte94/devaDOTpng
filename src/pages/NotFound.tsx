import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'

export default function NotFound() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <p className="text-6xl font-bold text-cyan">404</p>
        <SectionTitle as="h1">PAGE NOT FOUND</SectionTitle>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-12 px-8 bg-cyan text-black font-bold rounded-xl hover:brightness-110 transition-all duration-200 active:scale-95 no-underline text-sm"
        >
          Back to home
        </Link>
      </motion.div>
    </main>
  )
}
