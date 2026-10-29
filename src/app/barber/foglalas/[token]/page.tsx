import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CancelBooking } from '@/components/barber/CancelBooking'
import { Nav } from '@/components/barber/Nav'
import { barber, bookingRules, formatHuf } from '@/barber/config'
import { bookingState } from '@/barber/status'
import { getStore } from '@/barber/store'
import { formatLongDate, formatTime } from '@/barber/time'

export const metadata: Metadata = { title: 'Foglalásom' }

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const booking = await getStore().getByToken(token)
  if (!booking) notFound()

  const start = new Date(booking.startsAt)
  const { past, cancellable, cancelled } = bookingState(booking, bookingRules.cancelUntilHours)

  return (
    <>
      <Nav showCta={false} />
      <main className="wrap min-h-[100svh] pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow eyebrow-brass mb-6">
            {cancelled ? 'Lemondott foglalás' : past ? 'Korábbi foglalás' : 'Aktív foglalás'}
          </p>
          <h1 className={`text-[clamp(44px,6vw,88px)] font-extralight leading-[0.95] tracking-[-0.05em] ${cancelled ? 'text-[var(--muted)] line-through decoration-1' : ''}`}>
            <span className="serif italic tracking-[-0.02em]">{formatLongDate(start)}</span>
            <br />
            {formatTime(start)}
          </h1>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {[
              ['Szolgáltatás', booking.serviceName],
              ['Időtartam', `${booking.durationMin} perc`],
              ['Ár (helyszínen)', formatHuf(booking.priceHuf)],
              ['Név', booking.customerName],
              ['Helyszín', barber.address],
              ['Telefon', barber.phone],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--ink)] p-6">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 text-[18px]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {!cancelled && !past && (
              <a href={`/barber/foglalas/${token}/naptar`} className="btn btn-ghost">
                Naptárba teszem ↓
              </a>
            )}
            {cancellable && <CancelBooking token={token} />}
            {cancelled && (
              <Link href="/barber/foglalas" className="btn btn-solid">
                Új időpont foglalása <span className="arrow">→</span>
              </Link>
            )}
          </div>

          {!cancelled && !past && !cancellable && (
            <p className="mt-8 text-[14px] text-[var(--muted)]">
              Az időpont előtti {bookingRules.cancelUntilHours} órában online már nem mondható le. Ha közbejött valami, hívj:{' '}
              <a className="link" href={`tel:${barber.phone.replace(/\s/g, '')}`}>
                {barber.phone}
              </a>
            </p>
          )}
        </div>
      </main>
    </>
  )
}
