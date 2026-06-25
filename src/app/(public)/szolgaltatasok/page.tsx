import Link from 'next/link'
import { Globe, ShoppingBag, Calendar, LayoutTemplate, Users, Wrench, ArrowRight, ChevronRight } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/public/FadeIn'
import { AppIcon } from '@/components/public/AppIcon'

export const metadata = {
  title: 'Szolgáltatások | Weboldalas',
  description: 'Weboldal, webshop, foglalási rendszer és CRM kisvállalkozásoknak. Nem funkciókat kínálunk — eredményeket.',
}

const SURFACE = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

const services = [
  {
    icon: Globe, color: 'blue', accentColor: '#0ea5e9',
    title: 'Bemutatkozó weboldal',
    sub: 'Professzionális megjelenés, amely hitelesebbé teszi vállalkozásodat és segít meggyőzni a leendő ügyfeleket.',
    href: '/szolgaltatasok/bemutatkozo-weboldal',
    points: ['Egyedi prémium megjelenés', 'Mobilbarát minden eszközön', 'Google alapoptimalizálás', 'Kapcsolatfelvételi lehetőség'],
    from: '150.000 Ft-tól',
  },
  {
    icon: ShoppingBag, color: 'violet', accentColor: '#a855f7',
    title: 'Webshop',
    sub: 'Értékesíts online egyszerűen, biztonságosan és olyan rendszerrel, amely együtt fejlődik vállalkozásoddal.',
    href: '/szolgaltatasok/webshop',
    points: ['Korlátlan termék', 'Online fizetés', 'Egyszerű rendeléskezelés', 'Mobilbarát vásárlás'],
    from: '250.000 Ft-tól',
  },
  {
    icon: Calendar, color: 'emerald', accentColor: '#10b981',
    title: 'Foglalási rendszer',
    sub: 'Automatizáld az időpontfoglalást — így kevesebb telefonálás, és több idő jut a valódi munkára.',
    href: '/szolgaltatasok/foglalasi-rendszer',
    points: ['Online foglalás', 'Google Naptár szinkron', 'Automatikus visszaigazolás', 'Kevesebb adminisztráció'],
    from: 'Ingyenes kiegészítő',
    highlight: true,
  },
  {
    icon: LayoutTemplate, color: 'amber', accentColor: '#f59e0b',
    title: 'Landing Page',
    sub: 'Kampányoldalak, amelyek egyetlen célra készülnek: minél több érdeklődőt vagy vásárlót szerezni.',
    href: '/szolgaltatasok/landing-page',
    points: ['Erős CTA', 'Lead gyűjtés', 'Analytics integráció', 'Gyors betöltés'],
    from: '80.000 Ft-tól',
  },
  {
    icon: Users, color: 'rose', accentColor: '#f43f5e',
    title: 'CRM',
    sub: 'Minden ügyfeled, ajánlatod és feladatod egyetlen átlátható rendszerben — átláthatóan, naprakészen.',
    href: '/szolgaltatasok/crm',
    points: ['Ügyfélkezelés', 'Ajánlatkezelés', 'Feladatok', 'Pénzügyi nyilvántartás'],
    from: 'Egyéni ajánlat',
  },
  {
    icon: Wrench, color: 'slate', accentColor: '#64748b',
    title: 'Üzemeltetés',
    sub: 'Mi gondoskodunk a weboldalad technikai működéséről, hogy neked csak a vállalkozásodra kelljen koncentrálnod.',
    href: '/szolgaltatasok/uzemeltetes',
    points: ['Frissítések', 'Biztonsági mentések', 'Tárhely és SSL', 'Magyar támogatás'],
    from: '19.990 Ft/hó-tól',
  },
]

export default function SzolgaltatasokPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>Amit kínálunk</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Minden, ami kell az{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                online sikerhez
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Nem csupán weboldalakat készítünk. Olyan online megoldásokat építünk, amelyek segítenek
              bizalmat építeni, új ügyfeleket szerezni és növelni vállalkozásodat.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services grid */}
      <section className="pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-12">
            {services.map((svc, i) => (
              <StaggerItem key={i}>
                <Link href={svc.href}>
                  <div
                    className={`group p-7 rounded-3xl hover:-translate-y-0.5 relative overflow-hidden transition-all ${!svc.highlight ? 'svc-card' : ''}`}
                    style={svc.highlight
                      ? { background: `${svc.accentColor}10`, border: `1px solid ${svc.accentColor}30` }
                      : { ...SURFACE }}
                  >
                    {svc.highlight && (
                      <div className="absolute top-5 right-5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${svc.accentColor}20`, color: svc.accentColor, border: `1px solid ${svc.accentColor}30` }}>
                        🎁 Ingyenes kiegészítő
                      </div>
                    )}
                    <div className="flex items-start gap-5 mb-5">
                      <AppIcon icon={svc.icon} color={svc.color as any} size="md" />
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold text-white mb-1">{svc.title}</h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{svc.sub}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {svc.points.map(p => (
                        <div key={p} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: svc.accentColor }} />
                          {p}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-sm font-semibold" style={{ color: svc.accentColor }}>{svc.from}</span>
                      <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: svc.accentColor }}>
                        Részletek <ChevronRight className="h-4 w-4" />
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
            <h2 className="text-3xl font-bold mb-4">Nem tudod, melyik megoldás lenne számodra a legjobb?</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Mesélj a vállalkozásodról, mi pedig segítünk kiválasztani azt a megoldást,
              amely valóban támogatja a céljaidat.
            </p>
            <Link href="/kapcsolat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)' }}>
              Ingyenes konzultáció <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
