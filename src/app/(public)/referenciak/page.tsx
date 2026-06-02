import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/public/FadeIn'
import { REFERENCES } from './references'

export const metadata = {
  title: 'Referenciáink | Weboldalas',
  description: 'Elkészült weboldalak és projektek — nézd meg, mit csináltunk ügyfeleinknek.',
}

export default function ReferencjakPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>
              Portfólió
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Amit{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                elkészítettünk
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Minden projekt egyedi — de a cél mindig ugyanaz: valódi eredményt hozó weboldal, amit az ügyfél szeret használni.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Reference cards */}
      <section className="pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <StaggerChildren className="flex flex-col gap-6">
            {REFERENCES.map((ref, i) => (
              <StaggerItem key={ref.slug}>
                <Link href={`/referenciak/${ref.slug}`} className="group block">
                  <div className="rounded-3xl overflow-hidden transition-all hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className={`grid ${i % 2 === 0 ? 'lg:grid-cols-[2fr_3fr]' : 'lg:grid-cols-[3fr_2fr]'}`}>

                      {/* Visual panel */}
                      <div className={`relative min-h-64 lg:min-h-80 flex items-center justify-center overflow-hidden
                        ${i % 2 !== 0 ? 'lg:order-last' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${ref.gradientFrom}, ${ref.gradientTo})` }}>
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                          }} />
                        {/* Glow */}
                        <div className="absolute inset-0 opacity-40"
                          style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${ref.accentColor}, transparent)` }} />
                        {/* Project name large */}
                        <div className="relative text-center px-8">
                          <div className="text-5xl sm:text-6xl font-black text-white opacity-90 tracking-tight mb-2">
                            {ref.name}
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
                            {ref.category} · {ref.year}
                          </div>
                        </div>
                        {/* Hover arrow */}
                        <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                          <ChevronRight className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5 self-start"
                          style={{ background: `${ref.accentColor}18`, color: ref.accentColor, border: `1px solid ${ref.accentColor}30` }}>
                          {ref.category}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                          {ref.name}
                        </h2>
                        <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {ref.tagline}
                        </p>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {ref.services.map((s, j) => (
                            <span key={j} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                              <s.icon className="h-3.5 w-3.5" />
                              {s.label}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold transition-colors"
                          style={{ color: ref.accentColor }}>
                          Részletek megtekintése
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="rounded-3xl p-12"
              style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
              <h2 className="text-3xl font-bold text-white mb-4">Te lehetsz a következő</h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Vedd fel velünk a kapcsolatot és megcsináljuk a te weboldalad is.
              </p>
              <Link href="/kapcsolat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)' }}>
                Ingyenes konzultáció <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
