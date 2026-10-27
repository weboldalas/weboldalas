import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import type { ShapeName } from './home/particleShapes'
import { ServiceVisual, type ServiceKind } from './home/ServiceVisual'
import { ServiceOrderForm } from './ServiceOrderForm'
import { ParticlePage } from './void/ParticlePage'
import { PageHero } from './void/PageHero'
import { VoidFaq } from './void/VoidFaq'
import { PaymentOptions } from './void/PaymentOptions'
import { BentoCard } from './void/BentoCard'
import { Label, GhostLink, TriangleBullet, SectionHead, container } from './void/ui'
import { href, type Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'

export type ServicePageData = {
  /** particle shape that forms in the hero */
  shape: ShapeName
  /** line-art animation shown next to "what you get" */
  kind: ServiceKind
  icon: LucideIcon
  title: string
  hero: {
    badge: string
    headline: string
    /** part of the headline shown in the brand gradient */
    accent?: string
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
  /** what the price depends on (no amounts) + the payment block's button */
  pricing: {
    note: string
    cta: string
  }
  faqs: { q: string; a: string }[]
}

export function ServicePage({ data, locale = 'hu' }: { data: ServicePageData; locale?: Locale }) {
  const t = ui(locale).servicePage
  return (
    <ParticlePage>
      {/* ===== HERO ===== */}
      <PageHero
        label={data.hero.badge}
        title={data.hero.headline}
        accent={data.hero.accent}
        shape={data.shape}
        actions={<>
          <Link href={href(locale, 'contact')} className="void-button">{t.cta}</Link>
          <GhostLink href="#fizetes">{t.paymentLink}</GhostLink>
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
              <Label>{t.includes}</Label>
              <h2 className="void-reveal mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">{data.whatYouGet.title}</h2>
            </div>
            <BentoCard className="void-reveal p-6 sm:p-8"><ServiceVisual kind={data.kind} locale={locale} className="h-[190px] w-full lg:h-[240px]" /></BentoCard>
          </div>
          <ul className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {data.whatYouGet.items.map(item => {
              const Icon = item.icon
              return (
                <li key={item.title} className="void-reveal">
                  <BentoCard className="h-full p-6 sm:p-7">
                    <span className="void-icon"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                    <h3 className="mt-6 text-heading-2xs">{item.title}</h3>
                    <p className="text-body font-extralight mt-2 text-silver-mist">{item.desc}</p>
                  </BentoCard>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ===== HOGYAN ÉPÜL FEL ===== */}
      <section className="void-section" data-particles="scatter">
        <div className={container}>
          <SectionHead title={data.howItWorks.title} label={t.process}>
            {t.processNote}
          </SectionHead>
          <ol className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {data.howItWorks.steps.map(step => (
              <li key={step.n} className="void-reveal">
                <BentoCard className="h-full p-6 sm:p-7">
                  <div className="void-gradient-num text-heading-lg font-extralight leading-none">{step.n}</div>
                  <h3 className="mt-8 text-heading-2xs">{step.title}</h3>
                  <p className="text-body font-extralight mt-2 text-silver-mist">{step.desc}</p>
                </BentoCard>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== KINEK VALÓ ===== */}
      <section className="void-section">
        <div className={container}>
          <SectionHead title={data.forWhom.title} label={t.forWhom} />
          <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:gap-5">
            {data.forWhom.items.map(item => {
              const Icon = item.icon
              return (
                <li key={item.label} className="void-reveal">
                  <BentoCard className="h-full flex-row items-start gap-5 p-6 sm:p-7">
                    <span className="void-icon shrink-0"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                    <span>
                      <span className="block text-subheading tracking-heading-sm">{item.label}</span>
                      <span className="text-body font-extralight mt-1 block text-silver-mist">{item.desc}</span>
                    </span>
                  </BentoCard>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ===== FIZETÉS ===== */}
      <PaymentOptions
        locale={locale}
        note={data.pricing.note}
        action={<a href="#erdeklodes" className="void-button">{data.pricing.cta}</a>}
      />

      {/* ===== GYIK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24`}>
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">{t.faqTitle}</h2>
            <p className="text-body font-extralight mt-5 max-w-sm text-silver-mist">{t.faqText}</p>
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
            <h2 className="mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">{t.startTitle}</h2>
            <p className="text-body font-extralight mt-5 max-w-md text-silver-mist">
              {t.startText}
            </p>
            <div className="mt-10">
              <ServiceOrderForm serviceName={data.title} locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
