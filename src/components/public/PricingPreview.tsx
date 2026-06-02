'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const SURFACE = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

const plans = [
  {
    id: 'one_time', label: 'Egyszeri',
    title: 'Egyszeri fizetés',
    desc: 'Fizetsz egyszer — a weboldal teljesen a tiéd.',
    price: '150.000 Ft-tól', priceNote: 'egyszeri díj',
    features: ['Teljes tulajdonjog', 'Prémium dizájn', 'Mobilbarát', 'Foglalási rendszer opció'],
    accent: '#0ea5e9',
  },
  {
    id: 'installments', label: 'Részlet',
    title: 'Részletfizetés',
    desc: 'Ossza el 3–24 hónapra. Kifizetés után tiéd.',
    price: 'Egyéni', priceNote: '3–24 hónap',
    features: ['3–24 hónap futamidő', 'Kamatmentes részletek', 'Kifizetés után tulajdonod', 'Prémium dizájn'],
    accent: '#a855f7',
    highlight: true,
  },
  {
    id: 'subscription', label: 'Előfizetés',
    title: 'Havidíjas',
    desc: 'Minden benne van. Üzemeltetés, karbantartás, support.',
    price: '19.990 Ft/hó-tól', priceNote: 'min. 12 hónap',
    features: ['Tárhely + SSL', 'Karbantartás', '1 óra/hó módosítás', 'Foglalási rendszer'],
    accent: '#10b981',
  },
]

export function PricingPreview() {
  const [active, setActive] = useState('one_time')

  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-2xl p-1.5 gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {plans.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={active === p.id
                ? { background: 'rgba(255,255,255,0.1)', color: '#fff' }
                : { color: 'rgba(255,255,255,0.4)' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} onClick={() => setActive(plan.id)}
            className="relative rounded-2xl p-6 cursor-pointer transition-all"
            style={active === plan.id
              ? { background: `${plan.accent}12`, border: `2px solid ${plan.accent}50`, transform: 'translateY(-4px)' }
              : { ...SURFACE, border: '2px solid transparent' }}>
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                ⭐ Népszerű
              </div>
            )}
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: plan.accent }}>{plan.title}</div>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.desc}</p>
            <div className="mb-4">
              <span className="text-xl font-extrabold text-white">{plan.price}</span>
              <span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{plan.priceNote}</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: plan.accent }} strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/arak" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
          Részletes árak és kalkulátor <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
