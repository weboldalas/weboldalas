import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { LogoCarousel } from '@/components/public/LogoCarousel'
import { ParticleGlobe } from '@/components/public/home/ParticleGlobe'
import { TriangleField, TriangleRing } from '@/components/public/home/TriangleField'
import { ReviewCarousel } from '@/components/public/home/ReviewCarousel'
import { voidFont } from '@/components/public/home/fonts'

export const metadata = {
  title: 'Weboldalas – Modern weboldal kisebb vállalkozásoknak',
  description: 'Professzionális weboldal vállalkozásoknak nagy kezdő költségek nélkül. Kiszámítható havi díj, gyors indulás, folyamatos támogatás.',
}

const services = [
  { title: 'Bemutatkozó weboldal', desc: 'Az első benyomás számít. Gyors, mobilbarát oldal, ami bizalmat épít.', href: '/szolgaltatasok/bemutatkozo-weboldal' },
  { title: 'Webshop', desc: 'Termék fel, rendelés be, pénz a számlán.', href: '/szolgaltatasok/webshop' },
  { title: 'Foglalási rendszer', desc: 'Foglalás éjjel-nappal, telefonálás nélkül.', href: '/szolgaltatasok/foglalasi-rendszer' },
  { title: 'Landing page', desc: 'Egy oldal, egy cél: több érdeklődő a hirdetéseidből.', href: '/szolgaltatasok/landing-page' },
  { title: 'CRM rendszer', desc: 'Minden érdeklődő, ajánlat és ügyfél egy helyen.', href: '/szolgaltatasok/crm' },
  { title: 'Üzemeltetés', desc: 'Frissítés, mentés, biztonság, support. Nekünk ez a dolgunk.', href: '/szolgaltatasok/uzemeltetes' },
]

const steps = [
  { when: '1. nap', title: 'Beszéljünk', desc: 'Egy kötetlen hívás. Elmondod, mit szeretnél, mi megmondjuk, mi fog működni.' },
  { when: '2–3. nap', title: 'Megtervezzük', desc: 'Struktúra, szöveg, dizájn. Mind a márkádra szabva.' },
  { when: '4–8. nap', title: 'Elkészítjük', desc: 'Fejlesztés, beállítás, tesztelés minden eszközön.' },
  { when: '5–10. nap', title: 'Élesítjük', desc: 'Indul az oldal. Mi pedig maradunk: karbantartás, módosítás, fejlesztés.' },
]

const included = [
  'Domain és tárhely', 'Napi biztonsági mentés', 'Frissítések', 'Technikai support',
  'Alap SEO', 'Mérőkódok', 'E-mail beállítás', 'Sebesség-optimalizálás',
]

const references = [
  { slug: 'helkem', name: 'Helkem', type: 'Szálláshely' },
  { slug: 'sztanfa', name: 'Sztanfa', type: 'Vendéglátás' },
  { slug: 'visitkigyos', name: 'VisitKígyós', type: 'Turizmus' },
]

const plans = [
  { title: 'Egyszeri díj', price: '150 000 Ft-tól', note: 'Teljes tulajdonjog, előre egyeztetett ár.' },
  { title: 'Részletfizetés', price: '3–24 hónap', note: 'Kamatmentes részletek, kifizetés után a tiéd.' },
  { title: 'Havidíj', price: '19 990 Ft/hó-tól', note: 'Tárhely, domain, karbantartás és módosítások benne.' },
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

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark sm:text-nav-label">{children}</p>
}

