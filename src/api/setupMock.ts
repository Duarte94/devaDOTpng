import MockAdapter from 'axios-mock-adapter'
import { client } from './client'
import {
  galleryMock,
  fanartsMock,
  pricesMock,
  patreonTiersMock,
  waitlistMock,
  commissionExtrasMock,
} from './mockData'
import type { Paginated, ArtworkItem } from './types'

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
  const mock = new MockAdapter(client, { delayResponse: 400 })

  mock.onGet('/gallery').reply((config) => {
    const page = Number(config.params?.page) || 1
    const perPage = Number(config.params?.perPage) || galleryMock.length
    const tagFilter: string[] = config.params?.tags
      ? String(config.params.tags).split(',').filter(Boolean)
      : []

    let filtered: ArtworkItem[] = galleryMock
    if (tagFilter.length > 0) {
      filtered = galleryMock.filter(
        (art) => art.tags?.some((t) => tagFilter.includes(t)),
      )
    }

    const total = filtered.length
    const start = (page - 1) * perPage
    const items = filtered.slice(start, start + perPage)

    const body: Paginated<ArtworkItem> = { items, total, page, perPage }
    return [200, body]
  })

  mock.onGet('/fanarts').reply((config) => {
    const page = Number(config.params?.page) || 1
    const perPage = Number(config.params?.perPage) || fanartsMock.length

    const total = fanartsMock.length
    const start = (page - 1) * perPage
    const items = fanartsMock.slice(start, start + perPage)

    const body: Paginated<ArtworkItem> = { items, total, page, perPage }
    return [200, body]
  })

  mock.onGet('/commissions/prices').reply(200, pricesMock)
  mock.onGet('/commissions/extras').reply(200, commissionExtrasMock)

  mock.onGet('/patreon/tiers').reply(200, patreonTiersMock)

  mock.onGet('/waitlist').reply(200, waitlistMock)
}
