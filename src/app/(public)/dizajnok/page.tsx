import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/public/FadeIn'
import { DesignFilter } from '@/components/public/DesignFilter'

export const metadata = {
  title: 'Dizájnok | Weboldalas',
  description: 'Prémium weboldal sablonok szállásadóknak, éttermeknek, szépségszalonoknak és kisebb vállalkozásoknak.',
}

export const designs = [
  {
    id: 'szallas-1',
    name: 'Azure Stay',
    category: 'szallas',
    categoryLabel: 'Szállás',
    desc: 'Modern panzió és szállásadó sablon beépített foglalási rendszerrel.',
    tags: ['foglalas'],
    color: 'from-sky-400 to-blue-600',
    emoji: '🏡',
    features: ['Foglalási naptár', 'Szobabemutatás', 'Árlista', 'Értékelések'],
  },
  {
    id: 'etterem-1',
    name: 'Saveur',
    category: 'etterem',
    categoryLabel: 'Étterem',
    desc: 'Elegáns étterem sablon online asztalfoglalással és menü megjelenítéssel.',
    tags: ['foglalas'],
    color: 'from-amber-400 to-orange-600',
    emoji: '🍽️',
    features: ['Online foglalás', 'Menükártya', 'Nyitvatartás', 'Galéria'],
  },
  {
    id: 'szepseg-1',
    name: 'Lumière',
    category: 'szepseg',
    categoryLabel: 'Szépségipar',
    desc: 'Prémium szalon sablon időpontfoglalással és szolgáltatás bemutatóval.',
    tags: ['foglalas'],
    color: 'from-rose-400 to-pink-600',
    emoji: '✂️',
    features: ['Időpontfoglalás', 'Szolgáltatások', 'Csapat bemutató', 'Árlista'],
  },
  {
    id: 'egeszseg-1',
    name: 'Vitalis',
    category: 'egeszseg',
    categoryLabel: 'Egészségügy',
    desc: 'Bizalomépítő egészségügyi sablon online időpontfoglalással.',
    tags: ['foglalas'],
    color: 'from-emerald-400 to-teal-600',
    emoji: '🏥',
    features: ['Orvos profilok', 'Időpontfoglalás', 'Szolgáltatások', 'ÁSZF'],
  },
  {
    id: 'szakember-1',
    name: 'Craftman',
    category: 'szakember',
    categoryLabel: 'Szakember',
    desc: 'Referenciákra építő szakember portfolio oldal ajánlatkérővel.',
    tags: ['ajanlatkero'],
    color: 'from-slate-500 to-gray-700',
    emoji: '🔧',
    features: ['Referenciák', 'Ajánlatkérő', 'Önéletrajz', 'Elérhetőség'],
  },
  {
    id: 'vallalkozas-1',
    name: 'Velocity',
    category: 'vallalkozas',
    categoryLabel: 'Vállalkozás',
    desc: 'Modern business sablon CRM integrációval és ajánlatkérő rendszerrel.',
    tags: ['ajanlatkero', 'crm'],
    color: 'from-violet-400 to-purple-600',
    emoji: '🏢',
    features: ['Szolgáltatások', 'Csapat', 'Ajánlatkérő', 'Blog'],
  },
  {
    id: 'webshop-1',
    name: 'Commerce Pro',
    category: 'webshop',
    categoryLabel: 'Webshop',
    desc: 'Teljes körű webáruház sablon kosárral, fizetéssel és rendeléskövetéssel.',
    tags: ['webshop'],
    color: 'from-cyan-400 to-sky-600',
    emoji: '🛍️',
    features: ['Termékkatalógus', 'Kosár & Fizetés', 'Rendeléskövetés', 'Admin'],
  },
  {
    id: 'landing-1',
    name: 'Launch',
    category: 'landing',
    categoryLabel: 'Landing Page',
    desc: 'Konverzióra optimalizált landing page kampányokhoz és termékbevezetőkhöz.',
    tags: ['ajanlatkero'],
    color: 'from-orange-400 to-red-500',
    emoji: '🚀',
    features: ['Hero section', 'Funkciók', 'Árak', 'CTA'],
  },
]

export default function DizajnokPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>Prémium sablonok</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Válassz{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                dizájnt
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Minden sablon mobilbarát, gyors és konverzióra optimalizált. Válaszd ki a számodra legmegfelelőbbet — mi testre szabjuk a márkádhoz.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filterable grid */}
      <section className="pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <DesignFilter designs={designs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="rounded-3xl p-12" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
              <div className="text-4xl mb-6">🎨</div>
              <h2 className="text-3xl font-bold text-white mb-4">Nem találtad meg a tökéleteset?</h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Vedd fel velünk a kapcsolatot és egyedi dizájnt készítünk a vállalkozásodhoz.
              </p>
              <Link href="/kapcsolat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)' }}>
                Egyedi dizájnt kérek <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
