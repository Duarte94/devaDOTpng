interface Props {
  name: string
  description: string
  price: string
  highlighted?: boolean
}

export default function PatreonCard({ name, description, price, highlighted }: Props) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        highlighted
          ? 'glass-strong border-cyan/40 shadow-[0_0_24px_rgba(82,208,208,0.15)]'
          : 'glass border-white/10'
      }`}
    >
      <div className={`px-6 py-4 ${highlighted ? 'bg-cyan/10' : ''}`}>
        <p className={`text-lg font-semibold ${highlighted ? 'text-cyan' : 'text-white'}`}>
          {name}
        </p>
      </div>
      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
          {description}
        </p>
        <p className={`text-4xl font-bold mt-4 ${highlighted ? 'text-cyan' : 'text-white'}`}>
          {price}
        </p>
      </div>
    </div>
  )
}
