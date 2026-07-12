import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  className?: string
  href?: string
  to?: string
  onClick?: () => void
  disabled?: boolean
  rel?: string
}

export default function Button({ variant = 'primary', children, className = '', href, to, onClick, disabled, rel }: Props) {
  const base = 'inline-flex items-center justify-center text-center font-bold rounded-xl transition-all duration-200 active:scale-95 no-underline'

  const styles: Record<string, string> = {
    primary: 'bg-cyan text-black hover:brightness-110',
    secondary: 'bg-purple text-white hover:brightness-110',
    ghost: 'glass-strong text-white hover:bg-white/15',
  }

  const cls = `${base} ${styles[variant]} ${className}`

  if (disabled) {
    return (
      <button disabled aria-disabled="true" className={`${cls} disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}>
        {children}
      </button>
    )
  }

  if (to) {
    return <Link to={to} className={cls}>{children}</Link>
  }

  if (href) {
    return <a href={href} rel={rel} className={cls}>{children}</a>
  }

  return <button onClick={onClick} className={`${cls} cursor-pointer`}>{children}</button>
}
