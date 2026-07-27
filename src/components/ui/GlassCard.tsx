import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function GlassCard({ children, className = '', style }: Props) {
  return (
    <div className={`bg-[#141414] border border-white/5 rounded-2xl ${className}`} style={style}>
      {children}
    </div>
  )
}
