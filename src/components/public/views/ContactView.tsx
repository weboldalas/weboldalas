import { ContactForm } from '@/components/public/ContactForm'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { BentoCard } from '@/components/public/void/BentoCard'
import { Label, TriangleBullet, container } from '@/components/public/void/ui'
import { CONTACT } from '@/content/contact'
import type { Locale } from '@/i18n/routes'

export function ContactView({ locale, interest = '', plan = '' }: { locale: Locale; interest?: string; plan?: string }) {
  const c = CONTACT[locale]
  return (
    <ParticlePage>
      <PageHero
        label={c.label}
        title={c.title}
        accent={c.accent}
        shape="plane"
        actions={<a href="#urlap" className="void-button">{c.send}</a>}
      >
        {c.intro}
      </PageHero>

      <section id="urlap" className="void-section scroll-mt-20" data-particles="none">
        <div className={`${container} grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:gap-5`}>
          <div className="void-reveal">
            <BentoCard className="p-6 sm:p-10">
              <Label>{c.formLabel}</Label>
              <h2 className="mt-5 text-heading-sm sm:text-heading">{c.formTitle}</h2>
              <div className="mt-10">
                <ContactForm locale={locale} initialInterest={interest} initialMessage={plan ? `Kalkulátor: ${plan}\n\n` : ''} />
              </div>
            </BentoCard>
          </div>

          <div className="void-reveal space-y-4 lg:space-y-5">
            <BentoCard className="p-6 sm:p-8">
              <Label>{c.detailsLabel}</Label>
              <dl className="mt-6 space-y-6">
                {c.details.map(d => (
                  <div key={d.label}>
                    <dt className="text-caption text-ash-gray">{d.label}</dt>
                    <dd className="mt-1 text-heading-2xs">
                      {d.href ? <a href={d.href} className="transition-colors hover:text-electric-iris">{d.value}</a> : d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </BentoCard>
            <BentoCard className="p-6 sm:p-8">
              <Label>{c.promisesLabel}</Label>
              <ul className="mt-6 space-y-3">
                {c.promises.map(p => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-bone-white"><TriangleBullet /> {p}</li>
                ))}
              </ul>
            </BentoCard>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
