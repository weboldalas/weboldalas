import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LogoCarousel } from '@/components/public/LogoCarousel'
import { ReviewCarousel } from '@/components/public/home/ReviewCarousel'
import { ServiceVisual } from '@/components/public/home/ServiceVisual'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { Label, GhostLink } from '@/components/public/void/ui'
import { VoidFaq } from '@/components/public/void/VoidFaq'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'
import { BentoCard } from '@/components/public/void/BentoCard'
import { HOME } from '@/content/home'
import { getReferences } from '@/content/references'
import { href, referenceHref, type Locale } from '@/i18n/routes'

// triangles floating around the hero photo (position relative to the frame)
const HERO_TRIS: { pos: React.CSSProperties; size: number; color: string; delay: string }[] = [
  { pos: { top: '-18px', left: '-14px' }, size: 22, color: '#8052ff', delay: '0s' },
  { pos: { top: '18%', right: '-22px' }, size: 16, color: '#ffb829', delay: '-2s' },
  { pos: { bottom: '-20px', right: '22%' }, size: 26, color: '#2dd4bf', delay: '-4s' },
  { pos: { bottom: '26%', left: '-24px' }, size: 14, color: '#e879f9', delay: '-6s' },
]

const stack = ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'PHP', 'Tailwind CSS', 'WordPress', 'WooCommerce']

