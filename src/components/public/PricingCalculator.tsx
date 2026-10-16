'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'

const MIN_MONTHS = 3
const MAX_MONTHS = 24
const MONTH_TICKS = [3, 6, 12, 18, 24]
const MONTHLY_INSTALLMENT_RATE = 0.01 // 1% / hó kezelési díj — minél hosszabb a futamidő, annál drágább

// ── ÁR SZERKESZTÉSE ITT ───────────────────────────────────────────────────────
type Service = {
  id: string
  label: string
  desc: string
  oneTime: number | null
  sub: number | null
  free?: true
  custom?: true
}

const SERVICES: Service[] = [
  { id: 'weboldal',    label: 'Bemutatkozó weboldal', desc: 'Egyedi dizájn, mobilbarát, SEO alapokkal.',         oneTime: 250000, sub: 19990 },
  { id: 'webshop',     label: 'Webshop',              desc: 'Online fizetés, rendeléskezelés, készlet.',         oneTime: 450000, sub: 29990 },
  { id: 'landing',     label: 'Landing Page',         desc: 'Egy célra épített oldal kampányokhoz.',             oneTime: 80000,  sub: null  },
  { id: 'foglalas',    label: 'Foglalási rendszer',   desc: 'Online időpontfoglalás a weboldaladba építve.',     oneTime: null,   sub: null,  free: true  },
  { id: 'crm',         label: 'CRM rendszer',         desc: 'Érdeklődők, ajánlatok, ügyfelek egy helyen.',       oneTime: null,   sub: null,  custom: true },
  { id: 'uzemeltetes', label: 'Üzemeltetés',          desc: 'Tárhely, frissítések, karbantartás, support.',      oneTime: null,   sub: 19990 },
]
// ─────────────────────────────────────────────────────────────────────────────

const subFeatures = [
  'Tárhely és SSL', 'Technikai karbantartás', 'Tartalomfrissítés (1 óra/hó)',
  'Hibajavítás', 'Szoftverfrissítések', 'Foglalási rendszer',
  'Magyar ügyfélszolgálat', 'Havi státuszjelentés',
]

const ALL_PLANS = [
  { id: 'one_time', label: 'Egyszeri', hint: 'Teljesen a tiéd' },
  { id: 'installments', label: 'Részlet', hint: '3–24 hónap' },
  { id: 'subscription', label: 'Havidíj', hint: 'Minden benne' },
] as const

type PlanId = (typeof ALL_PLANS)[number]['id']

const ft = (n: number) => n.toLocaleString('hu-HU')

function fromLabel(s: Service) {
  if (s.free) return 'Ingyenes'
  if (s.custom) return 'Egyedi ár'
  if (s.oneTime) return `${ft(s.oneTime)} Ft-tól`
  return `${ft(s.sub!)} Ft/hó`
}

/** Eases a number toward its new value (count-up), so price changes feel alive. */
function useTween(value: number, ms = 650) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = (t: number) => {
      const k = reduce ? 1 : Math.min(1, (t - start) / ms)
      const v = Math.round(a + (value - a) * (1 - Math.pow(1 - k, 3)))
      from.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return shown
}

function Triangle({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className={`h-2.5 w-2.5 shrink-0 ${className}`}>
      <polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1.3" />
    </svg>
  )
}

