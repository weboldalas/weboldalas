import Link from 'next/link'
import {
  Globe, ShoppingBag, Calendar, LayoutTemplate, Users, Wrench,
  ArrowRight, Check, Star, ChevronRight,
  Home, Utensils, Scissors, Heart, Hammer, Building2,
} from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/public/FadeIn'
import { AppIcon } from '@/components/public/AppIcon'
import { PricingPreview } from '@/components/public/PricingPreview'
import { FaqAccordion } from '@/components/public/FaqAccordion'
import { LogoCarousel } from '@/components/public/LogoCarousel'

export const metadata = {
  title: 'Weboldalas – Modern weboldal kisebb vállalkozásoknak',
  description: 'Modern weboldalak ingyenes foglalási rendszerrel, nagy kezdő költségek nélkül.',
}

const services = [
  { icon: Globe,         color: 'blue',    title: 'Bemutatkozó weboldal',   desc: 'Prémium megjelenés, ami bizalmat épít.',       href: '/szolgaltatasok/bemutatkozo-weboldal' },
  { icon: ShoppingBag,   color: 'violet',  title: 'Webshop',                desc: 'Online értékesítés egyszerűen.',               href: '/szolgaltatasok/webshop' },
  { icon: Calendar,      color: 'emerald', title: 'Foglalási rendszer',      desc: 'Automatikus időpontfoglalás, 0 Ft havidíjjal.', href: '/szolgaltatasok/foglalasi-rendszer' },
  { icon: LayoutTemplate,color: 'amber',   title: 'Landing Page',           desc: 'Konverzióra épített egyoldalas megjelenés.',    href: '/szolgaltatasok/landing-page' },
  { icon: Users,         color: 'rose',    title: 'CRM',                    desc: 'Ügyfelek, ajánlatok, pénzügyek egy helyen.',     href: '/szolgaltatasok/crm' },
  { icon: Wrench,        color: 'slate',   title: 'Üzemeltetés',            desc: 'Teljes karbantartás, te csak a bizniszre.', href: '/szolgaltatasok/uzemeltetes' },
]

const whoFor = [
  { icon: Home,        color: 'blue',    label: 'Szállásadók' },
  { icon: Utensils,    color: 'amber',   label: 'Éttermek' },
  { icon: Scissors,    color: 'rose',    label: 'Szépségipar' },
  { icon: Heart,       color: 'rose',    label: 'Egészségügy' },
  { icon: Wrench,      color: 'slate',   label: 'Szakemberek' },
  { icon: Hammer,      color: 'slate',   label: 'Kivitelezők' },
  { icon: ShoppingBag, color: 'violet',  label: 'Webshopok' },
  { icon: Building2,   color: 'cyan',    label: 'Vállalkozások' },
]

const steps = [
  { n: '01', title: 'Dizájnt választasz', desc: 'Böngéssz prémium sablonjaink között és válaszd ki a márkádhoz illőt.' },
  { n: '02', title: 'Megadjuk a részleteket', desc: 'Rövid konzultáció után pontosítjuk a szövegeket, képeket és elrendezést.' },
  { n: '03', title: 'Mi elkészítjük', desc: '5–10 munkanap alatt átadjuk az elkészült weboldalt.' },
  { n: '04', title: 'Te pedig növekedsz', desc: 'Élesítés után is velünk vagy — frissítések, karbantartás, support.' },
]

const reviews = [
  { name: 'Kis Péter', role: 'Panzió tulajdonos', text: 'Az online foglalásaim száma megduplázódott az új weboldal óta. Profi csapat, gyors munka!', stars: 5 },
  { name: 'Nagy Éva', role: 'Fodrászat', text: 'Végre van egy oldalunk ami nem szégyenítő. Az ügyfelek mindig megdicsérik és sokkal több visszaigazolt foglalásunk van.', stars: 5 },
  { name: 'Takács András', role: 'Étterem', text: 'A havidíjas modell tökéletes. Nem kellett nagy összeget kiadni egyszerre, és minden benne van.', stars: 5 },
]

const faqs = [
  { q: 'Mennyi idő alatt készül el a weboldal?', a: 'Általában 5–10 munkanap alatt elkészítjük és átadjuk. Az átfutási idő a weboldalad összetettségétől függ.' },
  { q: 'A weboldal az enyém lesz?', a: 'Egyszeri és részletfizetésnél a teljes kifizetés után igen, teljesen a tiéd. Előfizetésnél az együttműködés ideje alatt üzemeltetjük, de a tartalom mindig a tiéd.' },
  { q: 'Van ingyenes foglalási rendszer?', a: 'Igen! Minden weboldalhoz opcionálisan elérhető az online időpontfoglalás extra havidíj nélkül.' },
  { q: 'Van részletfizetés?', a: 'Igen, 3–24 hónapos részletfizetési lehetőséget kínálunk. A kifizetés után a weboldal teljesen a tiéd.' },
  { q: 'Mi kerül bele az előfizetésbe?', a: 'Minden: tárhely, SSL, karbantartás, havi módosítások (1 óra/hó), foglalási rendszer és support. Minimum 12 hónap.' },
]

