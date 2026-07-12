import { tagLabels } from '../../constants/tags'

interface Props {
  tags: string[]
  active: string[]
  onToggle: (tag: string) => void
}

export default function FilterBar({ tags, active, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const on = active.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            aria-pressed={on}
            className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
              on
                ? 'bg-cyan text-black border-cyan'
                : 'glass-strong text-white/60 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            {tagLabels[tag] ?? tag}
          </button>
        )
      })}
    </div>
  )
}
