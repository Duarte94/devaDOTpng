import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function GlassCard({ children, className = '', style }: Props) {
  return (
    <div className={`glass rounded-2xl ${className}`} style={style}>
      {children}
    </div>
  )
}
