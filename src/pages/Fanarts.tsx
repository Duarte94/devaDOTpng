import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import ArtworkGrid from '../components/ui/ArtworkGrid'
import type { ArtworkItem } from '../api/types'
import Pagination from '../components/ui/Pagination'
import Lightbox from '../components/ui/Lightbox'
import GlassCard from '../components/ui/GlassCard'
import { fetchFanarts } from '../api/queries'
import { useQuery } from '../hooks/useQuery'
import { scrollMainToTop } from '../lib/scroll'

const ITEMS_PER_PAGE = 6

export default function Fanarts() {
  const [page, setPage] = useState(1)
  const [lightboxItem, setLightboxItem] = useState<ArtworkItem | null>(null)

  const { data, loading, error } = useQuery(
    () => fetchFanarts({ page, perPage: ITEMS_PER_PAGE }),
    [page],
  )

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

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
        <SectionTitle as="h1">FEATURED FANARTS</SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6"
      >
        <GlassCard className="p-6 space-y-3">
          <p className="text-white/80 text-base leading-relaxed">
            Share your fanarts or DTIYS on social media with the hashtag{' '}
            <span className="text-cyan font-semibold">#DevaVerse</span>, and they will be featured in this section.
          </p>
          <p className="text-white/60 text-sm">
            Try to keep it SFW!
          </p>
        </GlassCard>
      </motion.div>

      {loading ? (
        <p className="text-white/50 text-center mt-16">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center mt-16">{error}</p>
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
