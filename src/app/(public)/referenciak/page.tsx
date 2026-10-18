import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
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
          <ul>
            {REFERENCES.map((ref, i) => (
              <li key={ref.slug} className="void-reveal">
                <Link href={`/referenciak/${ref.slug}`} className="group grid gap-x-12 gap-y-4 py-10 lg:grid-cols-[1.2fr_1fr] lg:py-14">
                  <div>
                    <span className="text-caption text-ash-gray">0{i + 1} · {ref.category} · {ref.year}</span>
                    <h2 className="mt-3 flex items-start gap-5 text-heading text-white/90 transition-colors duration-300 group-hover:text-white sm:text-heading-lg xl:text-display">
                      {ref.name}
                      <ArrowUpRight className="mt-3 h-7 w-7 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-electric-iris sm:h-9 sm:w-9" />
                    </h2>
                  </div>
                  <div className="lg:pt-10">
                    <p className="text-body font-extralight text-silver-mist">{ref.tagline}</p>
                    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ash-gray">
                      {ref.services.map(s => <span key={s.label}>{s.label}</span>)}
                    </p>
                  </div>
                </Link>
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
