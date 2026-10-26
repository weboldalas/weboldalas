import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { BentoCard } from '@/components/public/void/BentoCard'
import { Label, container } from '@/components/public/void/ui'
import type { ShapeName } from '@/components/public/home/particleShapes'
import { REFERENCES } from '../references'

export function generateStaticParams() {
  return REFERENCES.map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ref = REFERENCES.find(r => r.slug === slug)
  if (!ref) return {}
  return {
    title: `${ref.name} – Referencia | Weboldalas`,
    description: ref.tagline,
  }
}

export default async function ReferenceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ref = REFERENCES.find(r => r.slug === slug)
  if (!ref) notFound()

  const currentIndex = REFERENCES.findIndex(r => r.slug === slug)
  const next = REFERENCES[(currentIndex + 1) % REFERENCES.length]
  const shape: ShapeName = /webshop/i.test(ref.category) ? 'cart' : 'devices'

  return (
    <ParticlePage>
      <PageHero
        label={`${ref.category} · ${ref.year}`}
        title={ref.name}
        shape={shape}
        back={
          <Link href="/referenciak" className="inline-flex min-h-11 items-center gap-2 text-sm text-ash-gray transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Összes referencia
          </Link>
        }
        actions={<>
          <Link href="/kapcsolat" className="void-button">Hasonlót szeretnék</Link>
          {ref.url && (
            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-ash-gray transition-colors hover:text-white">
              Weboldal megtekintése <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </>}
      >
        {ref.tagline}
      </PageHero>

      {/* about */}
      <section className="void-section" data-particles="scatter">
        <div className={`${container} grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20`}>
          <div className="void-reveal">
            <Label>A projektről</Label>
            <p className="mt-6 text-heading-2xs font-extralight leading-[1.45] sm:text-subheading sm:leading-[1.35]">{ref.description}</p>
          </div>
          <div className="void-reveal lg:pt-12">
            <Label>A kihívás</Label>
            <p className="text-body font-extralight mt-6 text-silver-mist">{ref.challenge}</p>
            <Label className="mt-12">Amit csináltunk</Label>
            <ul className="mt-6 flex flex-wrap gap-2">
              {ref.services.map(s => <li key={s.label} className="void-chip">{s.label}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* testimonial */}
      {ref.testimonial && (
        <section className="void-section">
          <div className={container}>
            <figure className="void-reveal void-card p-6 sm:p-10 lg:p-14">
              <blockquote className="max-w-4xl text-heading-2xs font-extralight sm:text-subheading lg:text-heading-sm lg:tracking-normal">
                „{ref.testimonial.text}”
              </blockquote>
              <figcaption className="mt-8 flex items-baseline gap-3">
                <span className="text-body">{ref.testimonial.author}</span>
                <span className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{ref.testimonial.role}</span>
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* features */}
      {ref.features && ref.features.length > 0 && (
        <section className="void-section" data-particles="none">
          <div className={container}>
            <Label>Funkciók</Label>
            <h2 className="void-reveal mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">Főbb funkciók.</h2>
            <ul className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {ref.features.map(f => {
                const Icon = f.icon
                return (
                  <li key={f.title} className="void-reveal">
                    <BentoCard className="h-full p-6 sm:p-7">
                      <span className="void-icon"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                      <h3 className="mt-6 text-heading-2xs">{f.title}</h3>
                      <p className="text-body font-extralight mt-2 text-silver-mist">{f.description}</p>
                    </BentoCard>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* outcome */}
      {ref.outcome && (
        <section className="void-section">
          <div className={container}>
            <Label>Eredmény</Label>
            <p className="void-reveal mt-6 max-w-5xl text-heading-sm sm:text-heading"><span className="void-gradient-text">{ref.outcome}</span></p>
          </div>
        </section>
      )}

      {/* next project */}
      <section className="void-section" data-particles="scatter">
        <div className={container}>
          <Label>Következő projekt</Label>
          <BentoCard href={`/referenciak/${next.slug}`} className="mt-6 p-6 sm:p-10 lg:p-14">
            <span className="flex items-start gap-5 text-heading text-white/90 transition-colors duration-300 group-hover:text-white sm:text-heading-lg xl:text-display">
              {next.name}
              <ArrowUpRight className="mt-3 h-8 w-8 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-electric-iris sm:h-10 sm:w-10" />
            </span>
            <span className="text-body font-extralight mt-4 block text-silver-mist">{next.tagline}</span>
          </BentoCard>
        </div>
      </section>
    </ParticlePage>
  )
}
