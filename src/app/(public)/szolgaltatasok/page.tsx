import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { GhostLink, Label, container } from '@/components/public/void/ui'
import { ServiceVisual, type ServiceKind } from '@/components/public/home/ServiceVisual'

export const metadata = {
  title: 'Szolgáltatások | Weboldalas',
  description: 'Weboldal, webshop, foglalási rendszer, landing page, CRM és üzemeltetés kis-, közép- és nagyvállalatoknak.',
}

const services: { kind: ServiceKind; title: string; sub: string; href: string; points: string[]; from: string }[] = [
  {
    kind: 'web', title: 'Bemutatkozó weboldal', href: '/szolgaltatasok/bemutatkozo-weboldal',
    sub: 'Professzionális megjelenés, ami hitelesebbé teszi a cégedet.',
    points: ['Egyedi megjelenés', 'Mobilbarát', 'Google alapoptimalizálás', 'Kapcsolatfelvétel'],
    from: '250 000 Ft-tól',
  },
  {
    kind: 'shop', title: 'Webshop', href: '/szolgaltatasok/webshop',
    sub: 'Értékesíts online, egy rendszerrel, ami együtt nő a céggel.',
    points: ['Korlátlan termék', 'Online fizetés', 'Rendeléskezelés', 'Mobilbarát vásárlás'],
    from: '450 000 Ft-tól',
  },
  {
    kind: 'booking', title: 'Foglalási rendszer', href: '/szolgaltatasok/foglalasi-rendszer',
    sub: 'Online időpontfoglalás: kevesebb telefon, több idő a valódi munkára.',
    points: ['Online foglalás', 'Google Naptár szinkron', 'Automatikus visszaigazolás', 'Kevesebb adminisztráció'],
    from: 'Ingyenes kiegészítő',
  },
  {
    kind: 'landing', title: 'Landing page', href: '/szolgaltatasok/landing-page',
    sub: 'Kampányoldal egyetlen céllal: érdeklődőt vagy vásárlót szerezni.',
    points: ['Erős CTA', 'Lead gyűjtés', 'Analitika', 'Gyors betöltés'],
    from: '80 000 Ft-tól',
  },
  {
    kind: 'crm', title: 'CRM rendszer', href: '/szolgaltatasok/crm',
    sub: 'Ügyfelek, ajánlatok és feladatok egyetlen átlátható rendszerben.',
    points: ['Ügyfélkezelés', 'Ajánlatkezelés', 'Feladatok', 'Pénzügyi nyilvántartás'],
    from: 'Egyéni ajánlat',
  },
  {
    kind: 'ops', title: 'Üzemeltetés', href: '/szolgaltatasok/uzemeltetes',
    sub: 'A technikai működés a mi dolgunk, hogy neked csak az üzletre kelljen figyelned.',
    points: ['Frissítések', 'Biztonsági mentések', 'Tárhely és SSL', 'Magyar támogatás'],
    from: '19 990 Ft/hó-tól',
  },
]

export default function SzolgaltatasokPage() {
  return (
    <ParticlePage>
      <PageHero
        label="Szolgáltatások"
        title="Minden, ami online kell."
        shape="devices"
        actions={<>
          <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
          <GhostLink href="/arak">Árak</GhostLink>
        </>}
      >
        Weboldal, webshop, foglalás, CRM és üzemeltetés. Egy csapat, egy kapcsolattartó, és olyan megoldások, amik a cégedhez igazodnak, legyen szó egyéni vállalkozásról vagy nagyvállalatról.
      </PageHero>

      {/* service list: no particles behind the line animations */}
      <section className="void-section" data-particles="none">
        <div className={container}>
          <ul>
            {services.map((s, i) => (
              <li key={s.href} className="void-reveal">
                <Link href={s.href} className="group grid items-center gap-x-12 gap-y-5 py-10 lg:grid-cols-[1.25fr_1fr] lg:py-14">
                  <ServiceVisual kind={s.kind} className="h-[160px] w-full max-w-[380px] lg:order-2 lg:h-[200px] lg:max-w-none" />
                  <div className="lg:order-1">
                    <span className="text-caption text-ash-gray">0{i + 1}</span>
                    <h2 className="mt-3 flex items-start justify-between gap-6 text-heading-sm transition-colors duration-300 group-hover:text-electric-iris sm:text-heading lg:text-heading-lg">
                      {s.title}
                      <ArrowUpRight className="mt-2 h-6 w-6 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white sm:h-8 sm:w-8" />
                    </h2>
                    <p className="text-body font-extralight mt-4 max-w-xl text-silver-mist">{s.sub}</p>
                    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ash-gray">
                      {s.points.map(p => <span key={p}>{p}</span>)}
                    </p>
                    <p className="mt-5 text-caption font-semibold uppercase tracking-nav-label text-saffron-spark sm:text-nav-label">{s.from}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="void-section">
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]`}>
          <div data-particles="chat" aria-hidden className="h-[30svh] min-h-[220px] lg:order-2 lg:h-[min(520px,66svh)]" />
          <div className="lg:order-1">
            <Label>Konzultáció</Label>
            <h2 className="void-reveal mt-5 text-heading-sm sm:text-heading lg:text-heading-lg">Nem tudod, melyik kell?</h2>
            <p className="text-body font-extralight mt-5 max-w-md text-silver-mist">
              Mesélj a projektedről, és segítünk kiválasztani azt, ami tényleg támogatja a céljaidat.
            </p>
            <div className="mt-8"><Link href="/kapcsolat" className="void-button">Beszéljünk</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
