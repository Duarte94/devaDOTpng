import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface Props {
  src: string
  alt?: string
  open: boolean
  onClose: () => void
}

export default function Lightbox({ src, alt = '', open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { containerRef, handleKeyDown } = useFocusTrap(open)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef as any}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Image preview'}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-2xl z-10"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
