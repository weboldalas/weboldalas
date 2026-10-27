import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { LogoCarousel } from '@/components/public/LogoCarousel'
import { ReviewCarousel } from '@/components/public/home/ReviewCarousel'
import { ServiceVisual, type ServiceKind } from '@/components/public/home/ServiceVisual'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { Label, GhostLink } from '@/components/public/void/ui'
import { VoidFaq } from '@/components/public/void/VoidFaq'
import { PaymentOptions } from '@/components/public/void/PaymentOptions'
import { BentoCard } from '@/components/public/void/BentoCard'

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

const stack = ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'PHP', 'Tailwind CSS', 'WordPress', 'WooCommerce']

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
      {/* Scroll-morphing particle cloud: (photo hero, empty services) → chat → pen → progress ring → rocket → gears → stardust → paper plane */}

      {/* ===== HERO ===== */}
      <section>
        <div className="mx-auto grid min-h-[100svh] max-w-[1280px] content-center gap-2 px-4 pb-14 pt-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-0 lg:px-8 lg:pb-24 lg:pt-24">
          {/* team photo (no particle shape in the hero) */}
          <figure className="void-in relative order-2 mt-10 lg:mt-0" style={{ animationDelay: '200ms' }}>
            <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] border border-white/10 lg:aspect-square">
              <Image
                src="/images/csapat.webp"
                alt="A Weboldalas csapata munka közben, két laptop előtt"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover object-[56%_center]"
              />
            </div>
            <figcaption className="void-pill absolute bottom-4 left-4 !bg-[#0b0b0e] sm:bottom-6 sm:left-6">
              <span className="void-pill-dot" aria-hidden />
              Ketten csináljuk, az elejétől a végéig
            </figcaption>
          </figure>

          <div className="relative order-1 lg:pr-12">
            <Link href="/szolgaltatasok/erp" className="void-pill void-in mb-6 sm:mb-8">
              <span className="void-pill-tag">Új</span>
              ERP rendszerek
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <h1 className="text-heading sm:text-heading-lg xl:text-display">
              <span className="block">Weboldalak.</span>
              <span className="block">Webshopok.</span>
              <span className="block"><span className="void-mark">Rendszerek.</span></span>
            </h1>
            <div className="void-in mt-8 max-w-[500px] sm:mt-10" style={{ animationDelay: '120ms' }}>
              <Label>Tervezés · Fejlesztés · Üzemeltetés</Label>
              <p className="text-body font-extralight mt-4">
                Egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak tervezünk, fejlesztünk és üzemeltetünk weboldalakat, webshopokat és egyedi rendszereket.
                Ketten csináljuk, az első beszélgetéstől az üzemeltetésig. Egy összegben vagy részletekben fizetve.
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
        </div>
        {/* full-bleed marquee */}
        <div className="mt-6 sm:mt-8">
          <LogoCarousel />
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

          <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {services.map((s, i) => {
              // bento: web spans two columns from tablet up, ops from desktop up (keeps every row full)
              const wide = s.kind === 'web' || s.kind === 'ops'
              const span = s.kind === 'web' ? 'sm:col-span-2' : s.kind === 'ops' ? 'lg:col-span-2' : ''
              return (
                <li key={s.href} className={`void-reveal ${span}`}>
                  <BentoCard href={s.href} className="h-full p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-ash-gray">0{i + 1}</span>
                      <ArrowUpRight className="h-5 w-5 text-ash-gray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <ServiceVisual kind={s.kind} className={`my-6 w-full ${wide ? 'h-[190px] lg:h-[230px]' : 'h-[170px] lg:h-[190px]'}`} />
                    <h3 className="mt-auto text-heading-2xs sm:text-subheading sm:tracking-heading-sm">{s.title}</h3>
                    <p className="text-body font-extralight mt-2 text-silver-mist">{s.desc}</p>
                  </BentoCard>
                </li>
              )
            })}
          </ul>

          {/* stack */}
          <div className="void-reveal mt-16 flex flex-col gap-5 sm:mt-20 lg:flex-row lg:items-center lg:gap-12">
            <Label className="shrink-0">Amire építünk</Label>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {stack.map(t => <li key={t} className="void-chip min-h-10! px-4! text-[15px]! transition-colors hover:border-electric-iris/50! hover:text-white">{t}</li>)}
            </ul>
          </div>
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
          <ul className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-3 lg:gap-5">
            {sizes.map(s => (
              <li key={s.size} className="void-reveal">
                <BentoCard className="h-full p-6 sm:p-8">
                  <span className="void-chip self-start">{s.who}</span>
                  <span className={`mt-10 text-heading-lg tracking-[-0.04em] `}>{s.size}</span>
                  <span className="text-body font-extralight mt-3 text-silver-mist">{s.desc}</span>
                </BentoCard>
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
              <ul className="mt-8 flex flex-wrap gap-2">
                {included.map(item => <li key={item} className="void-chip">{item}</li>)}
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
          <ul className="mt-12 grid gap-4 sm:mt-20 md:grid-cols-3 lg:gap-5">
            {references.map(r => (
              <li key={r.slug} className="void-reveal">
                <BentoCard href={`/referenciak/${r.slug}`} className="h-full p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="void-chip">{r.type}</span>
                    <ArrowUpRight className="h-5 w-5 text-ash-gray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <span className="mt-16 text-heading sm:text-heading-lg">{r.name}</span>
                </BentoCard>
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
