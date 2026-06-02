import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Quote, ExternalLink } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/public/FadeIn'
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

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-0">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${ref.gradientFrom} 0%, ${ref.gradientTo} 50%, #08080f 100%)` }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${ref.accentColor}, transparent 70%)` }} />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24">
          {/* Back link */}
          <FadeIn>
            <Link href="/referenciak"
              className="footer-link inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Összes referencia
            </Link>
          </FadeIn>

          <div>
              <FadeIn>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
                  style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {ref.category} · {ref.year}
                </div>
              </FadeIn>
              <FadeIn delay={0.06}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4">
                  {ref.name}
                </h1>
              </FadeIn>
              <FadeIn delay={0.12}>
                <p className="text-xl max-w-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {ref.tagline}
                </p>
              </FadeIn>
            </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-12">

            {/* Main content */}
            <div>
              {/* About */}
              <FadeIn>
                <div className="mb-12">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ref.accentColor }}>A projektről</p>
                  <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>{ref.description}</p>
                  <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{ref.challenge}</p>
                </div>
              </FadeIn>

              {/* Testimonial */}
              {ref.testimonial && (
                <FadeIn>
                  <div className="relative rounded-3xl p-8 mb-12 overflow-hidden"
                    style={{ background: `${ref.accentColor}0d`, border: `1px solid ${ref.accentColor}25` }}>
                    <Quote className="absolute top-6 right-6 h-10 w-10 opacity-15" style={{ color: ref.accentColor }} />
                    <p className="text-lg leading-relaxed italic mb-6" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      „{ref.testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: ref.gradient }}>
                        {ref.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{ref.testimonial.author}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{ref.testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Services used */}
              <FadeIn>
                <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: ref.accentColor }}>Amit csináltunk</p>
                <div className="flex flex-col gap-3">
                  {ref.services.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${ref.accentColor}15`, border: `1px solid ${ref.accentColor}20` }}>
                        <s.icon className="h-5 w-5" style={{ color: ref.accentColor }} />
                      </div>
                      <span className="font-medium text-white">{s.label}</span>
                      <Check className="h-4 w-4 ml-auto shrink-0" style={{ color: ref.accentColor }} strokeWidth={2.5} />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* CTA */}
              <FadeIn from="right" delay={0.08}>
                <div className="rounded-2xl p-6"
                  style={{ background: `${ref.accentColor}0d`, border: `1px solid ${ref.accentColor}25` }}>
                  <p className="font-bold text-white mb-2">Hasonlót szeretnél?</p>
                  <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Vedd fel velünk a kapcsolatot és megcsináljuk a te weboldalad is.
                  </p>
                  <Link href="/kapcsolat"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: ref.gradient }}>
                    Ajánlatot kérek <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </FadeIn>

              {/* URL if exists */}
              {ref.url && (
                <FadeIn from="right" delay={0.12}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <ExternalLink className="h-4 w-4" /> Weboldal megtekintése
                  </a>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Következő projekt</p>
            <Link href={`/referenciak/${next.slug}`} className="group block">
              <div className="rounded-3xl overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${next.gradientFrom}, ${next.gradientTo})`, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="relative p-10 flex items-center justify-between">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }} />
                  <div className="relative">
                    <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{next.category}</div>
                    <div className="text-3xl font-black text-white">{next.name}</div>
                    <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{next.tagline}</div>
                  </div>
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1 shrink-0"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
