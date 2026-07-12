import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import GlassCard from '../components/ui/GlassCard'
import { tosSections } from '../content/tos'

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle as="h1">TERMS OF SERVICE</SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6 space-y-6"
      >
        <GlassCard className="p-6 space-y-4">
          <p className="text-white/70 text-sm">Last updated: 2025</p>
        </GlassCard>

        {tosSections.map((section) => (
          <GlassCard key={section.title} className="p-6 space-y-4">
            <h2 className="text-cyan text-lg font-semibold">{section.title}</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {section.content}
            </p>
          </GlassCard>
        ))}
      </motion.div>
    </main>
  )
}