const SURFACE = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-10"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)', color: '#38bdf8' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Magyar csapat · Magyar support · Gyors indulás
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight mb-7">
              Modern weboldal{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                nagy kezdő&nbsp;költségek&nbsp;nélkül
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Ma már nem elég csak jelen lenni az interneten. A látogatók gyors, modern és
              bizalomépítő weboldalakat keresnek. Mi ezt megcsináljuk — egyszerűen és megfizethető áron.
            </p>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/kapcsolat"
                className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)', boxShadow: '0 0 40px rgba(14,165,233,0.3)' }}>
                Ajánlatot kérek
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/referenciak"
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
                Referenciáink
              </Link>
            </div>
          </FadeIn>

          {/* Trust row */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {['Havidíjas konstrukció', 'Ingyenes foglalási rendszer', 'Teljes üzemeltetés', 'Mobilbarát', 'Gyors indulás'].map(t => (
                <span key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <Check className="h-3.5 w-3.5 text-cyan-500" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== KINEK AJÁNLJUK ===== */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Célcsoportjaink</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Kinek ajánljuk?</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {whoFor.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:-translate-y-0.5 cursor-default text-center"
                  style={SURFACE}>
                  <AppIcon icon={item.icon} color={item.color as any} size="md" />
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== SZOLGÁLTATÁSOK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Amit kínálunk</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Szolgáltatásaink</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Mindent egy helyen, mindent érthetően.</p>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <StaggerItem key={i}>
                <Link href={svc.href}>
                  <div className="svc-card group p-6 rounded-2xl hover:-translate-y-0.5 h-full flex flex-col gap-4"
                    style={SURFACE}>
                    <AppIcon icon={svc.icon} color={svc.color as any} size="md" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1.5">{svc.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{svc.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Részletek <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== ÍGY MŰKÖDIK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Egyszerű folyamat</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Így működik</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-2xl h-full" style={SURFACE}>
                  <div className="text-4xl font-black mb-4 text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
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

      {/* ===== HAVIDÍJAS ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 lg:p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(6,182,212,0.06))', border: '1px solid rgba(14,165,233,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn from="left">
                <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>Gondtalan üzemeltetés</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                  Nem szeretne technikai dolgokkal foglalkozni?
                </h2>
                <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Érthető. A vállalkozásodra kell fókuszálnod. Mi gondoskodunk minden technikai részletről, te csak az ügyfelekre figyelj.
                </p>
                <Link href="/szolgaltatasok/uzemeltetes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
                  Részletek <ArrowRight className="h-4 w-4" />
                </Link>
              </FadeIn>
              <FadeIn from="right">
                <div className="grid grid-cols-2 gap-3">
                  {['Képcsere és szövegfrissítés', 'Szoftverfrissítések', 'Karbantartás és hibajavítás',
                    'SSL és biztonság', 'Tárhely és domain', 'Foglalási rendszer',
                    'Havi módosítási keret', 'Magyar ügyfélszolgálat'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-3" style={SURFACE}>
                      <Check className="h-4 w-4 text-cyan-400 shrink-0" strokeWidth={2.5} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÁRAK PREVIEW ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Rugalmas konstrukciók</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Válassz fizetési módot</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Egyszeri, részletes vagy havidíjas — te döntöd el.</p>
          </FadeIn>
          <PricingPreview />
        </div>
      </section>

      {/* ===== REFERENCIÁK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Portfólió</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Néhány referenciánk</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { slug: 'helkem',       name: 'Helkem',      type: 'Szálláshely', from: '#0c4a6e', to: '#0369a1', accent: '#0ea5e9' },
              { slug: 'sztanfa',      name: 'Sztanfa',     type: 'Vendéglátás', from: '#78350f', to: '#92400e', accent: '#f59e0b' },
              { slug: 'visitkigyos', name: 'VisitKígyós', type: 'Turizmus',    from: '#064e3b', to: '#065f46', accent: '#10b981' },
            ].map((ref, i) => (
              <StaggerItem key={i}>
                <Link href={`/referenciak/${ref.slug}`} className="group block">
                  <div className="relative rounded-2xl p-10 text-center hover:-translate-y-0.5 transition-all overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${ref.from}, ${ref.to})`, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                      }} />
                    <div className="absolute inset-0 opacity-30"
                      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${ref.accent}, transparent)` }} />
                    <div className="relative">
                      <div className="font-black text-white text-3xl mb-2">{ref.name}</div>
                      <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{ref.type}</div>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Megnézem <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== LOGO CAROUSEL ===== */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Akikkel dolgoztunk</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Ügyfeleink</h2>
          </FadeIn>
          <LogoCarousel />
        </div>
      </section>

      {/* ===== VÉLEMÉNYEK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>Ügyfeleink mondják</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Vélemények</h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <StaggerItem key={i}>
                <div className="relative rounded-3xl p-7 flex flex-col h-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

                  {/* Decorative quote mark */}
                  <div className="absolute -top-2 right-5 text-8xl font-bold leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(14,165,233,0.1)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(r.stars)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="relative text-base leading-7 flex-1 mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {r.text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: ['linear-gradient(135deg,#0284c7,#0ea5e9)', 'linear-gradient(135deg,#7c3aed,#a855f7)', 'linear-gradient(135deg,#059669,#10b981)'][i % 3] }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{r.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== GYIK ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#38bdf8' }}>Kérdések és válaszok</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Gyakori kérdések</h2>
          </FadeIn>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Készen állsz a modern{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                online megjelenésre?
              </span>
            </h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Vedd fel velünk a kapcsolatot ma, és egy héten belül élőben lesz a weboldalad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kapcsolat"
                className="px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)', boxShadow: '0 0 40px rgba(14,165,233,0.25)' }}>
                Ajánlatot kérek →
              </Link>
              <Link href="/dizajnok"
                className="px-8 py-4 rounded-2xl text-base font-bold transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                Dizájnok böngészése
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
