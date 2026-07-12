import { motion } from 'framer-motion'
import GlassCard from './GlassCard'
import Badge from './Badge'
import type { ArtworkItem } from '../../api/types'

interface Props {
  items: ArtworkItem[]
  onItemClick: (item: ArtworkItem) => void
  className?: string
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function ArtworkGrid({ items, onItemClick, className = '' }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
    >
      {items.map((art) => (
        <motion.div
          key={art.id}
          variants={item}
          onClick={() => onItemClick(art)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemClick(art); } }}
          role="button"
          tabIndex={0}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer p-0 text-left transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(82,208,208,0.15)] focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2"
        >
          <img
            src={art.thumb || art.image}
            alt={art.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300">
            {!art.username && (
              <p className="text-white text-sm font-semibold truncate">{art.title}</p>
            )}
            {art.tags && (
              <div className="flex flex-wrap gap-1 mt-1">
                {art.tags.map((tag) => (
                  <Badge key={tag} variant="cyan">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
          {art.username && (
            <GlassCard className="absolute bottom-2 left-2 px-2 py-0.5 text-xs text-white/80">
              {art.username}
            </GlassCard>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
