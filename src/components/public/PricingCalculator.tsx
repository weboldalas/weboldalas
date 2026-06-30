'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, ShieldCheck, Banknote, Unlock } from 'lucide-react'

const SURFACE = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
const MIN_MONTHS = 3
const MAX_MONTHS = 24
const MONTH_TICKS = [3, 6, 12, 18, 24]
const INSTALLMENT_SURCHARGE = 0.15 // 15% kezelési díj részletfizetésnél

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
  { id: 'one_time',     label: 'Egyszeri fizetés', accent: '#0ea5e9' },
  { id: 'installments', label: 'Részletfizetés',   accent: '#a855f7' },
  { id: 'subscription', label: 'Előfizetés',        accent: '#10b981' },
] as const

type PlanId = 'one_time' | 'installments' | 'subscription'

export function PricingCalculator({ sidebar }: { sidebar?: React.ReactNode }) {
  const [serviceId, setServiceId] = useState('weboldal')
  const [plan, setPlan] = useState<PlanId>('subscription')
  const [months, setMonths] = useState(12)

  const svc = SERVICES.find(s => s.id === serviceId)!

  const availablePlans = ALL_PLANS.filter(t => {
    if (svc.free || svc.custom) return false
    if (t.id === 'one_time' || t.id === 'installments') return svc.oneTime !== null
    if (t.id === 'subscription') return svc.sub !== null
    return false
  })

  useEffect(() => {
    if (availablePlans.length > 0 && !availablePlans.find(p => p.id === plan)) {
      setPlan(availablePlans[0].id)
    }
  }, [serviceId]) // eslint-disable-line react-hooks/exhaustive-deps

  const base = svc.oneTime ?? 0
  const installmentTotal = Math.round(base * (1 + INSTALLMENT_SURCHARGE))
  const installmentExtra = installmentTotal - base
  const monthly = Math.ceil(installmentTotal / months)
  const pct = ((months - MIN_MONTHS) / (MAX_MONTHS - MIN_MONTHS)) * 100

  return (
    <div className="w-full">

      {/* ── Szolgáltatás választó — teljes szélességen középre ── */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {SERVICES.map(s => (
          <button key={s.id} onClick={() => setServiceId(s.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={serviceId === s.id
              ? { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }
              : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Fizetési mód választó — teljes szélességen középre ── */}
      {!svc.free && !svc.custom && availablePlans.length > 0 && (
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl p-1.5 gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {availablePlans.map(t => (
              <button key={t.id} onClick={() => setPlan(t.id)}
                className="relative px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={plan === t.id
                  ? { background: `${t.accent}20`, color: t.accent, border: `1px solid ${t.accent}40` }
                  : { color: 'rgba(255,255,255,0.4)' }}>
                {t.id === 'subscription' && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: '#10b981', color: '#fff' }}>
                    Ajánlott
                  </span>
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tartalom + sidebar grid ── */}
      <div className={sidebar ? 'grid lg:grid-cols-[1fr_380px] gap-16 items-end' : ''}>

        {/* Bal: ár box */}
        <div>
          {/* Ingyenes kiegészítő */}
          {svc.free && (
            <div className="rounded-3xl p-10 lg:p-14 text-center" style={{ background: 'rgba(16,185,129,0.05)', border: '2px solid rgba(16,185,129,0.25)' }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold mb-6"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ingyenes kiegészítő
              </div>
              <div className="text-6xl font-extrabold text-white mb-3">0 Ft</div>
              <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Minden csomaghoz díjmentesen jár.</p>
              <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Nem kell külön szoftvert előfizetni — mi integráljuk a weboldaladba.
              </p>
              <Link href="/kapcsolat"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                Ajánlatot kérek <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Egyéni ajánlat */}
          {svc.custom && (
            <div className="rounded-3xl p-10 lg:p-14 text-center" style={{ background: 'rgba(244,63,94,0.05)', border: '2px solid rgba(244,63,94,0.25)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#f43f5e' }}>Egyéni ajánlat</div>
              <div className="text-5xl font-extrabold text-white mb-4">Személyre szabva</div>
              <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
                A CRM rendszert az igényeidre szabjuk. Ingyenes konzultáción megnézzük mi kell.
              </p>
              <Link href="/kapcsolat"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}>
                Ingyenes demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* One time */}
          {!svc.free && !svc.custom && plan === 'one_time' && svc.oneTime && (
            <div className="rounded-3xl p-8 lg:p-12" style={{ background: 'rgba(14,165,233,0.05)', border: '2px solid rgba(14,165,233,0.25)' }}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-4 text-cyan-400">Egyszeri fizetés</div>
                  <div className="mb-4">
                    <span className="text-5xl font-extrabold text-white">{svc.oneTime.toLocaleString('hu-HU')}</span>
                    <span className="text-xl ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Ft-tól</span>
                  </div>
                  <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    A weboldal teljesen az Ön tulajdona. Fizeti egyszer, és minden jog önt illeti.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Teljes tulajdonjog', 'Egyszeri befektetés', 'Prémium dizájn', 'Mobilbarát', 'SEO alapok', 'Átadás után önállóan kezeled'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        <Check className="h-4 w-4 text-cyan-400 shrink-0" strokeWidth={2.5} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/kapcsolat"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                    Ajánlatot kérek <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl p-7" style={SURFACE}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>Miért jó ez?</p>
                  {[
                    { icon: ShieldCheck, title: 'Teljes tulajdon',      desc: 'Kifizetés után minden jog önt illeti.' },
                    { icon: Banknote,    title: 'Egyszeri befektetés',  desc: 'Nem terheli havi díj, nincsenek rejtett költségek.' },
                    { icon: Unlock,      title: 'Függetlenség',         desc: 'Bármikor elviheti máshova a weboldalát.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 mb-5 last:mb-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)' }}>
                        <item.icon className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{item.title}</div>
                        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Installments */}
          {!svc.free && !svc.custom && plan === 'installments' && svc.oneTime && (
            <div className="rounded-3xl p-8 lg:p-12" style={{ background: 'rgba(168,85,247,0.05)', border: '2px solid rgba(168,85,247,0.25)' }}>
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-4 text-violet-400">Részletfizetés</div>
                  <div className="mb-2">
                    <span className="text-5xl font-extrabold text-white">{monthly.toLocaleString('hu-HU')}</span>
                    <span className="text-xl ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Ft / hó</span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Összesen: {installmentTotal.toLocaleString('hu-HU')} Ft · {months} hónap
                  </p>
                  <p className="text-xs mb-6 font-medium" style={{ color: 'rgba(251,146,60,0.8)' }}>
                    +{installmentExtra.toLocaleString('hu-HU')} Ft az egyszeri fizetéshez képest (15% kezelési díj)
                  </p>
                  <div className="mb-8">
                    <div className="flex justify-between text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <span>Futamidő</span>
                      <span className="font-bold text-violet-400">{months} hónap</span>
                    </div>
                    <input type="range" min={MIN_MONTHS} max={MAX_MONTHS} step={1}
                      value={months} onChange={e => setMonths(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #7c3aed ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}
                    />
                    <div className="flex justify-between mt-2">
                      {MONTH_TICKS.map(m => (
                        <button key={m} onClick={() => setMonths(m)}
                          className="text-xs font-medium transition-colors"
                          style={{ color: months === m ? '#a855f7' : 'rgba(255,255,255,0.3)' }}>
                          {m} hó
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm italic mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    "A teljes összeg kifizetése után a weboldal az Ön tulajdona."
                  </p>
                  <Link href="/kapcsolat"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    Ajánlatot kérek <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl p-6" style={SURFACE}>
                  <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Havi részlet:</span>
                      <span className="font-bold text-violet-400">{monthly.toLocaleString('hu-HU')} Ft</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Futamidő:</span>
                      <span className="font-bold text-white">{months} hónap</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Végösszeg:</span>
                      <span className="font-bold" style={{ color: 'rgba(251,146,60,0.9)' }}>{installmentTotal.toLocaleString('hu-HU')} Ft</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <span>Egyszeri fizetéssel:</span>
                      <span>{base.toLocaleString('hu-HU')} Ft</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {['Prémium dizájn', 'Mobilbarát', 'Foglalási rendszer opció', 'SEO alapok', 'Kifizetés után teljes tulajdon'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" strokeWidth={2.5} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Subscription */}
          {!svc.free && !svc.custom && plan === 'subscription' && svc.sub && (
            <div className="rounded-3xl p-8 lg:p-12 relative overflow-hidden"
              style={{ background: 'rgba(16,185,129,0.07)', border: '2px solid rgba(16,185,129,0.4)', boxShadow: '0 0 40px rgba(16,185,129,0.1)' }}>
              {/* "Legjobb értékarány" szalag */}
              <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Legjobb értékarány
              </div>
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold mb-4"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Minden benne van
                  </div>
                  <div className="mb-2">
                    <span className="text-5xl font-extrabold text-white">{svc.sub.toLocaleString('hu-HU')}</span>
                    <span className="text-xl ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Ft / hó-tól</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Minimum 12 hónap · Nincs rejtett költség</p>
                  <p className="text-xs mb-6 font-medium" style={{ color: 'rgba(52,211,153,0.7)' }}>
                    Weboldal + tárhely + üzemeltetés + support — egyetlen havidíjban
                  </p>
                  <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Minden hónapban fizet egy fix összeget, és mi gondoskodunk mindenről. Nincs meglepetés, nincs technikai stressz.
                  </p>
                  <Link href="/kapcsolat"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                    Ajánlatot kérek <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl p-6" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(52,211,153,0.6)' }}>Tartalmazza</p>
                  <ul className="space-y-3">
                    {subFeatures.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={2.5} /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 p-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: 'rgba(52,211,153,0.9)' }}>
                    Koncentráljon a vállalkozására — mi a technikát intézzük.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Jobb: sidebar (FAQ) */}
        {sidebar && <div>{sidebar}</div>}
      </div>
    </div>
  )
}
