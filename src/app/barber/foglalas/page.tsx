import type { Metadata } from 'next'
import { BookingWizard } from '@/components/barber/BookingWizard'
import { Nav } from '@/components/barber/Nav'

export const metadata: Metadata = { title: 'Időpontfoglalás' }

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ szolgaltatas?: string }> }) {
  const { szolgaltatas } = await searchParams
  return (
    <>
      <Nav showCta={false} />
      <main className="wrap min-h-[100svh] pt-32 pb-24 sm:pt-40">
        <BookingWizard initialServiceId={szolgaltatas} />
      </main>
    </>
  )
}
