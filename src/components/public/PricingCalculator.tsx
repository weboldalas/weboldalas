'use client'

import { useState } from 'react'
import Link from 'next/link'

const MIN_MONTHS = 3
const MAX_MONTHS = 24
const MONTH_TICKS = [3, 6, 12, 18, 24]
const MONTHLY_INSTALLMENT_RATE = 0.01 // 1% / hó kezelési díj — minél hosszabb a futamidő, annál drágább

// ── ÁR SZERKESZTÉSE ITT ───────────────────────────────────────────────────────
type Service = {
  id: string
  label: string
  oneTime: number | null
  sub: number | null
  free?: true
  custom?: true
}

const SERVICES: Service[] = [
  { id: 'weboldal',    label: 'Bemutatkozó weboldal', oneTime: 250000, sub: 19990 },
  { id: 'webshop',     label: 'Webshop',              oneTime: 450000, sub: 29990 },
  { id: 'landing',     label: 'Landing Page',         oneTime: 80000,  sub: null  },
  { id: 'foglalas',    label: 'Foglalási rendszer',   oneTime: null,   sub: null,  free: true  },
  { id: 'crm',         label: 'CRM rendszer',         oneTime: null,   sub: null,  custom: true },
  { id: 'uzemeltetes', label: 'Üzemeltetés',          oneTime: null,   sub: 19990 },
]
// ─────────────────────────────────────────────────────────────────────────────

const subFeatures = [
  'Tárhely és SSL', 'Technikai karbantartás', 'Tartalomfrissítés (1 óra/hó)',
  'Hibajavítás', 'Szoftverfrissítések', 'Foglalási rendszer',
  'Magyar ügyfélszolgálat', 'Havi státuszjelentés',
]

const ALL_PLANS = [
  { id: 'one_time', label: 'Egyszeri' },
  { id: 'installments', label: 'Részlet' },
  { id: 'subscription', label: 'Havidíj' },
] as const

type PlanId = (typeof ALL_PLANS)[number]['id']

const ft = (n: number) => n.toLocaleString('hu-HU')

