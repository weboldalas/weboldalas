import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/public/FadeIn'
import { PricingCalculator } from '@/components/public/PricingCalculator'
import { FaqAccordion } from '@/components/public/FaqAccordion'

export const metadata = {
  title: 'Árak | Weboldalas',
  description: 'Rugalmas fizetési lehetőségek: egyszeri, részletfizetés vagy havidíjas előfizetés.',
}

const faqs = [
  { q: 'Mikor kell fizetni?', a: 'Egyszeri és részletfizetésnél az első részletet az elkészítés előtt kérjük. Havidíjas konstrukciónál minden hónap elején.' },
  { q: 'Van rejtett költség?', a: 'Nincsen. Az ajánlatban szereplő összeg tartalmaz mindent, amit felsoroltunk. Nincs meglepetés.' },
  { q: 'Mi történik ha lemondok az előfizetést?', a: 'Minimum 12 hónapos együttműködést kérünk. Utána bármikor lemondható 30 napos felmondási idővel.' },
  { q: 'Bármikor átválthatok fizetési módot?', a: 'Igen, vedd fel velünk a kapcsolatot és megbeszéljük a lehetőségeket.' },
]

const tableRows = [
  { label: 'Prémium dizájn',      vals: [true,        true,              true] },
  { label: 'Mobilbarát',          vals: [true,        true,              true] },
  { label: 'Foglalási rendszer',  vals: ['Opció',     'Opció',           true] },
  { label: 'Teljes tulajdon',     vals: [true,        'Kifizetés után',  false] },
  { label: 'Üzemeltetés',         vals: [false,       false,             true] },
  { label: 'Havi módosítások',    vals: [false,       false,             '1 óra/hó'] },
  { label: 'Magyar support',      vals: [false,       false,             true] },
  { label: 'Havi díj',            vals: ['Nincs',     'Nincs',           '19.990 Ft-tól'] },
]

export default function ArakPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>
              Rugalmas konstrukciók
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Válaszd ki a{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                számodra legjobbat
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Egyszeri befektetés, kényelmes részletek vagy minden benne lévő havidíj — a döntés a tied.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Miben különböznek?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Összehasonlítás egy táblázatban.</p>
          </FadeIn>
          <FadeIn>
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Jellemző</th>
                    <th className="px-6 py-4 text-center text-sm font-bold" style={{ color: '#38bdf8' }}>Egyszeri</th>
                    <th className="px-6 py-4 text-center text-sm font-bold" style={{ color: '#a855f7', background: 'rgba(168,85,247,0.05)' }}>Részlet</th>
                    <th className="px-6 py-4 text-center text-sm font-bold" style={{ color: '#34d399', background: 'rgba(16,185,129,0.06)' }}>
                      <div className="flex flex-col items-center gap-1">
                        <span>Előfizetés</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#10b981', color: '#fff' }}>Ajánlott</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-6 py-4 font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{row.label}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} className="px-6 py-4 text-center"
                          style={j === 1 ? { background: 'rgba(168,85,247,0.04)' } : j === 2 ? { background: 'rgba(16,185,129,0.04)' } : {}}>
                          {v === true ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                              style={{ background: 'rgba(52,211,153,0.15)' }}>
                              <Check className="h-3.5 w-3.5" style={{ color: '#34d399' }} strokeWidth={2.5} />
                            </span>
                          ) : v === false ? (
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>—</span>
                          ) : (
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Calculator + FAQ */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingCalculator sidebar={
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Kérdések az árakról</h2>
              <FaqAccordion faqs={faqs} />
            </div>
          } />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="rounded-3xl p-12" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
              <h2 className="text-3xl font-bold text-white mb-4">Kérj személyre szabott ajánlatot!</h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Az árak tájékoztató jellegűek. Pontos ajánlatért vedd fel velünk a kapcsolatot.
              </p>
              <Link href="/kapcsolat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)' }}>
                Ajánlatot kérek <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
