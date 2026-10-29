import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import { barber } from '@/barber/config'
import './barber.css'

const serif = Instrument_Serif({
  variable: '--font-barber-serif',
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
})

const sans = Inter_Tight({
  variable: '--font-barber-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: `${barber.name} — Barber | Online időpontfoglalás`,
    template: `%s — ${barber.name} Barber`,
  },
  description: `${barber.tagline} Foglalj időpontot online, pár kattintással.`,
  // concept hosted on the agency domain: keep it out of search results
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0c0b0a',
}

export default function BarberLayout({ children }: { children: React.ReactNode }) {
  return <div className={`barber ${serif.variable} ${sans.variable}`}>{children}</div>
}
