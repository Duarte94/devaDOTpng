import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import PatreonCard from '../components/PatreonCard'
import Button from '../components/ui/Button'
import GlassCard from '../components/ui/GlassCard'
import { fetchPatreonTiers } from '../api/queries'
import { useQuery } from '../hooks/useQuery'
import UnderConstruction from '../components/ui/UnderConstruction'

export default function Nsfw() {
  const { data: tiers, loading, error } = useQuery(fetchPatreonTiers, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle as="h1">EXPLICIT CONTENT</SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6"
      >
        <GlassCard className="p-6 space-y-3">
          <p className="text-white/70 text-sm leading-relaxed">
            Become a Patron to access exclusive content, such as early access to illustrations, work-in-progress (WIP) shots, and uncensored versions of my artwork.
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            You will also be able to participate in polls to decide upcoming characters, get special discounts on commissions, and have more chances in raffles.
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            If you would like to support my work without accessing NSFW content, there is an SFW option available just for you.<br />Thank you for supporting me!
          </p>
        </GlassCard>
      </motion.div>

      {loading ? (
        <p className="text-white/50 text-center mt-16">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center mt-16">{error}</p>
      ) : (
        <div className="relative">
          <UnderConstruction />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {(tiers ?? []).map((tier) => (
              <PatreonCard key={tier.name} {...tier} />
            ))}
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8"
      >
        <Button variant="primary" href="https://patreon.com/deva.png" rel="noopener" className="w-full h-14 text-lg">
          <i className="fa-brands fa-patreon mr-2" /> Join now
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="text-white/60 text-xs text-center mt-6 leading-relaxed"
      >
        *PayPal fee not included for the discount calculation.<br /><br />
        Sketch / Flat: 30% OFF.<br />
        Full render: 15% OFF.
      </motion.p>
    </main>
  )
}
