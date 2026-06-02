import Link from 'next/link'
import { ArrowRight, Check, type LucideIcon } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from './FadeIn'
import { FaqAccordion } from './FaqAccordion'
import { ServiceOrderForm } from './ServiceOrderForm'

const SURFACE = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

export type ServicePageData = {
  icon: LucideIcon
  iconColor: string
  accentColor: string
  accentGradient: string
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
    <div className="overflow-x-hidden pt-16">

      {/* ===== HERO ===== */}
      <section className="relative py-24 flex items-start">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${data.accentColor}15, transparent)` }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
              style={{ background: `${data.accentColor}12`, border: `1px solid ${data.accentColor}25`, color: data.accentColor }}>
              <data.icon className="h-3.5 w-3.5" />
              {data.hero.badge}
            </div>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: content */}
            <div>
              <FadeIn delay={0.05}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                  {data.hero.headline}
                </h1>
              </FadeIn>
              <FadeIn delay={0.12}>
                <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {data.hero.sub}
                </p>
              </FadeIn>
              <FadeIn delay={0.18}>
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/kapcsolat"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: data.accentGradient, boxShadow: `0 0 30px ${data.accentColor}30` }}>
                    Ajánlatot kérek <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/arak"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                    Árak megtekintése
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.24}>
                <div className="flex flex-col gap-2">
                  {data.hero.features.map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Check className="h-4 w-4 shrink-0" style={{ color: data.accentColor }} strokeWidth={2.5} />
                      {f}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right: FAQ */}
            <FadeIn delay={0.1} from="right">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${data.accentColor}20` }}>
                <div className="px-6 py-4 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: data.accentColor }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: data.accentColor }}>
                    Kérdések és válaszok
                  </p>
                </div>
                <div className="p-3">
                  <FaqAccordion faqs={data.faqs} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== MIT KAPSZ ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: data.accentColor }}>Tartalmazza</p>
            <h2 className="text-3xl sm:text-4xl font-bold">{data.whatYouGet.title}</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.whatYouGet.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-2xl h-full" style={SURFACE}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${data.accentColor}15`, border: `1px solid ${data.accentColor}20` }}>
                    <item.icon className="h-5 w-5" style={{ color: data.accentColor }} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== HOGYAN MŰKÖDIK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: data.accentColor }}>Folyamat</p>
            <h2 className="text-3xl sm:text-4xl font-bold">{data.howItWorks.title}</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.howItWorks.steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-2xl h-full relative" style={SURFACE}>
                  <div className="text-4xl font-black mb-4 text-transparent bg-clip-text"
                    style={{ backgroundImage: data.accentGradient }}>
                    {step.n}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== KINEK VALÓ ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: data.accentColor }}>Célcsoport</p>
            <h2 className="text-3xl sm:text-4xl font-bold">{data.forWhom.title}</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.forWhom.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-2xl text-center hover:-translate-y-1 transition-all" style={SURFACE}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${data.accentColor}15`, border: `1px solid ${data.accentColor}20` }}>
                    <item.icon className="h-6 w-6" style={{ color: data.accentColor }} />
                  </div>
                  <div className="font-bold text-white text-sm mb-1">{item.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.desc}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== ÁRAK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: data.accentColor }}>Árazás</p>
            <h2 className="text-3xl font-bold mb-4">{data.pricing.title}</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>{data.pricing.note}</p>
            <Link href="/kapcsolat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90"
              style={{ background: data.accentGradient }}>
              {data.pricing.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4">
              <Link href="/arak" className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Vagy nézd meg a részletes árakat →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== ÉRDEKLŐDÉS FORM ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: data.accentColor }}>
                Foglald le a helyedet
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                Érdeklődsz? Írj nekünk!
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Töltsd ki az alábbi formot és 1 munkanapon belül felvesszük veled a kapcsolatot. Nincs kötelezettség, az első konzultáció ingyenes.
              </p>
              <div className="flex flex-col gap-3">
                {['Ingyenes első konzultáció', 'Személyre szabott ajánlat', '1 munkanapon belüli visszajelzés', 'Nincs rejtett díj'].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <Check className="h-4 w-4 shrink-0" style={{ color: data.accentColor }} strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn from="right">
              <div className="rounded-3xl p-7 lg:p-8"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${data.accentColor}25` }}>
                <ServiceOrderForm
                  serviceName={data.title}
                  accentColor={data.accentColor}
                  accentGradient={data.accentGradient}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">Kezdjük el együtt!</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Egy héten belül élőben lehet a weboldalad.</p>
            <Link href="/kapcsolat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: data.accentGradient, boxShadow: `0 0 30px ${data.accentColor}25` }}>
              Ajánlatot kérek <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
