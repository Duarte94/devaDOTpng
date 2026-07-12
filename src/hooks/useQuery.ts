import { useState, useEffect } from 'react'

export interface QueryState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
): QueryState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    queryFn()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, deps)

  return { data, loading, error }
}
