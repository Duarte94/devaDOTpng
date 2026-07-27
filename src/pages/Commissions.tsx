import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import ToSModal from '../components/ToSModal'
import CommissionCard from '../components/CommissionCard'
import Button from '../components/ui/Button'
import { fetchPrices, fetchCommissionExtras } from '../api/queries'
import { useQuery } from '../hooks/useQuery'
import aniElfa from '../assets/Ani-Elfa.webp'

export default function Commissions() {
  const [accepted, setAccepted] = useState(false)

  const { data: prices, loading, error } = useQuery(fetchPrices, [])
  const { data: extras } = useQuery(fetchCommissionExtras, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle as="h1">COMMISSIONS</SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-8"
      >
        <ToSModal accepted={accepted} onAcceptChange={setAccepted} />
      </motion.div>

      <p className="text-white text-sm text-center mt-2">
        PLEASE READ THE TERMS OF SERVICE FIRST
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-8 space-y-3"
      >
        <Button
          variant="primary"
          to="/"
          disabled={!accepted}
          className="w-full h-12 px-6 text-sm md:text-base disabled:opacity-60"
        >
          MAKE YOUR REQUEST
        </Button>
        <Button variant="secondary" href="https://trello.com" rel="noopener" className="w-full h-auto min-h-12 px-5 py-3 text-sm md:text-base leading-snug">
          <span className="inline-flex items-center gap-2">
            <i className="fa-brands fa-trello" /> Check your commission status on Trello
          </span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-12"
      >
        <p className="text-white text-lg font-semibold mb-4">Prices</p>

        {loading ? (
          <p className="text-white/50 text-center mt-4">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-center mt-4">{error}</p>
        ) : (
          <div className="space-y-3">
            {(prices ?? []).map((p) => (
              <CommissionCard key={p.title} title={p.title} image={aniElfa} prices={p.prices} />
            ))}
          </div>
        )}

        <p className="text-white/60 text-sm mt-6 leading-relaxed">
          <span className="text-white font-semibold">Extras</span><br /><br />
          {(extras ?? []).map((e) => (
            <span key={e.label}>
              {e.label}: +{e.percent}%<br />
            </span>
          ))}
        </p>
      </motion.div>
    </main>
  )
}
