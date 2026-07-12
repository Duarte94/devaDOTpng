import { motion } from 'framer-motion'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const btn = 'glass-strong text-white/70 hover:text-white hover:border-cyan/30 transition-all duration-200 w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer text-sm'

  return (
    <nav aria-label="Pagination">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center gap-2 mt-8"
      >
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className={`${btn} disabled:opacity-30 disabled:cursor-not-allowed`} aria-label="First page">
          <i className="fa-solid fa-angles-left" />
        </button>
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`${btn} disabled:opacity-30 disabled:cursor-not-allowed`} aria-label="Previous page">
          <i className="fa-solid fa-angle-left" />
        </button>

        <span className="text-white/60 text-sm px-3">
          {currentPage} / {totalPages}
        </span>

        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`${btn} disabled:opacity-30 disabled:cursor-not-allowed`} aria-label="Next page">
          <i className="fa-solid fa-angle-right" />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className={`${btn} disabled:opacity-30 disabled:cursor-not-allowed`} aria-label="Last page">
          <i className="fa-solid fa-angles-right" />
        </button>
      </motion.div>
    </nav>
  )
}
