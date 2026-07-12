interface Props {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export default function SectionTitle({ children, as: Tag = 'h2', className = '' }: Props) {
  const size = Tag === 'h1' ? 'text-3xl' : 'text-2xl'
  return (
    <Tag className={`text-white ${size} font-semibold ${className}`}>
      <span className="text-cyan">// </span>{children}
    </Tag>
  )
}
