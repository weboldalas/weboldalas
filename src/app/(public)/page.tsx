import Link from 'next/link'
import { ArrowRight, Check, Star, Quote, ArrowUpRight } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/public/FadeIn'
import { PricingPreview } from '@/components/public/PricingPreview'
import { FaqAccordion } from '@/components/public/FaqAccordion'
import { LogoCarousel } from '@/components/public/LogoCarousel'
import { HomeMotion } from '@/components/public/home/HomeMotion'
import { HeroShowcase } from '@/components/public/home/HeroShowcase'
import { BentoServices } from '@/components/public/home/BentoServices'
import { ProcessTimeline } from '@/components/public/home/ProcessTimeline'
import { StatCounter } from '@/components/public/home/StatCounter'
import { OrbitStack } from '@/components/public/home/OrbitStack'
import { TiltCard } from '@/components/public/home/TiltCard'

export const metadata = {
  title: 'Weboldalas – Modern weboldal kisebb vállalkozásoknak',
  description: 'Professzionális weboldal vállalkozásoknak nagy kezdő költségek nélkül. Kiszámítható havi díj, gyors indulás, folyamatos támogatás.',
}

const references = [
  { slug: 'helkem', name: 'Helkem', type: 'Szálláshely', accent: '#0ea5e9', accent2: '#22d3ee' },
  { slug: 'sztanfa', name: 'Sztanfa', type: 'Vendéglátás', accent: '#f59e0b', accent2: '#ef4444' },
  { slug: 'visitkigyos', name: 'VisitKígyós', type: 'Turizmus', accent: '#10b981', accent2: '#84cc16' },
]

const reviews = [
  { name: 'Kis Péter', role: 'Panzió tulajdonos', text: 'Az online foglalásaim száma megduplázódott az új weboldal óta. Profi csapat, gyors munka!' },
  { name: 'Nagy Éva', role: 'Fodrászat', text: 'Végre van egy oldalunk ami nem szégyenítő. Az ügyfelek mindig megdicsérik, és sokkal több visszaigazolt foglalásunk van.' },
  { name: 'Takács András', role: 'Étterem', text: 'A havidíjas modell tökéletes. Nem kellett nagy összeget kiadni egyszerre, és minden benne van.' },
]

const faqs = [
  { q: 'Mennyi idő alatt készül el a weboldal?', a: 'Általában 5–10 munkanap alatt elkészítjük és átadjuk. Az átfutási idő a weboldalad összetettségétől függ.' },
  { q: 'Tényleg nincs nagy kezdő költség?', a: 'Havidíjas csomagunknál valóban nincs nagy egyszeri beruházás. Kiszámítható havi díjért profi weboldalt kapsz teljes üzemeltetéssel. Az egyszeri megoldásoknál az árat előre egyeztetjük.' },
  { q: 'Később bővíthető a weboldal?', a: 'Igen, a weboldaladat bármikor bővíthetjük új aloldalakkal, funkciókkal vagy integrációkkal. A fejlesztések mindig az igényeidhez igazodnak.' },
  { q: 'Én is tudom majd szerkeszteni?', a: 'Attól függ, milyen rendszert választasz. Kezelőfelületes megoldásoknál lehetséges az önálló szerkesztés. Egyébként a módosításokat mi végezzük el a megállapodott kereten belül.' },
  { q: 'Mi történik, ha lemondom a havidíjas csomagot?', a: 'A weboldal üzemeltetését leállítjuk, de minden tartalom elérhető marad számodra. Az együttműködés minimuma 12 hónap, ezt követően bármikor felmondható.' },
  { q: 'Segítetek a Google-ben is megjelenni?', a: 'Igen! Minden weboldalunkat alapszintű keresőoptimalizálással adjuk át: gyors betöltés, strukturált adatok, mobilbarát kialakítás és megfelelő meta beállítások.' },
]

