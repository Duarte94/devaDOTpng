interface Props {
  className?: string
}

export default function UnderConstruction({ className = '' }: Props) {
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm ${className}`}
    >
      <span className="text-white/90 text-lg font-semibold tracking-widest uppercase">
        Under construction
      </span>
      <span className="text-white/40 text-xs mt-2 tracking-wider" aria-hidden="true">
        — content coming soon —
      </span>
    </div>
  )
}