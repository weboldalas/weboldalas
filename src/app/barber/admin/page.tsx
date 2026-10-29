import type { Metadata } from 'next'
import Link from 'next/link'
import { AdminLogin, AdminNewBooking } from '@/components/barber/AdminForms'
import { adminCancel, adminLogout } from '@/barber/actions'
import { adminPin, isAdmin, isDemoPin } from '@/barber/admin-auth'
import { closedDates, dayNames, formatHuf, openingHours } from '@/barber/config'
import { getStore } from '@/barber/store'
import { addDays, dateKeyOf, hhmmToMinutes, isDateKey, minutesOf, minutesToHhmm, weekdayOf, zonedToUtc } from '@/barber/time'

export const metadata: Metadata = { title: 'Admin' }

function shortDay(key: string) {
  const [, m, d] = key.split('-').map(Number)
  return `${m}.${String(d).padStart(2, '0')}.`
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ nap?: string }> }) {
  if (!adminPin()) {
    return (
      <Shell>
        <p className="mx-auto max-w-md text-center text-[var(--bone-dim)]">
          Az admin felület ki van kapcsolva. Állítsd be a <code className="text-[var(--bone)]">BARBER_ADMIN_PIN</code> környezeti változót.
        </p>
      </Shell>
    )
  }
  if (!(await isAdmin())) {
    return (
      <Shell>
        <AdminLogin demoPin={isDemoPin()} />
      </Shell>
    )
  }

  const { nap } = await searchParams
  const today = dateKeyOf(new Date())
  const day = nap && isDateKey(nap) ? nap : today
  const store = getStore()

  // selected day + the 7-day strip in one query
  const stripStart = addDays(day, -3)
  const all = await store.listForAdmin(zonedToUtc(stripStart, 0), zonedToUtc(addDays(stripStart, 7), 0))
  const ofDay = all.filter((b) => dateKeyOf(new Date(b.startsAt)) === day)
  const active = ofDay.filter((b) => b.status === 'confirmed')

  const hours = closedDates.includes(day) ? null : openingHours[weekdayOf(day)]
  const firstBooking = active.length ? Math.min(...active.map((b) => minutesOf(new Date(b.startsAt)))) : Infinity
  const lastBooking = active.length ? Math.max(...active.map((b) => minutesOf(new Date(b.startsAt)) + b.durationMin)) : -Infinity
  const rangeStart = Math.floor(Math.min(hours ? hhmmToMinutes(hours.open) : 9 * 60, firstBooking) / 60) * 60
  const rangeEnd = Math.ceil(Math.max(hours ? hhmmToMinutes(hours.close) : 19 * 60, lastBooking) / 60) * 60
  const span = rangeEnd - rangeStart
  const openMinutes = hours ? hhmmToMinutes(hours.close) - hhmmToMinutes(hours.open) - (hours.breaks ?? []).reduce((t, b) => t + hhmmToMinutes(b.to) - hhmmToMinutes(b.from), 0) : 0
  const bookedMinutes = active.reduce((t, b) => t + b.durationMin, 0)
  const revenue = active.reduce((t, b) => t + b.priceHuf, 0)
  const nowMin = day === today ? minutesOf(new Date()) : null

  return (
    <Shell>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow eyebrow-brass mb-4">Admin · {store.kind === 'memory' ? 'Demó adatok' : 'Élő adatbázis'}</p>
          <h1 className="text-[clamp(44px,6vw,84px)] font-extralight leading-none tracking-[-0.05em]">
            {dayNames[weekdayOf(day)]} <span className="serif italic">{shortDay(day)}</span>
          </h1>
        </div>
        <form action={adminLogout}>
          <button className="eyebrow hover:!text-[var(--bone)]">Kilépés</button>
        </form>
      </div>

      {/* week strip */}
      <nav className="no-scrollbar mt-10 flex items-center gap-2 overflow-x-auto">
        <Link href={`?nap=${addDays(day, -7)}`} className="chip grid h-[84px] w-11 shrink-0 place-items-center" aria-label="Előző hét">←</Link>
        {Array.from({ length: 7 }, (_, i) => {
          const key = addDays(stripStart, i)
          const count = all.filter((b) => b.status === 'confirmed' && dateKeyOf(new Date(b.startsAt)) === key).length
          return (
            <Link key={key} href={`?nap=${key}`} aria-pressed={key === day} className="chip flex h-[84px] min-w-[84px] shrink-0 flex-col items-center justify-center gap-1 px-3">
              <span className="text-[11px] uppercase tracking-[0.15em] opacity-70">{key === today ? 'Ma' : dayNames[weekdayOf(key)].slice(0, 3)}</span>
              <span className="serif text-[24px] leading-none">{shortDay(key)}</span>
              <span className="text-[11px] opacity-60">{count} foglalás</span>
            </Link>
          )
        })}
        <Link href={`?nap=${addDays(day, 7)}`} className="chip grid h-[84px] w-11 shrink-0 place-items-center" aria-label="Következő hét">→</Link>
        {day !== today && (
          <Link href="?" className="eyebrow ml-3 shrink-0 hover:!text-[var(--bone)]">Ma</Link>
        )}
      </nav>

      {/* stats */}
      <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--line)]">
        {[
          ['Foglalás', String(active.length)],
          ['Várható bevétel', formatHuf(revenue)],
          ['Kihasználtság', openMinutes ? `${Math.min(100, Math.round((bookedMinutes / openMinutes) * 100))}%` : hours ? '—' : 'Zárva'],
        ].map(([k, v]) => (
          <div key={k} className="bg-[var(--ink)] p-5 sm:p-7">
            <dt className="eyebrow">{k}</dt>
            <dd className="serif mt-3 text-[clamp(24px,3vw,40px)] leading-none">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* timeline */}
        <section className="lg:col-span-7">
          <p className="eyebrow mb-6">Idővonal {hours ? `· ${hours.open}–${hours.close}` : '· Zárva'}</p>
          <div className="relative" style={{ height: `${(span / 60) * 88}px` }}>
            {Array.from({ length: span / 60 + 1 }, (_, i) => (
              <div key={i} className="absolute inset-x-0 flex items-start gap-4" style={{ top: `${((i * 60) / span) * 100}%` }}>
                <span className="w-12 -translate-y-1/2 text-[12px] tabular-nums text-[var(--muted)]">{minutesToHhmm(rangeStart + i * 60)}</span>
                <span className="h-px flex-1 bg-[var(--line)]" />
              </div>
            ))}
            {(hours?.breaks ?? []).map((b) => (
              <div
                key={b.from}
                className="absolute right-0 left-16 rounded-xl border border-dashed border-[var(--line-strong)]"
                style={{ top: `${((hhmmToMinutes(b.from) - rangeStart) / span) * 100}%`, height: `${((hhmmToMinutes(b.to) - hhmmToMinutes(b.from)) / span) * 100}%` }}
              >
                <span className="eyebrow px-3">Szünet</span>
              </div>
            ))}
            {active.map((b) => {
              const start = minutesOf(new Date(b.startsAt))
              return (
                <div
                  key={b.id}
                  className="absolute right-0 left-16 overflow-hidden rounded-xl bg-[var(--bone)] px-4 py-2 text-[var(--ink)]"
                  style={{ top: `${((start - rangeStart) / span) * 100}%`, height: `calc(${(b.durationMin / span) * 100}% - 3px)` }}
                >
                  <p className="truncate text-[14px] font-medium">
                    {minutesToHhmm(start)} · {b.customerName}
                  </p>
                  <p className="truncate text-[12px] opacity-60">{b.serviceName}{b.source === 'admin' ? ' · kézi' : ''}</p>
                </div>
              )
            })}
            {nowMin !== null && nowMin >= rangeStart && nowMin <= rangeEnd && (
              <div className="absolute right-0 left-12 z-10 flex items-center" style={{ top: `${((nowMin - rangeStart) / span) * 100}%` }}>
                <span className="h-2 w-2 -translate-x-1 rounded-full bg-[var(--brass)]" />
                <span className="h-px flex-1 bg-[var(--brass)]" />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-14 lg:col-span-5">
          <div>
            <p className="eyebrow mb-6">Foglalások</p>
            {ofDay.length === 0 && <p className="text-[var(--muted)]">Erre a napra nincs foglalás.</p>}
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {ofDay.map((b) => (
                <li key={b.id} className={`flex items-start justify-between gap-4 py-5 ${b.status === 'cancelled' ? 'opacity-40' : ''}`}>
                  <div className="min-w-0">
                    <p className="text-[17px]">
                      <span className="tabular-nums">{minutesToHhmm(minutesOf(new Date(b.startsAt)))}</span>
                      <span className="ml-3">{b.customerName}</span>
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--muted)]">
                      {b.serviceName} · {formatHuf(b.priceHuf)}
                      {b.status === 'cancelled' && ' · lemondva'}
                    </p>
                    {(b.customerPhone || b.customerEmail) && (
                      <p className="mt-1 truncate text-[13px] text-[var(--bone-dim)]">
                        {b.customerPhone && <a className="link" href={`tel:${b.customerPhone.replace(/\s/g, '')}`}>{b.customerPhone}</a>}
                        {b.customerPhone && b.customerEmail && ' · '}
                        {b.customerEmail}
                      </p>
                    )}
                    {b.note && <p className="mt-2 text-[13px] italic text-[var(--bone-dim)]">„{b.note}”</p>}
                  </div>
                  {b.status === 'confirmed' && (
                    <form action={adminCancel}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className="text-[12px] text-[var(--muted)] underline underline-offset-4 hover:text-[var(--danger)]">Lemond</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-6">Kézi foglalás (telefon, walk-in)</p>
            <AdminNewBooking date={day} />
          </div>
        </section>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="wrap min-h-[100svh] pt-16 pb-24">
      <div className="mb-16 flex items-center justify-between">
        <Link href="/barber" className="serif text-[28px] italic">VÁ</Link>
        <Link href="/barber" className="eyebrow hover:!text-[var(--bone)]">Weboldal ↗</Link>
      </div>
      {children}
    </main>
  )
}
