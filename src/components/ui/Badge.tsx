interface Props {
  children: string
  variant?: 'cyan' | 'purple' | 'white'
  className?: string
}

const variantStyles: Record<string, string> = {
  cyan: 'bg-cyan/15 text-cyan border-cyan/30',
  purple: 'bg-purple/15 text-white border-purple/30',
  white: 'bg-white/10 text-white/80 border-white/20',
}

export default function Badge({ children, variant = 'cyan', className = '' }: Props) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
