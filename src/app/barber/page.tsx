import { connection } from 'next/server'
import { About } from '@/components/barber/About'
import { FinalCta, Footer, Instagram } from '@/components/barber/Closing'
import { Faq } from '@/components/barber/Faq'
import { Hero } from '@/components/barber/Hero'
import { Hours } from '@/components/barber/Hours'
import { Marquee } from '@/components/barber/Marquee'
import { Nav } from '@/components/barber/Nav'
import { Services } from '@/components/barber/Services'
import { nextFreeSlot } from '@/barber/queries'
import { relativeSlotLabel, shopStatus } from '@/barber/status'
import { dateKeyOf, weekdayOf } from '@/barber/time'

export default async function BarberHome() {
  // live data: open/closed status and the earliest free slot
  await connection()
  const now = new Date()
  const next = await nextFreeSlot(now)
  const nextLabel = next ? relativeSlotLabel(next, now) : null

  return (
    <>
      <Nav />
      <main>
        <Hero status={shopStatus(now)} nextSlot={nextLabel} />
        <Marquee />
        <About />
        <Services />
        <Hours today={weekdayOf(dateKeyOf(now))} />
        <Faq />
        <Instagram />
        <FinalCta nextSlot={nextLabel} />
      </main>
      <Footer />
    </>
  )
}
