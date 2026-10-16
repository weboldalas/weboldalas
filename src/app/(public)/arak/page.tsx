import Link from 'next/link'
import { Check, Minus } from 'lucide-react'
import { PricingCalculator } from '@/components/public/PricingCalculator'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { VoidFaq } from '@/components/public/void/VoidFaq'
import { GhostLink, Label, SectionHead, container } from '@/components/public/void/ui'

export const metadata = {
  title: 'Árak | Weboldalas',
  description: 'Rugalmas fizetési lehetőségek: egyszeri, részletfizetés vagy havidíjas előfizetés.',
}

const faqs = [
  { q: 'Mikor kell fizetni?', a: 'Egyszeri és részletfizetésnél az első részletet az elkészítés előtt kérjük. Havidíjas konstrukciónál minden hónap elején.' },
  { q: 'Van rejtett költség?', a: 'Nincsen. Az ajánlatban szereplő összeg tartalmaz mindent, amit felsoroltunk. Nincs meglepetés.' },
  { q: 'Mi történik, ha lemondom az előfizetést?', a: 'Minimum 12 hónapos együttműködést kérünk. Utána bármikor lemondható 30 napos felmondási idővel.' },
  { q: 'Bármikor átválthatok fizetési módot?', a: 'Igen, vedd fel velünk a kapcsolatot, és megbeszéljük a lehetőségeket.' },
]

const columns = ['Egyszeri', 'Részlet', 'Havidíj']
const tableRows: { label: string; vals: (boolean | string)[] }[] = [
  { label: 'Egyedi dizájn',       vals: [true,    true,             true] },
  { label: 'Mobilbarát',          vals: [true,    true,             true] },
  { label: 'Foglalási rendszer',  vals: ['Opció', 'Opció',          true] },
  { label: 'Teljes tulajdon',     vals: [true,    'Kifizetés után', false] },
  { label: 'Üzemeltetés',         vals: [false,   false,            true] },
  { label: 'Havi módosítások',    vals: [false,   false,            '1 óra/hó'] },
  { label: 'Magyar support',      vals: [false,   false,            true] },
  { label: 'Havi díj',            vals: ['Nincs', 'Nincs',          '19 990 Ft-tól'] },
]

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-electric-iris" strokeWidth={2.5} aria-label="Igen" />
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-white/20" aria-label="Nem" />
  return <span className="text-xs text-silver-mist sm:text-sm">{v}</span>
}

export default function ArakPage() {
  return (
    <ParticlePage>
      <PageHero
        label="Árak"
        title="Három út. Egy minőség."
        shape="tag"
        actions={<>
          <a href="#kalkulator" className="void-button">Kalkulátor</a>
          <GhostLink href="/kapcsolat">Egyedi ajánlat</GhostLink>
        </>}
      >
        Egyszeri díj, kamatmentes részlet vagy minden benne lévő havidíj. Te döntöd el, mi a kényelmes.
      </PageHero>

      {/* calculator */}
      <section id="kalkulator" className="void-section scroll-mt-20" data-particles="none">
        <div className={container}>
          <Label>Kalkulátor</Label>
          <h2 className="void-reveal mt-5 mb-12 text-heading-sm sm:text-heading lg:text-heading-lg">Számold ki.</h2>
          <PricingCalculator />
        </div>
      </section>

      {/* comparison */}
      <section className="void-section" data-particles="none">
        <div className={container}>
          <SectionHead title="Miben különböznek?" label="Összehasonlítás">
            Egy pillantással, mit tartalmaz az egyes konstrukció.
          </SectionHead>
          <div className="void-reveal mt-12 sm:mt-16">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-6 pr-2 text-caption font-normal text-ash-gray sm:pr-4">Jellemző</th>
                  {columns.map((c, i) => (
                    <th key={c} className={`pb-6 text-center text-[15px] font-normal sm:text-heading-2xs ${i === 2 ? 'text-white' : 'text-silver-mist'}`}>
                      {c}
                      {i === 2 && <span className="mt-1 block text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Ajánlott</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr key={row.label} className="transition-colors hover:bg-white/[0.03]">
                    <td className="py-4 pr-2 text-sm sm:pr-4 sm:text-[15px]">{row.label}</td>
                    {row.vals.map((v, j) => <td key={j} className="px-1 py-4 text-center"><Cell v={v} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="void-section" data-particles="scatter">
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24`}>
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">Kérdések az árakról.</h2>
            <p className="text-body font-extralight mt-5 max-w-sm text-silver-mist">Az árak tájékoztató jellegűek; pontos ajánlatot a projekt ismeretében adunk.</p>
          </div>
          <div className="void-reveal"><VoidFaq faqs={faqs} /></div>
        </div>
      </section>

      {/* cta */}
      <section className="void-section">
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]`}>
          <div data-particles="chat" aria-hidden className="h-[30svh] min-h-[220px] lg:order-2 lg:h-[min(520px,66svh)]" />
          <div className="lg:order-1">
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">Kérj ajánlatot.</h2>
            <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">Pontos árat a projekt ismeretében adunk, kötelezettség nélkül.</p>
            <div className="mt-8"><Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
