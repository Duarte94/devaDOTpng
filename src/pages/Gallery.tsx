import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import FilterBar from '../components/ui/FilterBar'
import ArtworkGrid from '../components/ui/ArtworkGrid'
import type { ArtworkItem } from '../api/types'
import Pagination from '../components/ui/Pagination'
import Lightbox from '../components/ui/Lightbox'
import { fetchGallery } from '../api/queries'
import { useQuery } from '../hooks/useQuery'
import { scrollMainToTop } from '../lib/scroll'
import { ALL_TAGS } from '../constants/tags'

const ITEMS_PER_PAGE = 8

export default function Gallery() {
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [lightboxItem, setLightboxItem] = useState<ArtworkItem | null>(null)

  const { data, loading, error } = useQuery(
    () => fetchGallery({ page, perPage: ITEMS_PER_PAGE, tags: activeTags }),
    [page, activeTags],
  )

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setPage(1)
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    scrollMainToTop()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle as="h1">GALLERY</SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6"
      >
        <FilterBar tags={Array.from(ALL_TAGS)} active={activeTags} onToggle={toggleTag} />
      </motion.div>

      {loading ? (
        <p className="text-white/50 text-center mt-16">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center mt-16">{error}</p>
      ) : items.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-center mt-16"
        >
          No artworks match the selected filters.
        </motion.p>
      ) : (
        <ArtworkGrid
          items={items}
          onItemClick={setLightboxItem}
          className="mt-8"
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Lightbox
        src={lightboxItem?.image ?? ''}
        alt={lightboxItem?.title ?? ''}
        open={!!lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </main>
  )
}
