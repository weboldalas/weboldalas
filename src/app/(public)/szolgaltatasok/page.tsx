import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { GhostLink, Label, container } from '@/components/public/void/ui'
import { ServiceVisual, type ServiceKind } from '@/components/public/home/ServiceVisual'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'

export const metadata = {
  title: 'Szolgáltatások | Weboldalas',
  description: 'Weboldal, webshop, foglalási rendszer, landing page, CRM, ERP és üzemeltetés kis-, közép- és nagyvállalatoknak.',
}

const services: { kind: ServiceKind; title: string; sub: string; href: string; points: string[] }[] = [
  {
    kind: 'web', title: 'Bemutatkozó weboldal', href: '/szolgaltatasok/bemutatkozo-weboldal',
    sub: 'A céged online névjegye: megmutatja, mivel foglalkoztok, miért érdemes titeket választani, és hogyan lehet elérni benneteket.',
    points: ['Egyedi dizájn', 'Mobilbarát', 'Alap keresőoptimalizálás', 'Kapcsolatfelvételi űrlap'],
  },
  {
    kind: 'shop', title: 'Webshop', href: '/szolgaltatasok/webshop',
    sub: 'Online bolt: a vásárlók kosárba teszik és kifizetik a termékeidet, te pedig egy felületen intézed a rendeléseket.',
    points: ['Online fizetés', 'Rendeléskezelés', 'Készletnyilvántartás', 'Automatikus e-mailek'],
  },
  {
    kind: 'booking', title: 'Foglalási rendszer', href: '/szolgaltatasok/foglalasi-rendszer',
    sub: 'Az ügyfeleid maguk foglalnak szabad időpontot a weboldaladon; a visszaigazolást és az emlékeztetőt a rendszer küldi.',
    points: ['Online időpontfoglalás', 'Google Naptár', 'Automatikus visszaigazolás', 'Emlékeztető'],
  },
  {
    kind: 'landing', title: 'Landing page', href: '/szolgaltatasok/landing-page',
    sub: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz: ajánlatkérés, feliratkozás vagy vásárlás.',
    points: ['Egy cél', 'Űrlap', 'Mérőkódok', 'Gyors betöltés'],
  },
  {
    kind: 'crm', title: 'CRM rendszer', href: '/szolgaltatasok/crm',
    sub: 'Ügyfélkezelő rendszer: érdeklődők, ajánlatok, ügyfelek és teendők egy helyen, hogy semmi ne csússzon el.',
    points: ['Értékesítési tábla', 'Ajánlatok', 'Feladatok', 'Hívásnapló'],
  },
  {
    kind: 'erp', title: 'ERP rendszer', href: '/szolgaltatasok/erp',
    sub: 'Vállalatirányítási rendszer: összeköti a pénzügyet, a raktárat, a beszerzést, a gyártást és a munkatársakat.',
    points: ['Raktár és készlet', 'Beszerzés', 'Pénzügy', 'Összekötések'],
  },
  {
    kind: 'ops', title: 'Üzemeltetés', href: '/szolgaltatasok/uzemeltetes',
    sub: 'Átvállaljuk a weboldalad vagy rendszered technikai gondozását: tárhely, frissítések, mentések és módosítások.',
    points: ['Tárhely és domain', 'Frissítések', 'Napi mentés', 'Magyar ügyfélszolgálat'],
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
          <GhostLink href="#fizetes">Fizetési lehetőségek</GhostLink>
        </>}
      >
        Weboldal, webshop, foglalás, CRM, ERP és üzemeltetés. Egy csapat, egy kapcsolattartó, és olyan megoldások, amik a cégedhez igazodnak, legyen szó egyéni vállalkozásról vagy nagyvállalatról.
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PaymentOptions action={<Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>} />

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
