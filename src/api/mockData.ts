import type { ArtworkItem, PriceCategory, PatreonTier, WaitlistResponse, CommissionExtra } from './types'
import _artworks from './artworks.generated.json'

const artworks = _artworks as ArtworkItem[]

export const galleryMock: ArtworkItem[] = artworks.filter((a) => !a.username)
export const fanartsMock: ArtworkItem[] = artworks.filter((a) => a.username)

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
