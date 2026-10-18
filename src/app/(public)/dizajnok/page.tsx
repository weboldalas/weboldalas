import Link from 'next/link'
import { DesignFilter, type Design } from '@/components/public/DesignFilter'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { GhostLink, container } from '@/components/public/void/ui'

export const metadata = {
  title: 'Dizájnok | Weboldalas',
  description: 'Weboldal sablonok szállásadóknak, éttermeknek, szépségszalonoknak és bármilyen méretű cégnek.',
}

const designs: Design[] = [
  {
    id: 'szallas-1',
    name: 'Azure Stay',
    category: 'szallas',
    categoryLabel: 'Szállás',
    desc: 'Modern panzió és szállásadó sablon beépített foglalási rendszerrel.',
    tags: ['foglalas'],
    features: ['Foglalási naptár', 'Szobabemutatás', 'Árlista', 'Értékelések'],
  },
  {
    id: 'etterem-1',
    name: 'Saveur',
    category: 'etterem',
    categoryLabel: 'Étterem',
    desc: 'Elegáns étterem sablon online asztalfoglalással és menü megjelenítéssel.',
    tags: ['foglalas'],
    features: ['Online foglalás', 'Menükártya', 'Nyitvatartás', 'Galéria'],
  },
  {
    id: 'szepseg-1',
    name: 'Lumière',
    category: 'szepseg',
    categoryLabel: 'Szépségipar',
    desc: 'Prémium szalon sablon időpontfoglalással és szolgáltatás bemutatóval.',
    tags: ['foglalas'],
    features: ['Időpontfoglalás', 'Szolgáltatások', 'Csapat bemutató', 'Árlista'],
  },
  {
    id: 'egeszseg-1',
    name: 'Vitalis',
    category: 'egeszseg',
    categoryLabel: 'Egészségügy',
    desc: 'Bizalomépítő egészségügyi sablon online időpontfoglalással.',
    tags: ['foglalas'],
    features: ['Orvos profilok', 'Időpontfoglalás', 'Szolgáltatások', 'ÁSZF'],
  },
  {
    id: 'szakember-1',
    name: 'Craftman',
    category: 'szakember',
    categoryLabel: 'Szakember',
    desc: 'Referenciákra építő szakember portfolio oldal ajánlatkérővel.',
    tags: ['ajanlatkero'],
    features: ['Referenciák', 'Ajánlatkérő', 'Önéletrajz', 'Elérhetőség'],
  },
  {
    id: 'vallalkozas-1',
    name: 'Velocity',
    category: 'vallalkozas',
    categoryLabel: 'Vállalkozás',
    desc: 'Modern business sablon CRM integrációval és ajánlatkérő rendszerrel.',
    tags: ['ajanlatkero', 'crm'],
    features: ['Szolgáltatások', 'Csapat', 'Ajánlatkérő', 'Blog'],
  },
  {
    id: 'webshop-1',
    name: 'Commerce Pro',
    category: 'webshop',
    categoryLabel: 'Webshop',
    desc: 'Teljes körű webáruház sablon kosárral, fizetéssel és rendeléskövetéssel.',
    tags: ['webshop'],
    features: ['Termékkatalógus', 'Kosár & Fizetés', 'Rendeléskövetés', 'Admin'],
  },
  {
    id: 'landing-1',
    name: 'Launch',
    category: 'landing',
    categoryLabel: 'Landing Page',
    desc: 'Konverzióra optimalizált landing page kampányokhoz és termékbevezetőkhöz.',
    tags: ['ajanlatkero'],
    features: ['Hero section', 'Funkciók', 'Árak', 'CTA'],
  },
]

export default function DizajnokPage() {
  return (
    <ParticlePage>
      <PageHero
        label="Dizájnok"
        title="Válassz kiindulópontot."
        shape="pen"
        actions={<>
          <a href="#dizajnok" className="void-button">Dizájnok</a>
          <GhostLink href="/kapcsolat">Egyedi dizájnt kérek</GhostLink>
        </>}
      >
        Mobilbarát, gyors sablonok iparáganként. Kiválasztod, mi pedig a márkádra szabjuk.
      </PageHero>

      <section id="dizajnok" className="void-section scroll-mt-20" data-particles="none">
        <div className={container}>
          <DesignFilter designs={designs} />
        </div>
      </section>

      <section className="void-section">
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]`}>
          <div data-particles="chat" aria-hidden className="h-[30svh] min-h-[220px] lg:order-2 lg:h-[min(520px,66svh)]" />
          <div className="lg:order-1">
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">Egyedit szeretnél?</h2>
            <p className="text-body font-extralight mt-6 max-w-md text-silver-mist">Ha egyik sem az igazi, a cégedhez tervezünk egyedi dizájnt.</p>
            <div className="mt-8"><Link href="/kapcsolat" className="void-button">Beszéljünk</Link></div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
