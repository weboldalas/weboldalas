import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { BentoCard } from '@/components/public/void/BentoCard'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'
import { TriangleBullet, container } from '@/components/public/void/ui'
import { PRICING } from '@/content/pricing'
import { href, type Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'

export function PricingView({ locale }: { locale: Locale }) {
  const c = PRICING[locale]
  const t = ui(locale)
  const contact = href(locale, 'contact')
  return (
    <ParticlePage>
      <PageHero
        label={c.label}
        title={c.title}
        accent={c.accent}
        shape="tag"
        actions={<>
          <Link href={contact} className="void-button">{t.servicePage.cta}</Link>
        </>}
      >
        {c.intro}
      </PageHero>

      <section className="void-section" data-particles="none">
        <div className={container}>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {c.items.map(item => (
              <li key={item.route} className="void-reveal">
                <BentoCard href={href(locale, item.route)} className="h-full p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-heading-2xs sm:text-subheading sm:tracking-heading-sm">{item.title}</h2>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                  <p className="text-body font-extralight mt-2 text-silver-mist">{item.desc}</p>
                  <p className="mt-8 flex flex-wrap items-baseline gap-x-2 tabular-nums">
                    {locale === 'en' ? (
                      <>
                        <span className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{c.from}</span>
                        <span className="text-heading tracking-[-0.04em]">{item.unit}{item.price}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-heading tracking-[-0.04em]">{item.price}</span>
                        <span className="text-heading-2xs text-ash-gray">{item.unit}{c.from}</span>
                      </>
                    )}
                  </p>
                  <ul className="mt-8 space-y-2.5 border-t border-white/[0.07] pt-6">
                    {item.includes.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[15px] text-bone-white"><TriangleBullet /> {f}</li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-ash-gray transition-colors group-hover:text-white">{c.details}</span>
                </BentoCard>
              </li>
            ))}
            {/* consultation card fills the last grid slot */}
            <li className="void-reveal">
              <BentoCard href={contact} className="h-full justify-between p-6 sm:p-8">
                <div>
                  <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{t.nav.consultLabel}</p>
                  <h2 className="mt-4 text-heading-sm">{t.nav.consultTitle}</h2>
                  <p className="text-body font-extralight mt-3 text-silver-mist">{t.nav.consultText}</p>
                </div>
                <span className="void-button mt-8 self-start">{t.nav.consultCta}</span>
              </BentoCard>
            </li>
          </ul>
        </div>
      </section>

      <PaymentOptions locale={locale} note={c.note} action={<Link href={contact} className="void-button">{t.servicePage.cta}</Link>} />
    </ParticlePage>
  )
}
