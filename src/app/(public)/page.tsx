import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LogoCarousel } from '@/components/public/LogoCarousel'
import { ReviewCarousel } from '@/components/public/home/ReviewCarousel'
import { ServiceVisual, type ServiceKind } from '@/components/public/home/ServiceVisual'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { Label, GhostLink, TriangleBullet } from '@/components/public/void/ui'
import { VoidFaq } from '@/components/public/void/VoidFaq'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'

export const metadata = {
  title: 'Weboldalas – Weboldalak, webshopok és rendszerek kis-, közép- és nagyvállalatoknak',
  description: 'Weboldalt, webshopot és egyedi rendszert tervezünk, fejlesztünk és üzemeltetünk egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak. Egy összegben vagy részletekben fizetve.',
}

const services: { title: string; desc: string; href: string; kind: ServiceKind }[] = [
  { kind: 'web', title: 'Bemutatkozó weboldal', desc: 'A céged online névjegye: kik vagytok, mit csináltok, és hogyan lehet elérni benneteket.', href: '/szolgaltatasok/bemutatkozo-weboldal' },
  { kind: 'shop', title: 'Webshop', desc: 'Online bolt termékekkel, kosárral, online fizetéssel és rendeléskezeléssel.', href: '/szolgaltatasok/webshop' },
  { kind: 'booking', title: 'Foglalási rendszer', desc: 'Az ügyfeleid maguk foglalnak időpontot, asztalt vagy szobát a weboldaladon.', href: '/szolgaltatasok/foglalasi-rendszer' },
  { kind: 'landing', title: 'Landing page', desc: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz.', href: '/szolgaltatasok/landing-page' },
  { kind: 'crm', title: 'CRM rendszer', desc: 'Ügyfélkezelés: érdeklődők, ajánlatok és ügyfelek egy átlátható felületen.', href: '/szolgaltatasok/crm' },
  { kind: 'erp', title: 'ERP rendszer', desc: 'Vállalatirányítás: pénzügy, raktár, beszerzés, gyártás és munkatársak egy rendszerben.', href: '/szolgaltatasok/erp' },
  { kind: 'ops', title: 'Üzemeltetés', desc: 'Tárhely, frissítések, mentések és módosítások, hogy neked ne kelljen ezekkel foglalkoznod.', href: '/szolgaltatasok/uzemeltetes' },
]

const steps = [
  { shape: 'chat', phase: 'Konzultáció', title: 'Beszéljünk', desc: 'Egy kötetlen beszélgetés. Elmondod, mit szeretnél, mi pedig azt, mit javaslunk és miért.' },
  { shape: 'pen', phase: 'Tervezés', title: 'Megtervezzük', desc: 'Struktúra, szöveg, dizájn. Mind a márkádra és a céljaidra szabva.' },
  { shape: 'progress', phase: 'Fejlesztés', title: 'Elkészítjük', desc: 'Fejlesztés, beállítás és tesztelés telefonon, tableten és asztali gépen.' },
  { shape: 'rocket', phase: 'Indulás', title: 'Élesítjük', desc: 'Indul az oldal. Mi pedig maradunk: karbantartás, módosítás, fejlesztés.' },
]

const included = [
  'Domain és tárhely', 'Napi biztonsági mentés', 'Frissítések', 'Technikai support',
  'Alap SEO', 'Mérőkódok', 'E-mail beállítás', 'Sebesség-optimalizálás',
]

const sizes = [
  { size: 'Kis', who: 'Egyéni és kisvállalkozások', desc: 'Egyszerű indulás: bemutatkozó weboldal, online foglalás vagy webshop.' },
  { size: 'Közép', who: 'KKV-k és növekvő cégek', desc: 'Webshop, CRM és automatizálás, ami a meglévő folyamataitokhoz és rendszereitekhez igazodik.' },
  { size: 'Nagy', who: 'Nagyvállalatok', desc: 'ERP és egyedi rendszerek, összekötések és hosszú távú üzemeltetés, egy kapcsolattartóval.' },
]

const marquee = ['Weboldal', 'Webshop', 'Foglalási rendszer', 'Landing page', 'CRM', 'ERP', 'Üzemeltetés']

const references = [
  { slug: 'helkem', name: 'Helkem', type: 'Szálláshely' },
  { slug: 'sztanfa', name: 'Sztanfa', type: 'Vendéglátás' },
  { slug: 'visitkigyos', name: 'VisitKígyós', type: 'Turizmus' },
]

const reviews = [
  { name: 'Kis Péter', role: 'Panzió tulajdonos', text: 'Az online foglalásaim száma megduplázódott az új weboldal óta. Profi csapat, gyors munka!' },
  { name: 'Nagy Éva', role: 'Fodrászat', text: 'Végre van egy oldalunk ami nem szégyenítő. Az ügyfelek mindig megdicsérik, és sokkal több visszaigazolt foglalásunk van.' },
]

const faqs = [
  { q: 'Mennyi idő alatt készül el?', a: 'A projekt méretétől függ: egy bemutatkozó oldal hamarabb elkészül, mint egy webshop vagy egy egyedi rendszer. A pontos ütemtervet az elején közösen rögzítjük, így mindig tudod, hol tartunk.' },
  { q: 'Mennyibe kerül?', a: 'A projekt méretétől és a szükséges funkcióktól függ, ezért nem dolgozunk sablonárakkal. Egy rövid konzultáció után pontos, kötelezettségmentes ajánlatot küldünk.' },
  { q: 'Hogyan lehet fizetni?', a: 'Egy összegben vagy részletekben. A pontos összeget és a fizetési ütemezést előre, az ajánlatban rögzítjük.' },
  { q: 'Később bővíthető a weboldal?', a: 'Igen, a weboldaladat bármikor bővíthetjük új aloldalakkal, funkciókkal vagy integrációkkal. A fejlesztések mindig az igényeidhez igazodnak.' },
  { q: 'Én is tudom majd szerkeszteni?', a: 'Attól függ, milyen rendszert választasz. Kezelőfelületes megoldásoknál lehetséges az önálló szerkesztés. Egyébként a módosításokat mi végezzük el a megállapodott kereten belül.' },
  { q: 'Segítetek a Google-ben is megjelenni?', a: 'Igen. Minden weboldalt alapszintű keresőoptimalizálással adunk át: gyors betöltés, strukturált adatok, mobilbarát kialakítás és megfelelő meta beállítások.' },
]

export default function HomePage() {
  return (
    <ParticlePage>
      {/* Scroll-morphing particle cloud: devices → (empty behind services) → chat → pen → progress ring → rocket → gears → stardust → paper plane */}

      {/* ===== HERO ===== */}
      <section>
        <div className="mx-auto grid min-h-[100svh] max-w-[1280px] content-center gap-2 px-4 pb-14 pt-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-0 lg:px-8 lg:pb-24 lg:pt-24">
          {/* the globe forms here (above the copy on phones) */}
          <div data-particles="devices" aria-hidden className="h-[38svh] min-h-[260px] lg:order-2 lg:h-[min(760px,88svh)]" />

          <div className="relative lg:order-1">
            <h1 className="text-heading sm:text-heading-lg xl:text-display">
              <span className="block">Weboldalak.</span>
              <span className="block">Webshopok.</span>
              <span className="block text-ash-gray">Rendszerek.</span>
            </h1>
            <div className="void-in mt-8 max-w-[500px] sm:mt-10" style={{ animationDelay: '120ms' }}>
              <Label>Tervezés · Fejlesztés · Üzemeltetés</Label>
              <p className="text-body font-extralight mt-4">
                Egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak tervezünk, fejlesztünk és üzemeltetünk weboldalakat, webshopokat és egyedi rendszereket.
                Egy csapattal, egy összegben vagy részletekben fizetve.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
                <GhostLink href="/referenciak">Munkáink</GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section aria-hidden className="void-marquee select-none py-6 sm:py-10">
        <div className="void-marquee-track">
          {[0, 1].map(half => (
            <div key={half} className="flex shrink-0 items-center">
              {marquee.map(m => (
                <span key={`${half}-${m}`} className="flex items-center">
                  <span className="whitespace-nowrap px-6 text-heading font-extralight text-white/25 sm:px-10 sm:text-heading-lg lg:text-display">{m}</span>
                  <svg viewBox="0 0 10 10" className="h-4 w-4 shrink-0 sm:h-6 sm:w-6"><polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1" /></svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== LOGÓK ===== */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Label>Ők már velünk dolgoznak</Label>
          <div className="mt-6 sm:mt-8">
            <LogoCarousel />
          </div>
        </div>
      </section>

      {/* ===== SZOLGÁLTATÁSOK ===== */}
      <section className="void-section" data-particles="none">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Egy csapat. Minden, ami online kell.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Szolgáltatások</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                Weboldal, webshop, foglalás, CRM, ERP, üzemeltetés. Egy kézben, egy kapcsolattartóval.
              </p>
            </div>
          </div>

          <ul className="mt-14 space-y-4 sm:mt-20 lg:space-y-2">
            {services.map((s, i) => (
              <li key={s.href} className="void-reveal">
                <Link href={s.href} className="group grid items-center gap-x-10 gap-y-4 py-6 lg:grid-cols-[3rem_1.1fr_1fr_300px] lg:py-8">
                  <span className="hidden text-sm text-ash-gray lg:block">0{i + 1}</span>
                  <div>
                    <span className="mb-2 block text-caption text-ash-gray lg:hidden">0{i + 1}</span>
                    <span className="block text-subheading tracking-heading-sm transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-electric-iris sm:text-heading-sm">
                      {s.title}
                    </span>
                  </div>
                  <span className="flex items-start justify-between gap-6">
                    <span className="text-body font-extralight text-silver-mist">{s.desc}</span>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ash-gray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </span>
                  <ServiceVisual kind={s.kind} className="order-first h-[150px] w-full max-w-[340px] lg:order-none lg:max-w-none" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== MÉRET ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Bármekkora cégnek.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Kinek dolgozunk</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                Ugyanaz a minőség és ugyanaz a csapat, a projekt méretéhez igazítva.
              </p>
            </div>
          </div>
          <ul className="mt-14 sm:mt-20">
            {sizes.map(s => (
              <li key={s.size} className="void-reveal grid items-baseline gap-x-10 gap-y-3 py-6 lg:grid-cols-[1.15fr_1fr] lg:py-8">
                <span className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="text-heading tracking-[-0.04em] sm:text-heading-lg">{s.size}</span>
                  <span className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{s.who}</span>
                </span>
                <span className="text-body font-extralight text-silver-mist">{s.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FOLYAMAT (scrollytelling: one shape per step) ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-24">
            <div className="void-reveal">
              <Label>Folyamat</Label>
              <p className="void-mega mt-6" aria-label="4 lépés">
                4<span className="void-mega-unit">lépés</span>
              </p>
            </div>
            <p className="void-reveal text-body font-extralight max-w-md text-silver-mist lg:pb-6">
              Ötlettől élesig, átlátható lépésekben. Az ütemtervet a projekt elején közösen rögzítjük, így mindig tudod, hol tartunk.
            </p>
          </div>

          <ol className="mt-8 lg:mt-0">
            {steps.map((s, i) => (
              <li key={s.title} className="grid min-h-[72svh] content-center gap-4 lg:min-h-[100svh] lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-24">
                <div data-particles={s.shape} aria-hidden className="h-[38svh] min-h-[240px] lg:order-2 lg:h-[72svh]" />
                <div className="lg:order-1">
                  <span className="text-caption text-ash-gray">0{i + 1} / 0{steps.length}</span>
                  <div className="mt-5"><Label>{s.phase}</Label></div>
                  <h3 className="mt-3 text-heading-sm sm:text-heading lg:text-heading-lg">{s.title}</h3>
                  <p className="text-body font-extralight mt-4 max-w-md text-silver-mist">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== ÜZEMELTETÉS ===== */}
      <section className="void-section">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8">
          <div data-particles="gears" aria-hidden className="mx-auto aspect-square w-full max-w-[420px] lg:max-w-[520px]" />
          <div className="void-reveal">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg">Te az üzletre figyelsz. Mi a többire.</h2>
            <div className="mt-8 max-w-[520px] sm:mt-10">
              <Label>Üzemeltetés</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                Domain, tárhely, mentések, frissítések, support. Egy helyen, egy kapcsolattartóval. Neked semmit nem kell értened hozzá.
              </p>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {included.map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-bone-white">
                    <TriangleBullet />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <GhostLink href="/szolgaltatasok/uzemeltetes">Mit tartalmaz pontosan?</GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REFERENCIÁK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Nem ígérjük. Megmutatjuk.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Referenciák</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">Néhány cég, akiknek mi építettük az online jelenlétét.</p>
              <div className="mt-6"><GhostLink href="/referenciak">Összes referencia</GhostLink></div>
            </div>
          </div>
          <ul className="mt-12 sm:mt-20">
            {references.map(r => (
              <li key={r.slug} className="void-reveal">
                <Link href={`/referenciak/${r.slug}`} className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4 lg:py-7">
                  <span className="text-heading text-white/90 transition-colors duration-300 group-hover:text-white sm:text-heading-lg xl:text-display">
                    {r.name}
                  </span>
                  <span className="flex items-center gap-4 text-sm text-ash-gray transition-colors group-hover:text-white">
                    {r.type}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-electric-iris" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== VÉLEMÉNYEK ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Label>Ők mondják, nem mi</Label>
          <div className="mt-8">
            <ReviewCarousel reviews={reviews} />
          </div>
        </div>
      </section>

      {/* ===== FIZETÉS ===== */}
      <PaymentOptions action={<Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>} />

      {/* ===== GYIK ===== */}
      <section className="void-section" data-particles="scatter">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-8">
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">Kérdés? Válasz.</h2>
            <p className="text-body font-extralight mt-5 max-w-sm text-silver-mist">Ha a tiéd nincs köztük, írj, és válaszolunk.</p>
            <div className="mt-6"><GhostLink href="/kapcsolat">Kérdezz tőlünk</GhostLink></div>
          </div>
          <div className="void-reveal">
            <VoidFaq faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-24 pt-10 sm:pb-36">
        <div className="mx-auto grid max-w-[1280px] items-center gap-2 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-0 lg:px-8">
          <div data-particles="plane" aria-hidden className="h-[34svh] min-h-[240px] lg:order-2 lg:h-[min(640px,80svh)]" />
          <div className="lg:order-1">
            <h2 className="void-reveal text-heading sm:text-heading-lg xl:text-display">Kezdjük el.</h2>
            <p className="void-reveal text-body font-extralight mt-6 max-w-md text-silver-mist sm:mt-8">
              Írj nekünk, és 1 munkanapon belül jelentkezünk egy konkrét javaslattal. Kötelezettség nélkül.
            </p>
            <div className="void-reveal mt-8">
              <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
            </div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