function SectionHeading({ eyebrow, title, accent, desc, align = 'center' }: {
  eyebrow: string; title: string; accent?: string; desc?: string; align?: 'center' | 'left'
}) {
  return (
    <FadeIn className={align === 'center' ? 'mx-auto mb-14 max-w-3xl text-center sm:mb-16' : 'mb-10'}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
        {title}{' '}
        {accent && <span className="text-gradient">{accent}</span>}
      </h2>
      {desc && <p className={`mt-5 text-lg leading-relaxed text-white/50 ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>{desc}</p>}
    </FadeIn>
  )
}

export default function HomePage() {
  return (
    <HomeMotion>
      <div className="overflow-x-clip">

        {/* ===== HERO ===== */}
        <HeroShowcase />

        {/* ===== LOGÓK ===== */}
        <section className="relative py-14">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/35">
            Akik már minket választottak
          </p>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <LogoCarousel />
          </div>
        </section>

        {/* ===== SZÁMOK ===== */}
        <section className="relative py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] lg:grid-cols-4">
              {[
                { node: <StatCounter to={22} suffix="+" />, label: 'elégedett ügyfél' },
                { node: <><StatCounter to={5} format={false} />–<StatCounter to={10} format={false} /></>, label: 'munkanap az indulásig' },
                { node: <StatCounter to={19990} suffix=" Ft" />, label: 'havidíj-tól, mindennel' },
                { node: <StatCounter to={100} suffix="%" />, label: 'mobilbarát kialakítás' },
              ].map((s, i) => (
                <div key={i}
                  className={`relative p-6 text-center sm:p-8 ${i % 2 === 0 ? 'border-r border-white/[0.06]' : ''} ${i < 2 ? 'border-b border-white/[0.06] lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}>
                  <div className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{s.node}</div>
                  <div className="mt-2 text-sm text-white/45">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SZOLGÁLTATÁSOK (BENTO) ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Szolgáltatások"
              title="Minden, ami egy"
              accent="erős online jelenléthez kell."
              desc="Egy partner, egy kapcsolattartó, egy havidíj. A weboldaltól a foglalási rendszeren át az üzemeltetésig."
            />
            <BentoServices />
          </div>
        </section>

        {/* ===== FOLYAMAT ===== */}
        <section className="relative py-20 sm:py-28">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-[600px] -translate-y-1/2 opacity-40"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(139,92,246,0.18), transparent)' }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Így dolgozunk"
              title="Ötlettől az élő oldalig"
              accent="10 nap alatt."
              desc="Átlátható lépések, fix határidők, és mindig tudod, hol tartunk."
            />
            <ProcessTimeline />
          </div>
        </section>

        {/* ===== ÜZEMELTETÉS (ORBIT) ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-sky-500/[0.08] via-transparent to-violet-500/[0.08] p-6 sm:p-12 lg:p-16">
              <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
              <div className="relative grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <SectionHeading
                    align="left"
                    eyebrow="Gondtalan üzemeltetés"
                    title="Te a vállalkozásodra figyelj."
                    accent="A technikát mi intézzük."
                  />
                  <FadeIn delay={0.1}>
                    <p className="-mt-4 mb-8 text-lg leading-relaxed text-white/50">
                      Domain, tárhely, biztonsági mentések, frissítések és folyamatos támogatás egy helyen.
                      Nem kell értened a weboldalakhoz, mi végigvezetünk mindenen.
                    </p>
                    <ul className="mb-10 grid gap-3 sm:grid-cols-2">
                      {['Domain és tárhely', 'Napi biztonsági mentés', 'Frissítések kezelése', 'Technikai támogatás',
                        'Alap keresőoptimalizálás', 'Mérőkódok beállítása', 'E-mail beállítások', 'Sebesség optimalizálás'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-white/70">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15">
                            <Check className="h-3.5 w-3.5 text-sky-400" strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/szolgaltatasok/uzemeltetes" className="btn-primary group">
                      Részletek
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </FadeIn>
                </div>
                <FadeIn from="right" delay={0.1}>
                  <OrbitStack />
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ===== REFERENCIÁK ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:mb-16 md:flex-row md:items-end">
              <SectionHeading align="left" eyebrow="Portfólió" title="Munkák, amikre" accent="büszkék vagyunk." />
              <FadeIn className="md:mb-10">
                <Link href="/referenciak" className="btn-ghost group">
                  Összes referencia
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </FadeIn>
            </div>

            <StaggerChildren className="grid gap-5 md:grid-cols-3">
              {references.map(ref => (
                <StaggerItem key={ref.slug}>
                  <Link href={`/referenciak/${ref.slug}`} className="group block">
                    <TiltCard className="rounded-3xl">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/10 md:aspect-[4/5]"
                        style={{ background: `linear-gradient(160deg, ${ref.accent}40, #0b0b13 55%)` }}>
                        <div className="absolute inset-0 opacity-[0.07]"
                          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                        {/* mini site preview */}
                        <div className="absolute inset-x-6 top-6 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b13] shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
                          style={{ transform: 'translateZ(40px)' }}>
                          <div className="flex gap-1 border-b border-white/[0.06] px-3 py-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                          </div>
                          <div className="space-y-2 p-4">
                            <div className="h-24 rounded-lg" style={{ background: `linear-gradient(135deg, ${ref.accent}aa, ${ref.accent2}44)` }} />
                            <div className="h-2 w-3/4 rounded bg-white/20" />
                            <div className="h-2 w-1/2 rounded bg-white/10" />
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                              <div className="h-8 rounded bg-white/[0.06]" />
                              <div className="h-8 rounded bg-white/[0.06]" />
                              <div className="h-8 rounded bg-white/[0.06]" />
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6"
                          style={{ background: 'linear-gradient(to top, rgba(8,8,15,0.95), transparent)' }}>
                          <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: ref.accent }}>{ref.type}</div>
                            <div className="text-3xl font-extrabold text-white">{ref.name}</div>
                          </div>
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight className="h-5 w-5" />
                          </span>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ===== VÉLEMÉNYEK ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Vélemények" title="Ügyfeleink" accent="mondták." />
            <StaggerChildren className="grid gap-5 md:grid-cols-3">
              {reviews.map((r, i) => (
                <StaggerItem key={r.name} className={i === 1 ? 'md:-translate-y-6' : ''}>
                  <figure className="review-card relative flex h-full flex-col rounded-3xl p-7 sm:p-8">
                    <Quote className="absolute right-7 top-7 h-10 w-10 text-white/[0.06]" />
                    <div className="mb-6 flex gap-1">
                      {[0, 1, 2, 3, 4].map(j => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <blockquote className="flex-1 text-lg leading-relaxed text-white/80">„{r.text}”</blockquote>
                    <figcaption className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: ['linear-gradient(135deg,#0284c7,#22d3ee)', 'linear-gradient(135deg,#7c3aed,#ec4899)', 'linear-gradient(135deg,#059669,#84cc16)'][i % 3] }}>
                        {r.name.split(' ').map(p => p[0]).join('')}
                      </span>
                      <span>
                        <span className="block font-semibold text-white">{r.name}</span>
                        <span className="block text-sm text-white/40">{r.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ===== ÁRAK ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Rugalmas konstrukciók"
              title="Fizess úgy,"
              accent="ahogy neked kényelmes."
              desc="Egyszeri díj, kamatmentes részletfizetés vagy havidíj, mindegyik prémium minőséggel."
            />
            <PricingPreview />
          </div>
        </section>

        {/* ===== GYIK ===== */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:px-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading align="left" eyebrow="GYIK" title="Kérdésed" accent="van?"
                desc="Összegyűjtöttük a leggyakoribb kérdéseket. Ha nem találod a választ, írj nekünk bátran." />
              <FadeIn delay={0.1}>
                <Link href="/kapcsolat" className="btn-ghost group -mt-2">
                  Kérdezz tőlünk
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </FadeIn>
            </div>
            <FadeIn delay={0.1}>
              <FaqAccordion faqs={faqs} />
            </FadeIn>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative px-4 pb-24 pt-12 sm:px-6 sm:pb-32 lg:px-8">
          <FadeIn>
            <div className="cta-shell relative mx-auto max-w-6xl rounded-[2.5rem] p-px">
              <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-[#0a0a14] px-6 py-20 text-center sm:px-12 sm:py-28">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(45% 60% at 20% 0%, rgba(14,165,233,0.28), transparent 70%), radial-gradient(45% 60% at 80% 0%, rgba(168,85,247,0.25), transparent 70%), radial-gradient(50% 50% at 50% 110%, rgba(236,72,153,0.18), transparent 70%)' }} />
                  <div className="hero-grid absolute inset-0" />
                </div>
                <div className="relative">
                  <h2 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                    Legyen olyan weboldalad,{' '}
                    <span className="text-gradient">amire büszke vagy.</span>
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
                    Kérj ingyenes ajánlatot, és 1 munkanapon belül jelentkezünk egy személyre szabott javaslattal.
                  </p>
                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/kapcsolat" className="btn-primary btn-lg group w-full sm:w-auto">
                      Ingyenes ajánlatot kérek
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/arak" className="btn-ghost btn-lg w-full sm:w-auto">
                      Árak és kalkulátor
                    </Link>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45">
                    {['Kötelezettség nélkül', 'Válasz 1 munkanapon belül', 'Magyar ügyfélszolgálat'].map(t => (
                      <span key={t} className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </HomeMotion>
  )
}
