import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import type { ShapeName } from './home/particleShapes'
import { ServiceVisual, type ServiceKind } from './home/ServiceVisual'
import { ServiceOrderForm } from './ServiceOrderForm'
import { ParticlePage } from './void/ParticlePage'
import { PageHero } from './void/PageHero'
import { VoidFaq } from './void/VoidFaq'
import { Label, GhostLink, TriangleBullet, SectionHead, container } from './void/ui'

export type ServicePageData = {
  /** particle shape that forms in the hero */
  shape: ShapeName
  /** line-art animation shown next to "what you get" */
  kind: ServiceKind
  icon: LucideIcon
  /** legacy colour fields, no longer used by the Void design */
  iconColor?: string
  accentColor?: string
  accentGradient?: string
  title: string
  subtitle: string
  hero: {
    badge: string
    headline: string
    sub: string
    features: string[]
  }
  whatYouGet: {
    title: string
    items: { icon: LucideIcon; title: string; desc: string }[]
  }
  howItWorks: {
    title: string
    steps: { n: string; title: string; desc: string }[]
  }
  forWhom: {
    title: string
    items: { icon: LucideIcon; label: string; desc: string }[]
  }
  pricing: {
    title: string
    note: string
    cta: string
  }
  faqs: { q: string; a: string }[]
}

export function ServicePage({ data }: { data: ServicePageData }) {
  return (
    <ParticlePage>
      {/* ===== HERO ===== */}
      <PageHero
        label={data.hero.badge}
        title={data.hero.headline}
        shape={data.shape}
        actions={<>
          <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
          <GhostLink href="/arak">Árak</GhostLink>
        </>}
      >
        <p>{data.hero.sub}</p>
        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {data.hero.features.map(f => (
            <li key={f} className="flex items-center gap-3 text-[15px] font-normal text-bone-white">
              <TriangleBullet /> {f}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* ===== MIT KAPSZ (no particles: the line animation keeps the focus) ===== */}
      <section className="void-section" data-particles="none">
        <div className={container}>
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <Label>Tartalmazza</Label>
              <h2 className="void-reveal mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">{data.whatYouGet.title}</h2>
            </div>
            <ServiceVisual kind={data.kind} className="void-reveal h-[180px] w-full max-w-[420px] lg:h-[220px] lg:max-w-none" />
          </div>
          <ul className="mt-14 grid gap-x-16 gap-y-12 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {data.whatYouGet.items.map((item, i) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="void-reveal">
                  <div className="flex items-center gap-4">
                    <span className="text-caption text-ash-gray">0{i + 1}</span>
                    <Icon className="h-5 w-5 text-electric-iris" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-heading-2xs">{item.title}</h3>
                  <p className="text-body font-extralight mt-2 text-silver-mist">{item.desc}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ===== HOGYAN ÉPÜL FEL ===== */}
      <section className="void-section" data-particles="scatter">
        <div className={container}>
          <SectionHead title={data.howItWorks.title} label="Folyamat">
            Átlátható lépések. Az ütemtervet a projekt elején közösen rögzítjük.
          </SectionHead>
          <ol className="mt-14 grid gap-12 sm:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {data.howItWorks.steps.map(step => (
              <li key={step.n} className="void-reveal">
                <div className="text-heading-lg font-extralight leading-none text-white/90">{step.n}</div>
                <h3 className="mt-5 text-heading-2xs">{step.title}</h3>
                <p className="text-body font-extralight mt-2 text-silver-mist">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== KINEK VALÓ ===== */}
      <section className="void-section">
        <div className={container}>
          <SectionHead title={data.forWhom.title} label="Kinek ajánljuk" />
          <ul className="mt-12 sm:mt-16">
            {data.forWhom.items.map(item => (
              <li key={item.label} className="void-reveal grid items-baseline gap-x-10 gap-y-1 py-5 sm:grid-cols-[1fr_1.2fr] lg:py-6">
                <span className="text-subheading tracking-heading-sm sm:text-heading-sm">{item.label}</span>
                <span className="text-body font-extralight text-silver-mist">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== ÁR ===== */}
      <section className="void-section">
        <div className={container}>
          <SectionHead title={data.pricing.title} label="Árazás">
            {data.pricing.note}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href="#erdeklodes" className="void-button">{data.pricing.cta}</a>
              <GhostLink href="/arak">Részletes árak és kalkulátor</GhostLink>
            </div>
          </SectionHead>
        </div>
      </section>

      {/* ===== GYIK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24`}>
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">Kérdés? Válasz.</h2>
            <p className="text-body font-extralight mt-5 max-w-sm text-silver-mist">Ha a tiéd nincs köztük, írj, és válaszolunk.</p>
          </div>
          <div className="void-reveal">
            <VoidFaq faqs={data.faqs} />
          </div>
        </div>
      </section>

      {/* ===== ÉRDEKLŐDÉS ===== */}
      <section id="erdeklodes" className="void-section scroll-mt-20">
        <div className={`${container} grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-24`}>
          <div data-particles="chat" aria-hidden className="order-2 h-[32svh] min-h-[220px] lg:order-1 lg:h-[min(560px,70svh)]" />
          <div className="order-1 lg:order-2">
            <Label>{data.title}</Label>
            <h2 className="mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">Kezdjük el.</h2>
            <p className="text-body font-extralight mt-5 max-w-md text-silver-mist">
              Írj pár sort, és 1 munkanapon belül jelentkezünk. Az első konzultáció ingyenes, kötelezettség nélkül.
            </p>
            <div className="mt-10">
              <ServiceOrderForm serviceName={data.title} />
            </div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
