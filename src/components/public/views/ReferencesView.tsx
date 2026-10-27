import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { BentoCard } from '@/components/public/void/BentoCard'
import { GhostLink, container } from '@/components/public/void/ui'
import { getReferences } from '@/content/references'
import { REFERENCES_PAGE } from '@/content/referencesPage'
import { href, referenceHref, type Locale } from '@/i18n/routes'

export function ReferencesView({ locale }: { locale: Locale }) {
  const c = REFERENCES_PAGE[locale]
  const contact = href(locale, 'contact')
  return (
    <ParticlePage>
      <PageHero
        label={c.label}
        title={c.title}
        accent={c.accent}
        shape="rocket"
        actions={<>
          <a href="#projektek" className="void-button">{c.projects}</a>
          <GhostLink href={contact}>{c.similar}</GhostLink>
        </>}
      >
        {c.intro}
      </PageHero>

      <section id="projektek" className="void-section scroll-mt-20" data-particles="scatter">
        <div className={container}>
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {getReferences(locale).map((ref, i) => (
              <li key={ref.slug} className={`void-reveal ${i === 0 ? 'md:col-span-2' : ''}`}>
                <BentoCard href={referenceHref(locale, ref.slug)} className="h-full p-6 sm:p-8 lg:p-10">
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
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">{c.ctaTitle}</h2>
            <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">{c.ctaText}</p>
            <div className="mt-8"><Link href={contact} className="void-button">{c.ctaButton}</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
