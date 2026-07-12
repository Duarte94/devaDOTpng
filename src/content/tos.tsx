import type { ReactNode } from 'react'

export interface TosSection {
  title: string
  content: ReactNode
}

export const tosSections: TosSection[] = [
  {
    title: 'BEFORE ORDERING',
    content: 'Any question that is not resolved or specified in this document please let me know.',
  },
  {
    title: 'ABOUT COMMISSIONS',
    content: (
      <>
        These artwork are created for personal use only. You cannot reproduce them for finnancial gain.<br />
        If you want to use the illustration for a Youtube channel, Twitch, sell it events or something that goes beyond personal use will have an additional fee.<br />
        I usually take 1~3 weeks to finish a commission. If I see that it takes longer, I will let you know.<br />
        If you need the commission for an specific date, we can discuss it and get a rush fee.
      </>
    ),
  },
  {
    title: 'PROCESS',
    content: (
      <>
        Work in progress (sketch) will be delivered ffirst to check if everything is OK to continue with the process.<br />
        Changes can be done in the WIP step. If changes are big, there will be an additional fee.<br />
        Please be specific with your commission description toavoid these inconveniences.<br />
        After the sketch and base color being approved, I will continue with your commission until I finish.
      </>
    ),
  },
  {
    title: 'PAYMENT',
    content: (
      <>
        Payment through PAYPAL.<br />
        Once the commission starts there is no refund, so please stay aware of this.<br />
        There will be FULL REFUND only if for some reason I can not work on your commission anymore.<br />
        A small additional fee applies for the PayPal commission. (Detailed in invoice)<br />
        Payment is upfront. I will add you to waitlist and I will start your commission after payment is done.
      </>
    ),
  },
  {
    title: 'I WILL DRAW',
    content: (
      <>
        OCs<br />
        Fanart<br />
        Furry<br />
        NSFW<br />
        Simple armor
      </>
    ),
  },
  {
    title: 'I WILL NOT DRAW',
    content: (
      <>
        Mecha<br />
        Heavy armor / Weapons<br />
        Pets<br />
        Muscular characters
      </>
    ),
  },
]
