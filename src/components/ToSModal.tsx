import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { tosSections } from '../content/tos'

interface Props {
  accepted: boolean
  onAcceptChange: (v: boolean) => void
}

export default function ToSModal({ accepted, onAcceptChange }: Props) {
  const [showModal, setShowModal] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { containerRef, handleKeyDown } = useFocusTrap(showModal)

  useEffect(() => {
    if (showModal) {
      closeRef.current?.focus()
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowModal(false)
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [showModal])

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setShowModal(true)}
        role="checkbox"
        aria-checked={accepted}
        aria-label="I have read and accept the terms of service"
        className={`w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
          accepted ? 'bg-cyan border-cyan' : 'border-white/30 hover:border-white/60'
        }`}
      />

      <button
        onClick={() => setShowModal(true)}
        className="text-white/70 text-sm font-medium bg-transparent border-none cursor-pointer hover:text-white transition-colors text-left"
      >
        I have read and accept the{' '}
        <span className="text-cyan underline decoration-cyan/40">terms of service</span>.
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              ref={containerRef as any}
              onKeyDown={handleKeyDown}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-4 md:inset-x-1/4 md:inset-y-[10vh] z-50 glass-strong rounded-2xl overflow-y-auto p-6 md:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="Terms of Service"
            >
              <div className="space-y-6">
                {tosSections.map((section) => (
                  <div key={section.title}>
                    <p className="text-cyan text-lg font-semibold text-center">{section.title}</p>
                    <p className="text-white/70 text-sm leading-relaxed text-center">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 h-12">
                  Close
                </Button>
                <Button variant="primary" onClick={() => { onAcceptChange(true); setShowModal(false) }} className="flex-1 h-12">
                  Accept
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
