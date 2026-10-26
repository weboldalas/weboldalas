import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { BentoCard } from '@/components/public/void/BentoCard'
import { GhostLink, container } from '@/components/public/void/ui'
import { REFERENCES } from './references'

export const metadata = {
  title: 'Referenciáink | Weboldalas',
  description: 'Elkészült weboldalak és projektek: nézd meg, mit építettünk ügyfeleinknek.',
}

export default function ReferenciakPage() {
  return (
    <ParticlePage>
      <PageHero
        label="Referenciák"
        title="Nem ígérjük. Megmutatjuk."
        accent="Megmutatjuk."
        shape="rocket"
        actions={<>
          <a href="#projektek" className="void-button">Projektek</a>
          <GhostLink href="/kapcsolat">Hasonlót szeretnék</GhostLink>
        </>}
      >
        Minden projekt egyedi, a cél mégis ugyanaz: olyan weboldal, amit az ügyfél szeret használni.
      </PageHero>

      <section id="projektek" className="void-section scroll-mt-20" data-particles="scatter">
        <div className={container}>
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {REFERENCES.map((ref, i) => (
              <li key={ref.slug} className={`void-reveal ${i === 0 ? 'md:col-span-2' : ''}`}>
                <BentoCard href={`/referenciak/${ref.slug}`} className="h-full p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="void-chip">{ref.category} · {ref.year}</span>
                    <ArrowUpRight className="h-6 w-6 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h2 className={`mt-10 text-heading sm:text-heading-lg ${i === 0 ? 'xl:text-display' : ''}`}>{ref.name}</h2>
                  <p className="text-body font-extralight mt-4 max-w-xl text-silver-mist">{ref.tagline}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {ref.services.map(s => <li key={s.label} className="void-chip">{s.label}</li>)}
                  </ul>
                </BentoCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="void-section">
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]`}>
          <div data-particles="chat" aria-hidden className="h-[30svh] min-h-[220px] lg:order-2 lg:h-[min(520px,66svh)]" />
          <div className="lg:order-1">
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">Te jöhetsz.</h2>
            <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">Mesélj a projektedről, és megmutatjuk, mit építenénk neked.</p>
            <div className="mt-8"><Link href="/kapcsolat" className="void-button">Beszéljünk</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
