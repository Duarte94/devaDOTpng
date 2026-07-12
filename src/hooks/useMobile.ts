import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : true
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    handler(mq)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}