export function HomeView({ locale }: { locale: Locale }) {
  const c = HOME[locale]
  const contact = href(locale, 'contact')
  const code = c.code.map(parts => ({ parts, n: parts.reduce((a, p) => a + p.t.length, 0) }))
  const refs = getReferences(locale)
  const featured = c.references.map(slug => refs.find(r => r.slug === slug)!).filter(Boolean)
  return (
    <ParticlePage>
      {/* Scroll-morphing particle cloud: (photo hero, empty services) → chat → pen → progress ring → rocket → gears → stardust → paper plane */}

      {/* ===== HERO ===== */}
      <section>
        <div className="mx-auto grid min-h-[100svh] max-w-[1280px] content-center gap-2 px-4 pb-14 pt-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-0 lg:px-8 lg:pb-24 lg:pt-24">
          {/* team photo (no particle shape in the hero) */}
          <figure className="void-in relative order-2 mb-24 mt-10 sm:mb-0 lg:mt-0" style={{ animationDelay: '200ms' }}>
            {/* soft violet light orbiting behind the card */}
            <span aria-hidden className="hero-orb hero-orb-a" />
            <span aria-hidden className="hero-orb hero-orb-b" />
            {/* outlined triangles drifting around the frame */}
            {HERO_TRIS.map((t, i) => (
              <svg key={i} aria-hidden viewBox="0 0 10 10" className="hero-tri" style={{ ...t.pos, width: t.size, height: t.size, animationDelay: t.delay }}>
                <polygon points="5,1 9,9 1,9" fill="none" stroke={t.color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            ))}
            {/* mini code editor that types itself on a loop */}
            <div aria-hidden className="hero-code absolute -bottom-24 right-3 z-10 w-[200px] sm:-bottom-8 sm:-left-8 sm:right-auto sm:w-[268px]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="ml-2 text-[11px] text-ash-gray">{c.codeFile}</span>
              </div>
              <pre className="px-3.5 py-3 font-mono text-[10.5px] leading-[1.65] sm:text-[12.5px] sm:leading-[1.7]">
                {code.map((line, i) => (
                  <span key={i} className="hero-code-line" style={{ '--n': line.n, animationDelay: `${i * 0.55}s` } as React.CSSProperties}>
                    {line.parts.map((p, j) => <span key={j} className={p.c}>{p.t}</span>)}
                  </span>
                ))}
              </pre>
            </div>
            {/* frame with a light running around its edge */}
            <div className="hero-frame relative rounded-[30px] p-[2px]">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] bg-black lg:aspect-square">
                <Image
                  src="/images/csapat.webp"
                  alt={c.photoAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover object-[56%_center]"
                />
              </div>
            </div>
          </figure>

          <div className="relative order-1 lg:pr-12">
            <Link href={href(locale, 'erp')} className="void-pill void-in mb-6 sm:mb-8">
              <span className="void-pill-dot" aria-hidden />
              {c.pill}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <h1 className="text-heading sm:text-heading-lg xl:text-display">
              <span className="block">{c.h1[0]}</span>
              <span className="block">{c.h1[1]}</span>
              <span className="block"><span className="void-mark">{c.h1[2]}</span></span>
            </h1>
            <div className="void-in mt-8 max-w-[500px] sm:mt-10" style={{ animationDelay: '120ms' }}>
              <Label>{c.heroLabel}</Label>
              <p className="text-body font-extralight mt-4">
                {c.heroText}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link href={contact} className="void-button">{c.cta}</Link>
                <GhostLink href={href(locale, 'references')}>{c.work}</GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section aria-hidden className="void-marquee select-none py-6 sm:py-10">
        <div className="void-marquee-track">
          {[0, 1].map(half => (
            <div key={half} className="flex shrink-0 items-center">
              {c.marquee.map(m => (
                <span key={`${half}-${m}`} className="flex items-center">
                  <span className="whitespace-nowrap px-6 text-heading font-extralight text-white/25 sm:px-10 sm:text-heading-lg lg:text-display">{m}</span>
                  <svg viewBox="0 0 10 10" className="h-4 w-4 shrink-0 sm:h-6 sm:w-6"><polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1" /></svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== LOGÓK ===== */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Label>{c.logosLabel}</Label>
        </div>
        {/* full-bleed marquee */}
        <div className="mt-6 sm:mt-8">
          <LogoCarousel />
        </div>
      </section>

      {/* ===== SZOLGÁLTATÁSOK ===== */}
      <section className="void-section" data-particles="none">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">{c.servicesTitle}</h2>
            <div className="void-reveal lg:pt-4">
              <Label>{c.servicesLabel}</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                {c.servicesText}
              </p>
            </div>
          </div>

          <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {c.services.map((s, i) => {
              // bento: web spans two columns from tablet up, ops from desktop up (keeps every row full)
              const wide = s.kind === 'web' || s.kind === 'ops'
              const span = s.kind === 'web' ? 'sm:col-span-2' : s.kind === 'ops' ? 'lg:col-span-2' : ''
              return (
                <li key={s.route} className={`void-reveal ${span}`}>
                  <BentoCard href={href(locale, s.route)} className="h-full p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-ash-gray">0{i + 1}</span>
                      <ArrowUpRight className="h-5 w-5 text-ash-gray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <ServiceVisual kind={s.kind} locale={locale} className={`my-6 w-full ${wide ? 'h-[190px] lg:h-[230px]' : 'h-[170px] lg:h-[190px]'}`} />
                    <h3 className="mt-auto text-heading-2xs sm:text-subheading sm:tracking-heading-sm">{s.title}</h3>
                    <p className="text-body font-extralight mt-2 text-silver-mist">{s.desc}</p>
                  </BentoCard>
                </li>
              )
            })}
          </ul>

          {/* stack */}
          <div className="void-reveal mt-16 flex flex-col gap-5 sm:mt-20 lg:flex-row lg:items-center lg:gap-12">
            <Label className="shrink-0">{c.stackLabel}</Label>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {stack.map(t => <li key={t} className="void-chip min-h-10! px-4! text-[15px]! transition-colors hover:border-electric-iris/50! hover:text-white">{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== MÉRET ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">{c.sizesTitle}</h2>
            <div className="void-reveal lg:pt-4">
              <Label>{c.sizesLabel}</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                {c.sizesText}
              </p>
            </div>
          </div>
          <ul className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-3 lg:gap-5">
            {c.sizes.map(s => (
              <li key={s.size} className="void-reveal">
                <BentoCard className="h-full p-6 sm:p-8">
                  <span className="void-chip self-start">{s.who}</span>
                  <span className={`mt-10 text-heading-lg tracking-[-0.04em] `}>{s.size}</span>
                  <span className="text-body font-extralight mt-3 text-silver-mist">{s.desc}</span>
                </BentoCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FOLYAMAT (scrollytelling: one shape per step) ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-24">
            <div className="void-reveal">
              <Label>{c.processLabel}</Label>
              <p className="void-mega mt-6" aria-label={`${c.steps.length} ${c.processUnit}`}>
                {c.steps.length}<span className="void-mega-unit">{c.processUnit}</span>
              </p>
            </div>
            <p className="void-reveal text-body font-extralight max-w-md text-silver-mist lg:pb-6">
              {c.processText}
            </p>
          </div>

          <ol className="mt-8 lg:mt-0">
            {c.steps.map((s, i) => (
              <li key={s.title} className="grid min-h-[72svh] content-center gap-4 lg:min-h-[100svh] lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-24">
                <div data-particles={s.shape} aria-hidden className="h-[38svh] min-h-[240px] lg:order-2 lg:h-[72svh]" />
                <div className="lg:order-1">
                  <span className="text-caption text-ash-gray">0{i + 1} / 0{c.steps.length}</span>
                  <div className="mt-5"><Label>{s.phase}</Label></div>
                  <h3 className="mt-3 text-heading-sm sm:text-heading lg:text-heading-lg">{s.title}</h3>
                  <p className="text-body font-extralight mt-4 max-w-md text-silver-mist">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== ÜZEMELTETÉS ===== */}
      <section className="void-section">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8">
          <div data-particles="gears" aria-hidden className="mx-auto aspect-square w-full max-w-[420px] lg:max-w-[520px]" />
          <div className="void-reveal">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg">{c.opsTitle}</h2>
            <div className="mt-8 max-w-[520px] sm:mt-10">
              <Label>{c.opsLabel}</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                {c.opsText}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {c.included.map(item => <li key={item} className="void-chip">{item}</li>)}
              </ul>
              <div className="mt-8">
                <GhostLink href={href(locale, 'maintenance')}>{c.opsLink}</GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REFERENCIÁK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">{c.refsTitle}</h2>
            <div className="void-reveal lg:pt-4">
              <Label>{c.refsLabel}</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">{c.refsText}</p>
              <div className="mt-6"><GhostLink href={href(locale, 'references')}>{c.refsAll}</GhostLink></div>
            </div>
          </div>
          <ul className="mt-12 grid gap-4 sm:mt-20 md:grid-cols-3 lg:gap-5">
            {featured.map(r => (
              <li key={r.slug} className="void-reveal">
                <BentoCard href={referenceHref(locale, r.slug)} className="h-full p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="void-chip">{r.category}</span>
                    <ArrowUpRight className="h-5 w-5 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <span className="mt-16 text-heading sm:text-heading-lg">{r.name}</span>
                </BentoCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== VÉLEMÉNYEK ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Label>{c.reviewsLabel}</Label>
          <div className="mt-8">
            <ReviewCarousel reviews={c.reviews} locale={locale} />
          </div>
        </div>
      </section>

      {/* ===== FIZETÉS ===== */}
      <PaymentOptions locale={locale} action={<Link href={contact} className="void-button">{c.cta}</Link>} />

      {/* ===== GYIK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-8">
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">{c.faqTitle}</h2>
            <p className="text-body font-extralight mt-5 max-w-sm text-silver-mist">{c.faqText}</p>
            <div className="mt-6"><GhostLink href={contact}>{c.faqLink}</GhostLink></div>
          </div>
          <div className="void-reveal">
            <VoidFaq faqs={c.faqs} />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-24 pt-10 sm:pb-36">
        <div className="mx-auto grid max-w-[1280px] items-center gap-2 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-0 lg:px-8">
          <div data-particles="plane" aria-hidden className="h-[34svh] min-h-[240px] lg:order-2 lg:h-[min(640px,80svh)]" />
          <div className="lg:order-1">
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">{c.ctaTitle}</h2>
            <p className="void-reveal text-body font-extralight mt-6 max-w-md text-silver-mist sm:mt-8">
              {c.ctaText}
            </p>
            <div className="void-reveal mt-8">
              <Link href={contact} className="void-button">{c.cta}</Link>
            </div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