function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm text-ash-gray transition-colors hover:text-white">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className={`${voidFont.variable} void-page relative overflow-x-clip bg-void font-ppneuemontreal text-bone-white`}>

      {/* ===== HERO ===== */}
      <section className="relative">
        <TriangleField count={30} seed={11} className="opacity-70" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-[1280px] items-center gap-6 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-0 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="relative z-10">
            <h1 className="text-heading sm:text-heading-lg xl:text-display">
              Weboldal, ami ügyfelet hoz.
            </h1>
            <div className="void-in mt-10 max-w-[480px]" style={{ animationDelay: '120ms' }}>
              <Label>Weboldal · Webshop · Foglalási rendszer</Label>
              <p className="text-body font-extralight mt-4">
                Kisvállalkozásoknak építünk gyors, szép és jól működő online jelenlétet.
                Kiszámítható havidíjjal, 10 nap alatt élesítve.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
                <GhostLink href="/referenciak">Munkáink</GhostLink>
              </div>
              <p className="mt-10 text-nav-label font-normal tracking-normal text-silver-mist">
                <span className="text-white">19 990 Ft</span>/hó-tól <span className="mx-3 text-white/25">/</span>
                <span className="text-white">22+</span> elégedett ügyfél
              </p>
            </div>
          </div>

          <div className="void-in relative -mx-4 h-[380px] sm:h-[480px] lg:mx-0 lg:h-[min(760px,88svh)]" style={{ animationDelay: '200ms' }}>
            <ParticleGlobe />
          </div>
        </div>
      </section>

      {/* ===== LOGÓK ===== */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Label>Ők már velünk dolgoznak</Label>
          <div className="mt-8">
            <LogoCarousel />
          </div>
        </div>
      </section>

      {/* ===== SZOLGÁLTATÁSOK ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Egy csapat. Minden, ami online kell.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Szolgáltatások</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                Weboldal, webshop, foglalás, CRM, üzemeltetés. Egy kézben, egy kapcsolattartóval, egy havidíjért.
              </p>
            </div>
          </div>

          <ul className="mt-20 sm:mt-24">
            {services.map((s, i) => (
              <li key={s.href} className="void-reveal">
                <Link href={s.href} className="group grid items-baseline gap-x-8 gap-y-2 py-6 sm:grid-cols-[3rem_1fr] lg:grid-cols-[3rem_1.2fr_1fr_2rem] lg:py-8">
                  <span className="text-sm text-ash-gray">0{i + 1}</span>
                  <span className="text-subheading tracking-heading-sm transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-electric-iris sm:text-heading-sm">
                    {s.title}
                  </span>
                  <span className="text-body font-extralight text-silver-mist sm:col-start-2 lg:col-start-auto">{s.desc}</span>
                  <ArrowUpRight className="hidden h-6 w-6 text-ash-gray opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-white lg:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FOLYAMAT ===== */}
      <section className="void-section">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-24 lg:px-8">
          <div className="void-reveal">
            <Label>Folyamat</Label>
            <p className="void-mega mt-6" aria-label="10 nap">
              10<span className="void-mega-unit">nap</span>
            </p>
            <p className="text-body font-extralight mt-6 max-w-sm text-silver-mist">
              Ötlettől élesig. Nincs hónapokig húzódó projekt, csak négy lépés és fix határidők.
            </p>
          </div>
          <ol className="space-y-14 lg:pt-10">
            {steps.map(s => (
              <li key={s.title} className="void-reveal">
                <Label>{s.when}</Label>
                <h3 className="mt-3 text-subheading tracking-heading-sm sm:text-heading-sm">{s.title}</h3>
                <p className="text-body font-extralight mt-3 max-w-md text-silver-mist">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== ÜZEMELTETÉS ===== */}
      <section className="void-section relative">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8">
          <div className="void-reveal order-2 mx-auto aspect-square w-full max-w-[520px] lg:order-1">
            <TriangleRing className="ring-spin" />
          </div>
          <div className="void-reveal order-1 lg:order-2">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg">Te vállalkozol. Mi intézzük a többit.</h2>
            <div className="mt-10 max-w-[520px]">
              <Label>Üzemeltetés</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">
                Domain, tárhely, mentések, frissítések, support. Egy havidíjban, fejfájás nélkül. Neked semmit nem kell értened hozzá.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3">
                {included.map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-bone-white">
                    <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0"><polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1.3" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <GhostLink href="/szolgaltatasok/uzemeltetes">Mit tartalmaz pontosan?</GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SZÁMOK ===== */}
      <section className="void-section">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-8 gap-y-16 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { n: '22+', l: 'elégedett ügyfél' },
            { n: '5–10', l: 'munkanap az indulásig' },
            { n: '19 990', l: 'Ft/hó-tól, mindennel' },
            { n: '100%', l: 'mobilbarát' },
          ].map(s => (
            <div key={s.l} className="void-reveal">
              <div className="text-heading leading-none sm:text-heading-lg sm:leading-none">{s.n}</div>
              <div className="mt-4 text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REFERENCIÁK ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Nem ígérjük. Megmutatjuk.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Referenciák</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">Néhány vállalkozás, akiknek mi építettük az online jelenlétét.</p>
              <div className="mt-8"><GhostLink href="/referenciak">Összes referencia</GhostLink></div>
            </div>
          </div>
          <ul className="mt-20 sm:mt-24">
            {references.map(r => (
              <li key={r.slug} className="void-reveal">
                <Link href={`/referenciak/${r.slug}`} className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 lg:py-7">
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

      {/* ===== ÁRAK ===== */}
      <section className="void-section">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <h2 className="text-heading-sm sm:text-heading lg:text-heading-lg void-reveal">Három út. Egy minőség.</h2>
            <div className="void-reveal lg:pt-4">
              <Label>Árak</Label>
              <p className="text-body font-extralight mt-4 text-silver-mist">Egyszeri díj, kamatmentes részlet vagy havidíj. Te döntöd el, mi kényelmes.</p>
              <div className="mt-8"><GhostLink href="/arak">Részletes árak és kalkulátor</GhostLink></div>
            </div>
          </div>
          <div className="mt-20 grid gap-14 sm:mt-24 md:grid-cols-3 md:gap-10">
            {plans.map(p => (
              <div key={p.title} className="void-reveal">
                <Label>{p.title}</Label>
                <div className="mt-4 text-subheading tracking-heading-sm sm:text-heading-sm">{p.price}</div>
                <p className="text-body font-extralight mt-3 text-silver-mist">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GYIK ===== */}
      <section className="void-section">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-8">
          <div className="void-reveal lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-heading-sm lg:text-heading">Kérdés? Válasz.</h2>
            <p className="text-body font-extralight mt-6 max-w-sm text-silver-mist">Ha a tiéd nincs köztük, írj, és válaszolunk.</p>
            <div className="mt-8"><GhostLink href="/kapcsolat">Kérdezz tőlünk</GhostLink></div>
          </div>
          <div className="void-reveal">
            {faqs.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0} className="void-faq group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-heading-2xs text-white">
                  {f.q}
                  <Plus className="mt-1 h-5 w-5 shrink-0 text-ash-gray transition-transform duration-300 group-open:rotate-45 group-open:text-saffron-spark" />
                </summary>
                <p className="text-body font-extralight mt-4 max-w-2xl text-silver-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden pb-28 pt-24 sm:pb-36 sm:pt-32">
        <TriangleField count={36} seed={23} className="opacity-80" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading sm:text-heading-lg xl:text-display void-reveal max-w-5xl">Kezdjük el. Még ma.</h2>
          <div className="void-reveal mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-body font-extralight max-w-md text-silver-mist">
              Írj nekünk, és 1 munkanapon belül jelentkezünk egy konkrét javaslattal. Kötelezettség nélkül.
            </p>
            <Link href="/kapcsolat" className="void-button self-start sm:self-auto">Ajánlatot kérek</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
