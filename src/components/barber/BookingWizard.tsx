'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DayAvailability, Slot } from '@/barber/availability'
import { createBooking } from '@/barber/actions'
import { bookingRules, formatHuf, services, type Service } from '@/barber/config'

type Step = 'service' | 'time' | 'details' | 'done'

const steps: { key: Exclude<Step, 'done'>; label: string }[] = [
  { key: 'service', label: 'Szolgáltatás' },
  { key: 'time', label: 'Időpont' },
  { key: 'details', label: 'Adatok' },
]

const weekdayShort = ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo']
const monthNames = ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.']

function dayParts(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return { day: d, month: monthNames[m - 1], weekday: weekdayShort[weekday] }
}

function longDayLabel(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('hu-HU', { month: 'long', day: 'numeric', weekday: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d))
  )
}

const ease = [0.22, 1, 0.36, 1] as const
const panel = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease } },
}

export function BookingWizard({ initialServiceId }: { initialServiceId?: string }) {
  const initial = services.find((s) => s.id === initialServiceId) ?? null
  const [step, setStep] = useState<Step>(initial ? 'time' : 'service')
  const [service, setService] = useState<Service | null>(initial)
  const [days, setDays] = useState<DayAvailability[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '', website: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const loadDays = useCallback(async (s: Service, keepDate?: string | null) => {
    setDays(null)
    setLoadError(false)
    try {
      const res = await fetch(`/barber/api/availability?service=${s.id}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const data: { days: DayAvailability[] } = await res.json()
      setDays(data.days)
      const stillOpen = keepDate && data.days.find((d) => d.date === keepDate && d.open)
      setDate(stillOpen ? keepDate : (data.days.find((d) => d.open)?.date ?? null))
    } catch {
      setLoadError(true)
    }
  }, [])

  useEffect(() => {
    // fetch availability whenever the chosen service changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (service) void loadDays(service)
  }, [service, loadDays])

  const selectedDay = useMemo(() => days?.find((d) => d.date === date) ?? null, [days, date])
  const groups = useMemo(() => {
    const slots = selectedDay?.slots ?? []
    return [
      { label: 'Délelőtt', slots: slots.filter((s) => s.time < '12:00') },
      { label: 'Délután', slots: slots.filter((s) => s.time >= '12:00' && s.time < '17:00') },
      { label: 'Este', slots: slots.filter((s) => s.time >= '17:00') },
    ].filter((g) => g.slots.length)
  }, [selectedDay])

  function chooseService(s: Service) {
    if (s.id !== service?.id) {
      setService(s)
      setSlot(null)
    }
    setStep('time')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!service || !slot) return
    setFormError(null)
    startTransition(async () => {
      const result = await createBooking({ serviceId: service.id, startsAt: slot.startsAt, ...form })
      if (result.ok) {
        setToken(result.token)
        setStep('done')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      setErrors(result.fieldErrors ?? {})
      setFormError(result.error)
      if (result.slotTaken) {
        // someone was faster: refresh the grid and send the customer back to it
        setSlot(null)
        setStep('time')
        void loadDays(service, date)
      }
    })
  }

  const stepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* ---------- left: title + summary ---------- */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow eyebrow-brass mb-6">Online időpontfoglalás</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-extralight leading-[0.92] tracking-[-0.05em]">
            {step === 'done' ? (
              <>
                Lefoglalva<span className="serif italic text-[var(--brass)]">.</span>
              </>
            ) : (
              <>
                Foglalj <span className="serif italic tracking-[-0.02em]">széket.</span>
              </>
            )}
          </h1>

          {step !== 'done' && (
            <ol className="mt-10 flex gap-2">
              {steps.map((s, i) => (
                <li key={s.key} className="flex-1">
                  <div className="h-px w-full bg-[var(--line)]">
                    <motion.div
                      className="h-px bg-[var(--bone)]"
                      initial={false}
                      animate={{ width: i <= stepIndex ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </div>
                  <p className={`eyebrow mt-3 ${i === stepIndex ? '!text-[var(--bone)]' : ''}`}>
                    {String(i + 1).padStart(2, '0')} {s.label}
                  </p>
                </li>
              ))}
            </ol>
          )}

          <dl className="mt-10 space-y-4 border-t border-[var(--line)] pt-6 text-[15px]">
            <SummaryRow label="Szolgáltatás" value={service?.name} onEdit={step !== 'done' && service ? () => setStep('service') : undefined} />
            <SummaryRow
              label="Időpont"
              value={slot && date ? `${longDayLabel(date)}, ${slot.time}` : undefined}
              onEdit={step === 'details' ? () => setStep('time') : undefined}
            />
            <SummaryRow label="Időtartam" value={service ? `${service.durationMin} perc` : undefined} />
            <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-4">
              <dt className="text-[var(--muted)]">Fizetendő a helyszínen</dt>
              <dd className="serif text-[28px] italic">{service ? formatHuf(service.priceHuf) : '—'}</dd>
            </div>
          </dl>
        </div>
      </aside>

      {/* ---------- right: steps ---------- */}
      <div className="lg:col-span-7 lg:col-start-6">
        <AnimatePresence mode="wait">
          {step === 'service' && (
            <motion.div key="service" {...panel}>
              <StepTitle n="01" title="Mit csináljunk?" />
              <ul className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => chooseService(s)}
                      aria-pressed={service?.id === s.id}
                      className="chip group flex h-full w-full flex-col items-start p-6 text-left"
                    >
                      <span className="flex w-full items-baseline justify-between gap-4">
                        <span className="serif text-[30px] leading-none">{s.name}</span>
                        <span className="text-[15px] tabular-nums">{formatHuf(s.priceHuf)}</span>
                      </span>
                      <span className="mt-3 text-[14px] leading-relaxed opacity-60">{s.description}</span>
                      <span className="eyebrow mt-5 !text-current opacity-60">{s.durationMin} perc</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {step === 'time' && service && (
            <motion.div key="time" {...panel}>
              <StepTitle n="02" title="Mikor jó neked?" />
              {formError && <Notice>{formError}</Notice>}

              {loadError ? (
                <Notice>
                  Nem sikerült betölteni a szabad időpontokat.{' '}
                  <button className="link" onClick={() => loadDays(service, date)}>
                    Újrapróbálom
                  </button>
                </Notice>
              ) : !days ? (
                <DaysSkeleton />
              ) : (
                <>
                  <div className="no-scrollbar -mx-[clamp(20px,4vw,48px)] flex snap-x gap-2 overflow-x-auto px-[clamp(20px,4vw,48px)] pb-2 lg:mx-0 lg:px-0">
                    {days.map((d) => {
                      const p = dayParts(d.date)
                      return (
                        <button
                          key={d.date}
                          type="button"
                          disabled={!d.open}
                          aria-pressed={d.date === date}
                          aria-label={`${longDayLabel(d.date)}${d.open ? `, ${d.slots.length} szabad időpont` : ', nincs szabad időpont'}`}
                          onClick={() => {
                            setDate(d.date)
                            setSlot(null)
                          }}
                          className="chip flex w-[72px] shrink-0 snap-start flex-col items-center py-4"
                        >
                          <span className="text-[11px] font-medium uppercase tracking-[0.15em] opacity-70">{p.weekday}</span>
                          <span className="serif mt-1 text-[32px] leading-none">{p.day}</span>
                          <span className="mt-1 text-[11px] opacity-60">{p.month}</span>
                          <span className={`mt-2 h-1 w-1 rounded-full ${d.open ? 'bg-[var(--brass)]' : 'bg-transparent'}`} />
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-10 min-h-[220px]">
                    {selectedDay ? (
                      <AnimatePresence mode="wait">
                        <motion.div key={selectedDay.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                          <p className="mb-6 text-[15px] text-[var(--bone-dim)]">
                            <span className="serif text-[22px] italic text-[var(--bone)]">{longDayLabel(selectedDay.date)}</span>
                            <span className="ml-3">{selectedDay.slots.length} szabad időpont</span>
                          </p>
                          {groups.map((g) => (
                            <div key={g.label} className="mb-7">
                              <p className="eyebrow mb-3">{g.label}</p>
                              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {g.slots.map((s, i) => (
                                  <motion.button
                                    key={s.startsAt}
                                    type="button"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02, duration: 0.4, ease }}
                                    aria-pressed={slot?.startsAt === s.startsAt}
                                    onClick={() => setSlot(s)}
                                    className="chip h-12 text-[15px] tabular-nums"
                                  >
                                    {s.time}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <Notice>A következő 30 napban nincs szabad időpont erre a szolgáltatásra. Hívj fel, és megoldjuk.</Notice>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
                    <button type="button" className="eyebrow hover:!text-[var(--bone)]" onClick={() => setStep('service')}>
                      ← Szolgáltatás
                    </button>
                    <button
                      type="button"
                      className="btn btn-solid"
                      disabled={!slot}
                      onClick={() => {
                        setFormError(null)
                        setStep('details')
                      }}
                    >
                      Tovább <span className="arrow">→</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'details' && service && slot && (
            <motion.form key="details" {...panel} onSubmit={submit} noValidate>
              <StepTitle n="03" title="Kinek foglalunk?" />
              {formError && <Notice>{formError}</Notice>}
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Név" name="name" autoComplete="name" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} className="sm:col-span-2" />
                <Field label="E-mail" name="email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Telefon" name="phone" type="tel" autoComplete="tel" placeholder="+36 30 123 4567" value={form.phone} error={errors.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Field label="Megjegyzés (nem kötelező)" name="note" value={form.note} error={errors.note} onChange={(v) => setForm({ ...form, note: v })} placeholder="Pl. hozok referenciaképet" className="sm:col-span-2" />
                {/* honeypot: hidden from people, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />
              </div>
              <p className="mt-8 text-[13px] leading-relaxed text-[var(--muted)]">
                A visszaigazolást e-mailben küldöm. Az időpont előtt {bookingRules.cancelUntilHours} óráig online lemondhatod. Az adataidat csak a foglaláshoz használom.
              </p>
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
                <button type="button" className="eyebrow hover:!text-[var(--bone)]" onClick={() => setStep('time')}>
                  ← Időpont
                </button>
                <button type="submit" className="btn btn-solid" disabled={pending}>
                  {pending ? 'Foglalás…' : 'Foglalás véglegesítése'} {!pending && <span className="arrow">→</span>}
                </button>
              </div>
            </motion.form>
          )}

          {step === 'done' && service && slot && date && token && (
            <motion.div key="done" {...panel}>
              <SuccessMark />
              <p className="mt-10 text-[clamp(26px,3vw,40px)] font-light leading-[1.2] tracking-[-0.02em]">
                Várlak <span className="serif italic">{longDayLabel(date)}</span>, <span className="serif italic">{slot.time}</span>-kor.
              </p>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--bone-dim)]">
                A visszaigazolást elküldtem ide: <span className="text-[var(--bone)]">{form.email}</span>. Benne van a link, amivel módosíthatod vagy lemondhatod a foglalást.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={`/barber/foglalas/${token}/naptar`} className="btn btn-solid">
                  Naptárba teszem <span className="arrow">↓</span>
                </a>
                <Link href={`/barber/foglalas/${token}`} className="btn btn-ghost">
                  Foglalás kezelése
                </Link>
              </div>
              <Link href="/barber" className="eyebrow mt-12 inline-block hover:!text-[var(--bone)]">
                ← Vissza a főoldalra
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StepTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-5">
      <span className="eyebrow eyebrow-brass">{n}</span>
      <h2 className="serif text-[clamp(36px,4vw,56px)] italic leading-none">{title}</h2>
    </div>
  )
}

function SummaryRow({ label, value, onEdit }: { label: string; value?: string; onEdit?: () => void }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="text-right">
        {value ?? <span className="text-[var(--muted)]">—</span>}
        {onEdit && (
          <button type="button" onClick={onEdit} className="ml-3 text-[12px] text-[var(--muted)] underline underline-offset-4 hover:text-[var(--bone)]">
            módosít
          </button>
        )}
      </dd>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  placeholder,
  className = '',
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  autoComplete?: string
  placeholder?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="field"
      />
      {error && <span className="mt-2 block text-[13px] text-[var(--danger)]">{error}</span>}
    </label>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mb-8 rounded-2xl border border-[var(--line-strong)] bg-[var(--ink-2)] px-5 py-4 text-[15px] text-[var(--bone-dim)]">{children}</div>
}

function DaysSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-[118px] w-[72px] shrink-0 animate-pulse rounded-[18px] bg-[var(--ink-3)]" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  )
}

function SuccessMark() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden>
      <motion.circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease }}
      />
      <motion.path
        d="M38 62 L54 77 L84 45"
        fill="none"
        stroke="var(--bone)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease }}
      />
    </svg>
  )
}
