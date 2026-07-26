import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'
import GlassCard from './ui/GlassCard'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { tosSections } from '../content/tos'

interface Props {
  accepted: boolean
  onAcceptChange: (v: boolean) => void
}

export default function ToSModal({ accepted, onAcceptChange }: Props) {
  const [showModal, setShowModal] = useState(false)
  const { containerRef, handleKeyDown } = useFocusTrap(showModal)

  useEffect(() => {
    if (showModal) {
      const container = containerRef.current
      if (container) {
        container.scrollTop = 0
        container.focus()
      }
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  return (
    <div className="flex items-center justify-center gap-4">
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

      {createPortal(
        <AnimatePresence>
          {showModal && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100]"
            >
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/25 backdrop-blur-[4px] pointer-events-none"
              />
              <motion.div
                key="modal"
                ref={containerRef as any}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                tabIndex={-1}
                className="fixed inset-x-4 bottom-4 top-[15vh] md:inset-x-1/4 md:inset-y-[10vh] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-y-auto p-5 md:p-8 outline-none"
                role="dialog"
                aria-modal="true"
                aria-label="Terms of Service"
              >
                <div className="space-y-6">
                  {tosSections.map((section) => (
                    <GlassCard key={section.title} className="p-4 md:p-6 space-y-4">
                      <h2 className="text-cyan text-lg font-semibold">{section.title}</h2>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    </GlassCard>
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
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