function Bullet() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0">
      <polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1.3" />
    </svg>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full px-5 text-sm transition-colors ${active ? 'bg-white text-black' : 'text-ash-gray hover:text-white'}`}
    >
      {children}
    </button>
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

  const base = svc.oneTime ?? 0
  const installmentTotal = Math.round(base * (1 + months * MONTHLY_INSTALLMENT_RATE))
  const installmentExtra = installmentTotal - base
  const monthly = Math.ceil(installmentTotal / months)
  const pct = ((months - MIN_MONTHS) / (MAX_MONTHS - MIN_MONTHS)) * 100

  return (
    <div>
      {/* service picker */}
      <div className="flex flex-wrap gap-1" role="group" aria-label="Szolgáltatás">
        {SERVICES.map(s => (
          <Pill key={s.id} active={serviceId === s.id} onClick={() => setServiceId(s.id)}>{s.label}</Pill>
        ))}
      </div>

      {/* plan picker */}
      {availablePlans.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1" role="group" aria-label="Fizetési mód">
          {availablePlans.map(t => (
            <Pill key={t.id} active={activePlan === t.id} onClick={() => setPlan(t.id)}>{t.label}</Pill>
          ))}
        </div>
      )}

      <div key={`${serviceId}-${activePlan}`} className="void-fade mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {svc.free && (
          <>
            <div>
              <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Ingyenes kiegészítő</p>
              <p className="mt-4 text-heading-lg leading-none sm:text-display sm:leading-none">0 Ft</p>
              <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">
                Minden csomaghoz díjmentesen jár. Nem kell külön szoftvert előfizetni, a weboldaladba integráljuk.
              </p>
              <Link href="/kapcsolat" className="void-button mt-10">Ajánlatot kérek</Link>
            </div>
          </>
        )}

        {svc.custom && (
          <div>
            <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Egyéni ajánlat</p>
            <p className="mt-4 text-heading sm:text-heading-lg">Személyre szabva.</p>
            <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">
              A CRM rendszert az igényeidre szabjuk. Egy ingyenes konzultáción megnézzük, mire van szükséged.
            </p>
            <Link href="/kapcsolat" className="void-button mt-10">Konzultációt kérek</Link>
          </div>
        )}

        {activePlan === 'one_time' && svc.oneTime && (
          <>
            <div>
              <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Egyszeri fizetés</p>
              <p className="mt-4 text-heading-lg leading-none sm:text-display sm:leading-none">{ft(svc.oneTime)}<span className="ml-3 text-heading-2xs text-ash-gray">Ft-tól</span></p>
              <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">A weboldal teljesen a tiéd. Egyszer fizetsz, és minden jog téged illet.</p>
              <Link href="/kapcsolat" className="void-button mt-10">Ajánlatot kérek</Link>
            </div>
            <ul className="space-y-4 lg:pt-10">
              {['Teljes tulajdonjog', 'Egyszeri befektetés, nincs havidíj', 'Egyedi dizájn', 'Mobilbarát', 'SEO alapok', 'Bármikor máshova viheted'].map(f => (
                <li key={f} className="flex items-center gap-3 text-[15px]"><Bullet /> {f}</li>
              ))}
            </ul>
          </>
        )}

        {activePlan === 'installments' && svc.oneTime && (
          <>
            <div>
              <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Részletfizetés</p>
              <p className="mt-4 text-heading-lg leading-none sm:text-display sm:leading-none">{ft(monthly)}<span className="ml-3 text-heading-2xs text-ash-gray">Ft / hó</span></p>
              <p className="text-body font-extralight mt-6 text-silver-mist">
                Összesen {ft(installmentTotal)} Ft · {months} hónap
                <span className="block text-sm text-ash-gray">+{ft(installmentExtra)} Ft az egyszeri fizetéshez képest ({months}% kezelési díj)</span>
              </p>
              <div className="mt-8 max-w-md">
                <div className="flex justify-between text-caption text-ash-gray">
                  <span>Futamidő</span>
                  <span className="text-white">{months} hónap</span>
                </div>
                <input
                  type="range" min={MIN_MONTHS} max={MAX_MONTHS} step={1} value={months}
                  onChange={e => setMonths(Number(e.target.value))}
                  aria-label="Futamidő hónapokban"
                  className="void-range mt-3 w-full"
                  style={{ background: `linear-gradient(to right, var(--color-electric-iris) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
                />
                <div className="mt-2 flex justify-between">
                  {MONTH_TICKS.map(m => (
                    <button key={m} type="button" onClick={() => setMonths(m)} className={`min-h-9 text-caption transition-colors ${months === m ? 'text-white' : 'text-ash-gray hover:text-white'}`}>
                      {m} hó
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/kapcsolat" className="void-button mt-10">Ajánlatot kérek</Link>
            </div>
            <div className="lg:pt-10">
              <dl className="space-y-3 text-[15px]">
                <div className="flex justify-between gap-6"><dt className="text-ash-gray">Havi részlet</dt><dd>{ft(monthly)} Ft</dd></div>
                <div className="flex justify-between gap-6"><dt className="text-ash-gray">Futamidő</dt><dd>{months} hónap</dd></div>
                <div className="flex justify-between gap-6"><dt className="text-ash-gray">Végösszeg</dt><dd className="text-saffron-spark">{ft(installmentTotal)} Ft</dd></div>
                <div className="flex justify-between gap-6 text-sm"><dt className="text-ash-gray">Egyszeri fizetéssel</dt><dd className="text-ash-gray">{ft(base)} Ft</dd></div>
              </dl>
              <ul className="mt-10 space-y-4">
                {['Egyedi dizájn', 'Mobilbarát', 'Foglalási rendszer opció', 'SEO alapok', 'Kifizetés után a tiéd'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[15px]"><Bullet /> {f}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activePlan === 'subscription' && svc.sub && (
          <>
            <div>
              <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Havidíj · minden benne van</p>
              <p className="mt-4 text-heading-lg leading-none sm:text-display sm:leading-none">{ft(svc.sub)}<span className="ml-3 text-heading-2xs text-ash-gray">Ft / hó-tól</span></p>
              <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">
                Weboldal, tárhely, üzemeltetés és support egy havidíjban. Minimum 12 hónap, nincs rejtett költség.
              </p>
              <Link href="/kapcsolat" className="void-button mt-10">Ajánlatot kérek</Link>
            </div>
            <ul className="space-y-4 lg:pt-10">
              {subFeatures.map(f => (
                <li key={f} className="flex items-center gap-3 text-[15px]"><Bullet /> {f}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
