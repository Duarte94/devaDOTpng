import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import GlassCard from '../components/ui/GlassCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { fetchWaitlist } from '../api/queries'
import { useQuery } from '../hooks/useQuery'
import commissionBanner from '../assets/commission-banner.png'
import patreonBanner from '../assets/patreon-banner.png'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' as const },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' as const },
  transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.1 },
}

export default function Home() {
  const { data: waitlist, loading: wlLoading } = useQuery(fetchWaitlist, [])

  return (
    <>
      <h1 className="sr-only">Deva.png — Artist Portfolio</h1>
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <motion.section {...fadeUp}>
          <GlassCard className="p-8">
            <p className="text-cyan text-lg font-semibold mb-4">About me:</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Hi! I'm from Argentina and I love drawing and playing videogames.<br />
              I started by copying my favorite characters from anime series, and over time, that passion grew into creating my own characters, poses, and a style that continues to evolve with every piece.<br />
              My goal is to help bring your ideas to life with creativity and attention to detail.
            </p>
            <div className="flex gap-12 mt-6">
              <div>
                <p className="text-cyan text-sm font-semibold mb-2">Likes:</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="cyan">Digimon</Badge>
                  <Badge variant="cyan">Hatsune Miku</Badge>
                  <Badge variant="cyan">Rhythm Games</Badge>
                </div>
              </div>
              <div>
                <p className="text-cyan text-sm font-semibold mb-2">Dislikes:</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="red">Summer</Badge>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...fadeUp}>
            <GlassCard
              className="relative overflow-hidden p-8"
              style={{ backgroundImage: `url(${commissionBanner})`, backgroundPosition: 'right', backgroundRepeat: 'no-repeat', backgroundSize: 'auto 100%' }}
            >
              <div className="w-1/2 md:w-auto">
                <p className="text-white text-lg font-semibold">
                  Commission status:<br />
                  <span className="text-cyan font-bold text-3xl">OPEN</span>
                </p>
                <div className="mt-6">
                  <Button to="/commissions" variant="primary" className="h-10 px-6 text-sm">
                    +Info
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div {...stagger}>
            <GlassCard
              className="relative overflow-hidden p-8"
              style={{ backgroundImage: `url(${patreonBanner})`, backgroundPosition: 'right', backgroundRepeat: 'no-repeat', backgroundSize: 'auto 100%' }}
            >
              <div className="w-1/2 md:w-auto">
                <p className="text-white text-lg font-semibold">
                  Join Patreon to get exclusive<br />
                  <span className="text-cyan font-bold text-3xl">DISCOUNTS.</span>
                </p>
                <div className="mt-6">
                  <Button href="https://patreon.com" variant="primary" className="h-10 px-6 text-sm">
                    Join
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.section {...fadeUp}>
          <GlassCard className="p-8 max-w-sm mx-auto text-center">
            <p className="text-white text-xl font-semibold mb-1">WAITLIST</p>
            {wlLoading ? (
              <p className="text-white/60 text-xs mb-6">Loading...</p>
            ) : waitlist ? (
              <>
                <p className="text-white/60 text-xs mb-6">
                  Available slots: {waitlist.slots}/{waitlist.total}
                </p>
                <div className="space-y-2">
                  {waitlist.entries.map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-center h-12 rounded-xl border border-white/10 bg-white/5 text-cyan font-medium text-sm"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </GlassCard>
        </motion.section>
      </main>
    </>
  )
}
