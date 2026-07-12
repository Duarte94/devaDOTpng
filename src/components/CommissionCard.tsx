import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  title: string
  image: string
  prices: { label: string; value: string }[]
}

export default function CommissionCard({ title, image, prices }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        id={`commission-toggle-${title}`}
        aria-expanded={open}
        className="flex items-center justify-between w-full px-6 py-4 text-white text-lg font-semibold cursor-pointer bg-transparent border-none transition-colors duration-200 hover:bg-white/5"
      >
        <span>{title}</span>
        <motion.i
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="fa-solid fa-chevron-down text-cyan"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            role="region"
            aria-labelledby={`commission-toggle-${title}`}
          >
            <div className="flex flex-col md:flex-row gap-6 p-6 pt-0 border-t border-white/10">
              <img src={image} alt={title} loading="lazy" className="h-44 w-auto rounded-xl object-cover" />
              <div className="flex flex-col justify-center gap-3">
                {prices.map((p) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="text-white/60 text-sm font-medium w-16">{p.label}</span>
                    <span className="text-cyan font-bold text-lg">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
