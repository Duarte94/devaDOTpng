import type { ArtworkItem, PriceCategory, PatreonTier, WaitlistResponse, CommissionExtra } from './types'
import _artworks from './artworks.generated.json'

const artworks = _artworks as ArtworkItem[]

function ph(title: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="${bg}"/><text x="400" y="400" text-anchor="middle" dominant-baseline="central" fill="white" font-family="sans-serif" font-size="20" font-weight="bold" opacity="0.6">${title}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const sampleGallery: ArtworkItem[] = [
  { id: 'mg-1', title: 'Aria', image: ph('Aria', '#2a2a3a'), thumb: ph('Aria', '#2a2a3a'), tags: ['portrait', 'oc'] },
  { id: 'mg-2', title: 'Night Sky', image: ph('Night Sky', '#1a1a3a'), thumb: ph('Night Sky', '#1a1a3a'), tags: ['landscape'] },
  { id: 'mg-3', title: 'Dragon Form', image: ph('Dragon Form', '#3a1a1a'), thumb: ph('Dragon Form', '#3a1a1a'), tags: ['fantasy', 'fullbody'] },
  { id: 'mg-4', title: 'Miku Tribute', image: ph('Miku Tribute', '#1a3a3a'), thumb: ph('Miku Tribute', '#1a3a3a'), tags: ['fanart'] },
  { id: 'mg-5', title: 'Commission X', image: ph('Commission X', '#2a2a1a'), thumb: ph('Commission X', '#2a2a1a'), tags: ['commission'] },
]

const sampleFanarts: ArtworkItem[] = [
  { id: 'mf-1', title: 'Fanart 1', image: ph('Fanart 1', '#3a2a1a'), thumb: ph('Fanart 1', '#3a2a1a'), tags: ['fanart'], username: 'Artist1' },
  { id: 'mf-2', title: 'Fanart 2', image: ph('Fanart 2', '#1a2a3a'), thumb: ph('Fanart 2', '#1a2a3a'), tags: ['fanart'], username: 'Artist2' },
  { id: 'mf-3', title: 'DTIYS Entry', image: ph('DTIYS Entry', '#2a1a2a'), thumb: ph('DTIYS Entry', '#2a1a2a'), tags: ['dtiys'], username: 'Artist3' },
]

const hasRealData = artworks.length > 0

export const galleryMock: ArtworkItem[] = hasRealData ? artworks.filter((a) => !a.username) : sampleGallery
export const fanartsMock: ArtworkItem[] = hasRealData ? artworks.filter((a) => a.username) : sampleFanarts

export const pricesMock: PriceCategory[] = [
  {
    title: 'Headshot',
    prices: [
      { label: 'Sketch', value: '$5' },
      { label: 'Flat', value: '$10' },
      { label: 'Full', value: '$30' },
    ],
  },
  {
    title: 'Half body',
    prices: [
      { label: 'Sketch', value: '$8' },
      { label: 'Flat', value: '$15' },
      { label: 'Full', value: '$40' },
    ],
  },
  {
    title: 'Full render',
    prices: [
      { label: 'Sketch', value: '$11' },
      { label: 'Flat', value: '$24' },
      { label: 'Full', value: '$50' },
    ],
  },
]

export const patreonTiersMock: PatreonTier[] = [
  {
    name: 'Safe Supporter',
    description:
      'This is the tier for those who want to support me but do not want to see NSFW content.',
    price: '$1',
    highlighted: false,
  },
  {
    name: 'Digital Protector',
    description: '* Access to WIP.\n* Uncensored illustrations.',
    price: '$1',
    highlighted: false,
  },
  {
    name: 'Royal Knight',
    description:
      '* Previous tier content.\n* Next character poll.\n* Special discounts.*\n* 3x chances on raffles.',
    price: '$5',
    highlighted: true,
  },
]

export const waitlistMock: WaitlistResponse = {
  slots: 5,
  total: 5,
  entries: ['Anon1', 'Anon2', 'Anon3', 'Anon4', 'Anon5'],
}

export const commissionExtrasMock: CommissionExtra[] = [
  { label: 'Extra character half/full', percent: 50 },
  { label: 'Headshot', percent: 50 },
  { label: '2 or more headshots', percent: 25 },
]
