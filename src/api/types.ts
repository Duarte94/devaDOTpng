export interface ArtworkItem {
  id: string
  title: string
  image: string
  thumb?: string
  tags?: string[]
  username?: string
  width?: number
  height?: number
}

export interface PriceTier {
  label: string
  value: string
}

export interface PriceCategory {
  title: string
  prices: PriceTier[]
}

export interface CommissionExtra {
  label: string
  percent: number
}

export interface PatreonTier {
  name: string
  description: string
  price: string
  highlighted: boolean
}

export interface WaitlistResponse {
  slots: number
  total: number
  entries: string[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}
