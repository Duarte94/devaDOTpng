import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import devasign from '../assets/devasign.svg'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useMobile } from '../hooks/useMobile'

const links = [
  { to: '/gallery', label: 'GALLERY' },
  { to: '/commissions', label: 'COMMISSIONS' },
  { to: '/fanarts', label: 'FANARTS' },
  { to: '/nsfw', label: 'NSFW' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { containerRef, handleKeyDown } = useFocusTrap(open)
  const isMobile = useMobile()

  useEffect(() => {
    if (!isMobile) setOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [open])

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="w-full flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={() => setOpen(!open)}
              tabIndex={open ? -1 : 0}
              aria-hidden={open}
              className={`flex items-center justify-center w-11 h-11 glass rounded-xl text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 cursor-pointer ${open ? 'opacity-0 pointer-events-none invisible' : ''}`}
              aria-label="Menu"
            >
              <i className="fa-solid fa-bars fa-lg" />
            </button>
          )}

          <Link to="/">
            <img className="h-8 w-auto" src={devasign} alt="Deva logo" />
          </Link>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center h-10 px-4 rounded-xl font-semibold text-sm no-underline transition-all duration-200 ${
                    isActive
                      ? 'text-cyan border-b-2 border-cyan'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
              <button type="button" className="flex items-center justify-center w-9 h-9 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Discord">
                <i className="fa-brands fa-discord fa-sm" />
              </button>
              <button type="button" className="flex items-center justify-center w-9 h-9 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Instagram">
                <i className="fa-brands fa-instagram fa-sm" />
              </button>
              <button type="button" className="flex items-center justify-center w-9 h-9 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Twitter / X">
                <i className="fa-brands fa-x-twitter fa-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/90"
                onClick={() => setOpen(false)}
              />
              <motion.aside
                ref={containerRef as any}
                onKeyDown={handleKeyDown}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
              >
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-11 h-11 glass rounded-xl text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <i className="fa-solid fa-xmark fa-lg" />
                  </button>
                </div>

                <div className="flex-1 bg-[#0a0a0a] opacity-90 px-4 py-4 h-fit space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center h-12 px-4 rounded-xl font-semibold text-sm no-underline transition-all duration-200 ${
                          isActive
                            ? 'text-white border-l-2 border-cyan bg-white/5'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="shrink-0 flex bg-slate-900 opacity-75 justify-center gap-4 p-2 border-t border-white/10">
                  <button type="button" tabIndex={-1} aria-hidden="true" className="flex items-center justify-center w-11 h-11 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Discord">
                    <i className="fa-brands fa-discord" />
                  </button>
                  <button type="button" tabIndex={-1} aria-hidden="true" className="flex items-center justify-center w-11 h-11 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Instagram">
                    <i className="fa-brands fa-instagram" />
                  </button>
                  <button type="button" tabIndex={-1} aria-hidden="true" className="flex items-center justify-center w-11 h-11 glass rounded-lg text-white/50 hover:text-cyan hover:border-cyan/30 transition-all duration-200 cursor-pointer" aria-label="Twitter / X">
                    <i className="fa-brands fa-x-twitter" />
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
    </nav>
  )
}
