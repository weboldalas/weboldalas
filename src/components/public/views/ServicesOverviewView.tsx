import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { GhostLink, Label, container } from '@/components/public/void/ui'
import { ServiceVisual } from '@/components/public/home/ServiceVisual'
import { SERVICES_OVERVIEW } from '@/content/servicesOverview'
import { href, type Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'
import { BentoCard } from '@/components/public/void/BentoCard'

export function ServicesOverviewView({ locale }: { locale: Locale }) {
  const c = SERVICES_OVERVIEW[locale]
  const t = ui(locale)
  const contact = href(locale, 'contact')
  return (
    <ParticlePage>
      <PageHero
        label={c.label}
        title={c.title}
        accent={c.accent}
        shape="devices"
        actions={<>
          <Link href={contact} className="void-button">{t.servicePage.cta}</Link>
          <GhostLink href="#fizetes">{t.servicePage.paymentLink}</GhostLink>
        </>}
      >
        {c.intro}
      </PageHero>

      {/* service list: no particles behind the line animations */}
      <section className="void-section" data-particles="none">
        <div className={container}>
          <ul className="grid gap-4 lg:gap-5">
            {c.items.map((s, i) => (
              <li key={s.route} className="void-reveal">
                <BentoCard href={href(locale, s.route)} className="p-6 sm:p-8 lg:p-10">
                  <div className="grid items-center gap-x-12 gap-y-6 lg:grid-cols-[1.2fr_1fr]">
                    <ServiceVisual kind={s.kind} locale={locale} className="h-[180px] w-full lg:order-2 lg:h-[230px]" />
                    <div className="lg:order-1">
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-ash-gray">0{i + 1}</span>
                        <ArrowUpRight className="h-6 w-6 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white lg:hidden" />
                      </div>
                      <h2 className="mt-3 flex items-start justify-between gap-6 text-heading-sm sm:text-heading">
                        {s.title}
                        <ArrowUpRight className="mt-2 hidden h-8 w-8 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white lg:block" />
                      </h2>
                      <p className="text-body font-extralight mt-4 max-w-xl text-silver-mist">{s.sub}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.points.map(p => <li key={p} className="void-chip">{p}</li>)}
                      </ul>
                    </div>
                  </div>
                </BentoCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PaymentOptions locale={locale} action={<Link href={contact} className="void-button">{t.servicePage.cta}</Link>} />

      <section className="void-section">
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]`}>
          <div data-particles="chat" aria-hidden className="h-[30svh] min-h-[220px] lg:order-2 lg:h-[min(520px,66svh)]" />
          <div className="lg:order-1">
            <Label>{t.nav.consultLabel}</Label>
            <h2 className="void-reveal mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">{t.nav.consultTitle}</h2>
            <p className="text-body font-extralight mt-5 max-w-md text-silver-mist">
              {t.nav.consultText}
            </p>
            <div className="mt-8"><Link href={contact} className="void-button">{t.nav.consultCta}</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