function Step({ n, title, aside, children }: { n: string; title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-caption text-ash-gray">{n}</span>
        <h3 className="text-heading-2xs">{title}</h3>
        {aside && <span className="ml-auto">{aside}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

/** Animated height reveal (grid-rows trick), no layout jump. */
function Reveal({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} aria-hidden={!open}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export function PricingCalculator() {
  const [serviceId, setServiceId] = useState('weboldal')
  const [plan, setPlan] = useState<PlanId>('subscription')
  const [months, setMonths] = useState(12)

  const svc = SERVICES.find(s => s.id === serviceId)!

  const availablePlans = ALL_PLANS.filter(t => {
    if (svc.free || svc.custom) return false
    if (t.id === 'one_time' || t.id === 'installments') return svc.oneTime !== null
    return svc.sub !== null
  })
  // fall back to the first available plan when the chosen one doesn't apply to this service
  const activePlan: PlanId | undefined = availablePlans.find(p => p.id === plan)?.id ?? availablePlans[0]?.id
  const planIndex = Math.max(0, availablePlans.findIndex(p => p.id === activePlan))

  const base = svc.oneTime ?? 0
  const installmentTotal = Math.round(base * (1 + months * MONTHLY_INSTALLMENT_RATE))
  const installmentExtra = installmentTotal - base
  const monthly = Math.ceil(installmentTotal / months)
  const pct = ((months - MIN_MONTHS) / (MAX_MONTHS - MIN_MONTHS)) * 100

  // ── result for the current choice ──
  type Result = { eyebrow: string; price: number | null; text?: string; unit: string; desc: string; details: [string, string, boolean?][]; features: string[]; summary: string }
  let r: Result
  if (svc.free) {
    r = { eyebrow: 'Ingyenes kiegészítő', price: 0, unit: 'Ft', desc: 'Minden weboldalhoz díjmentesen jár. Nem kell külön szoftvert előfizetni, a weboldaladba integráljuk.', details: [], features: ['Online időpontfoglalás', 'Automatikus visszaigazolás', 'Emlékeztető az ügyfélnek', 'Mobilbarát foglalási felület'], summary: 'Ingyenes' }
  } else if (svc.custom) {
    r = { eyebrow: 'Egyéni ajánlat', price: null, text: 'Egyedi', unit: 'ár', desc: 'A CRM rendszert az igényeidre szabjuk. Egy ingyenes konzultáción megnézzük, mire van szükséged.', details: [], features: ['Értékesítési pipeline', 'Ajánlatkészítés és email', 'Feladatok határidőkkel', 'Ügyféltörténet egy helyen'], summary: 'Egyedi ajánlat' }
  } else if (activePlan === 'one_time') {
    r = { eyebrow: 'Egyszeri fizetés', price: base, unit: 'Ft-tól', desc: 'Egyszer fizetsz, és a weboldal minden joga téged illet.', details: [['Havi díj', 'Nincs']], features: ['Teljes tulajdonjog', 'Nincs havidíj', 'Egyedi dizájn', 'Mobilbarát', 'SEO alapok', 'Bármikor máshova viheted'], summary: `${ft(base)} Ft-tól, egyszeri` }
  } else if (activePlan === 'installments') {
    r = {
      eyebrow: `Részletfizetés · ${months} hónap`, price: monthly, unit: 'Ft / hó', desc: 'Kisebb havi részletekben fizetsz, a végén a weboldal teljesen a tiéd.',
      details: [['Végösszeg', `${ft(installmentTotal)} Ft`, true], ['Egyszeri fizetéssel', `${ft(base)} Ft`], [`Kezelési díj (${months}%)`, `+${ft(installmentExtra)} Ft`]],
      features: ['Egyedi dizájn', 'Mobilbarát', 'Foglalási rendszer opció', 'SEO alapok', 'Kifizetés után a tiéd'], summary: `${ft(monthly)} Ft/hó, ${months} hónap`,
    }
  } else {
    r = {
      eyebrow: 'Havidíj · minden benne van', price: svc.sub!, unit: 'Ft / hó-tól', desc: 'Weboldal, tárhely, üzemeltetés és support egy havidíjban. Minimum 12 hónap, nincs rejtett költség.',
      details: [['Első év összesen', `${ft(svc.sub! * 12)} Ft`], ['Felmondás', '12 hónap után, 30 nap']],
      features: subFeatures, summary: `${ft(svc.sub!)} Ft/hó-tól`,
    }
  }
  const shownPrice = useTween(r.price ?? 0)
  const planLabel = svc.free || svc.custom ? '' : ALL_PLANS.find(p => p.id === activePlan)?.label ?? ''
  const contactHref = `/kapcsolat?szolgaltatas=${encodeURIComponent(svc.label)}&terv=${encodeURIComponent(`${svc.label}${planLabel ? ` · ${planLabel}` : ''} · ${r.summary}`)}#urlap`

  // ── mobile: sticky price bar while the choices are on screen but the result isn't ──
  const rootRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [bar, setBar] = useState(false)
  useEffect(() => {
    const vis = { root: false, result: false }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.target === rootRef.current) vis.root = e.isIntersecting
        if (e.target === resultRef.current) vis.result = e.isIntersecting
      }
      setBar(vis.root && !vis.result)
    }, { rootMargin: '0px 0px -10% 0px' })
    if (rootRef.current) io.observe(rootRef.current)
    if (resultRef.current) io.observe(resultRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
      {/* ── choices ── */}
      <div className="space-y-14">
        <Step n="01" title="Mit építünk?">
          <div role="radiogroup" aria-label="Szolgáltatás" className="-mx-2">
            {SERVICES.map(s => {
              const active = s.id === serviceId
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setServiceId(s.id)}
                  className={`group flex w-full items-start gap-4 rounded-2xl px-2 py-3.5 text-left transition-colors duration-300 ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                >
                  <Triangle className={`mt-2.5 transition-all duration-300 ${active ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'}`} />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[17px] leading-snug transition-colors sm:text-heading-2xs ${active ? 'text-white' : 'text-ash-gray group-hover:text-white'}`}>{s.label}</span>
                    <Reveal open={active}>
                      <span className="block pt-1 text-sm font-extralight text-silver-mist">{s.desc}</span>
                    </Reveal>
                  </span>
                  <span className={`mt-1 shrink-0 text-sm tabular-nums transition-colors ${active ? 'text-saffron-spark' : 'text-ash-gray'}`}>{fromLabel(s)}</span>
                </button>
              )
            })}
          </div>
        </Step>

        <Step n="02" title="Hogyan fizetnél?">
          {availablePlans.length > 0 ? (
            <div
              role="radiogroup"
              aria-label="Fizetési mód"
              className="relative grid rounded-full bg-white/[0.06] p-1"
              style={{ gridTemplateColumns: `repeat(${availablePlans.length}, minmax(0, 1fr))` }}
            >
              <span
                aria-hidden
                className="absolute inset-y-1 left-1 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{ width: `calc((100% - 8px) / ${availablePlans.length})`, transform: `translateX(${planIndex * 100}%)` }}
              />
              {availablePlans.map(t => {
                const active = activePlan === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPlan(t.id)}
                    className={`relative z-10 min-h-14 rounded-full px-2 text-center transition-colors duration-300 ${active ? 'text-black' : 'text-ash-gray hover:text-white'}`}
                  >
                    <span className="block text-[15px] font-medium leading-tight">{t.label}</span>
                    <span className={`block text-[11px] leading-tight ${active ? 'text-black/60' : 'text-ash-gray/80'}`}>{t.hint}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-body font-extralight text-silver-mist">
              {svc.free ? 'Ehhez nem kell fizetési módot választani: díjmentesen jár a weboldal mellé.' : 'Az árat a konzultáció után, az igényeid alapján adjuk meg.'}
            </p>
          )}
        </Step>

        <Reveal open={activePlan === 'installments' && !!svc.oneTime}>
          <Step n="03" title="Futamidő" aside={<span className="text-heading-2xs tabular-nums">{months} <span className="text-ash-gray">hó</span></span>}>
            <input
              type="range" min={MIN_MONTHS} max={MAX_MONTHS} step={1} value={months}
              onChange={e => setMonths(Number(e.target.value))}
              aria-label="Futamidő hónapokban"
              className="void-range w-full"
              style={{ background: `linear-gradient(to right, var(--color-electric-iris) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
            />
            <div className="mt-3 flex justify-between gap-1">
              {MONTH_TICKS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`min-h-10 min-w-11 rounded-full px-2 text-caption tabular-nums transition-colors ${months === m ? 'bg-white text-black' : 'text-ash-gray hover:text-white'}`}
                >
                  {m} hó
                </button>
              ))}
            </div>
          </Step>
        </Reveal>
      </div>

      {/* ── result ── */}
      <div ref={resultRef} id="kalkulator-eredmeny" className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
        <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{r.eyebrow}</p>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[56px] leading-none tracking-[-0.04em] tabular-nums sm:text-display sm:leading-none" aria-live="polite">
            {r.price === null ? r.text : ft(shownPrice)}
          </span>
          <span className="text-heading-2xs text-ash-gray">{r.unit}</span>
        </p>
        <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">{r.desc}</p>

        <div key={`${serviceId}-${activePlan}`} className="void-fade">
          {r.details.length > 0 && (
            <dl className="mt-8 max-w-md space-y-2.5 text-[15px]">
              {r.details.map(([k, v, hi]) => (
                <div key={k} className="flex justify-between gap-6">
                  <dt className="text-ash-gray">{k}</dt>
                  <dd className={`tabular-nums ${hi ? 'text-saffron-spark' : ''}`}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <ul className="mt-10 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {r.features.map(f => (
              <li key={f} className="flex items-center gap-3 text-[15px]"><Triangle /> {f}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href={contactHref} className="void-button">{svc.custom ? 'Konzultációt kérek' : 'Ajánlatot kérek'}</Link>
          <span className="text-sm text-ash-gray">Tájékoztató ár, kötelezettség nélkül.</span>
        </div>
      </div>

      {/* ── mobile sticky price bar ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-black px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] lg:hidden ${bar ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden={!bar}
      >
        <button
          type="button"
          tabIndex={bar ? 0 : -1}
          onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex w-full items-center gap-4 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption text-ash-gray">{svc.label}{planLabel && ` · ${planLabel}`}</span>
            <span className="block text-heading-2xs tabular-nums">
              {r.price === null ? r.text : ft(shownPrice)} <span className="text-sm text-ash-gray">{r.unit}</span>
            </span>
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 text-sm text-white">
            Részletek <ArrowDown className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  )
}
