import './setupMock'
import { client } from './client'
import type {
  PriceCategory,
  PatreonTier,
  WaitlistResponse,
  Paginated,
  ArtworkItem,
  CommissionExtra,
} from './types'

export async function fetchGallery(params?: {
  page?: number
  perPage?: number
  tags?: string[]
}): Promise<Paginated<ArtworkItem>> {
  const res = await client.get('/gallery', {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 999,
      tags: params?.tags?.length ? params.tags.join(',') : undefined,
    },
  })
  return res.data
}

export async function fetchFanarts(params?: {
  page?: number
  perPage?: number
}): Promise<Paginated<ArtworkItem>> {
  const res = await client.get('/fanarts', {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 999,
    },
  })
  return res.data
}

export async function fetchPrices(): Promise<PriceCategory[]> {
  const res = await client.get('/commissions/prices')
  return res.data
}

export async function fetchPatreonTiers(): Promise<PatreonTier[]> {
  const res = await client.get('/patreon/tiers')
  return res.data
}

export async function fetchWaitlist(): Promise<WaitlistResponse> {
  const res = await client.get('/waitlist')
  return res.data
}

export async function fetchCommissionExtras(): Promise<CommissionExtra[]> {
  const res = await client.get('/commissions/extras')
  return res.data
}
