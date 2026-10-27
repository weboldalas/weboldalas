import type { ServiceKind } from '@/components/public/home/ServiceVisual'
import type { Locale, RouteKey } from '@/i18n/routes'

type Code = { t: string; c: string }[]

export type HomeContent = {
  meta: { title: string; description: string }
  photoAlt: string
  pill: string
  h1: [string, string, string]
  heroLabel: string
  heroText: string
  cta: string
  work: string
  marquee: string[]
  logosLabel: string
  servicesTitle: string
  servicesLabel: string
  servicesText: string
  services: { kind: ServiceKind; route: RouteKey; title: string; desc: string }[]
  stackLabel: string
  sizesTitle: string
  sizesLabel: string
  sizesText: string
  sizes: { size: string; who: string; desc: string }[]
  processLabel: string
  processUnit: string
  processText: string
  steps: { shape: string; phase: string; title: string; desc: string }[]
  opsTitle: string
  opsLabel: string
  opsText: string
  included: string[]
  opsLink: string
  refsTitle: string
  refsLabel: string
  refsText: string
  refsAll: string
  /** slugs of the case studies featured on the homepage */
  references: string[]
  reviewsLabel: string
  reviews: { name: string; role: string; text: string }[]
  faqTitle: string
  faqText: string
  faqLink: string
  faqs: { q: string; a: string }[]
  ctaTitle: string
  ctaText: string
  codeFile: string
  code: Code[]
}

const kw = 'text-[#b9a3ff]', key = 'text-[#7dd3fc]', str = 'text-saffron-spark', punct = 'text-ash-gray', ok = 'text-[#2dd4bf]'

const hu: HomeContent = {
  meta: {
    title: 'Weboldalas – Weboldalak, webshopok és rendszerek kis-, közép- és nagyvállalatoknak',
    description: 'Weboldalt, webshopot és egyedi rendszert tervezünk, fejlesztünk és üzemeltetünk egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak. Egy összegben vagy részletekben fizetve.',
  },
  photoAlt: 'A Weboldalas csapata munka közben, két laptop előtt',
  pill: 'ERP rendszerek',
  h1: ['Weboldalak.', 'Webshopok.', 'Rendszerek.'],
  heroLabel: 'Tervezés · Fejlesztés · Üzemeltetés',
  heroText: 'Egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak tervezünk, fejlesztünk és üzemeltetünk weboldalakat, webshopokat és egyedi rendszereket. Az első beszélgetéstől az üzemeltetésig, egy összegben vagy részletekben fizetve.',
  cta: 'Ajánlatot kérek',
  work: 'Munkáink',
  marquee: ['Weboldal', 'Webshop', 'Foglalási rendszer', 'Landing page', 'CRM', 'ERP', 'Üzemeltetés'],
  logosLabel: 'Ők már velünk dolgoznak',
  servicesTitle: 'Egy csapat. Minden, ami online kell.',
  servicesLabel: 'Szolgáltatások',
  servicesText: 'Weboldal, webshop, foglalás, CRM, ERP, üzemeltetés. Egy kézben, egy kapcsolattartóval.',
  services: [
    { kind: 'web', route: 'website', title: 'Bemutatkozó weboldal', desc: 'A céged online névjegye: kik vagytok, mit csináltok, és hogyan lehet elérni benneteket.' },
    { kind: 'shop', route: 'webshop', title: 'Webshop', desc: 'Online bolt termékekkel, kosárral, online fizetéssel és rendeléskezeléssel.' },
    { kind: 'booking', route: 'booking', title: 'Foglalási rendszer', desc: 'Az ügyfeleid maguk foglalnak időpontot, asztalt vagy szobát a weboldaladon.' },
    { kind: 'landing', route: 'landing', title: 'Landing page', desc: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz.' },
    { kind: 'crm', route: 'crm', title: 'CRM rendszer', desc: 'Ügyfélkezelés: érdeklődők, ajánlatok és ügyfelek egy átlátható felületen.' },
    { kind: 'erp', route: 'erp', title: 'ERP rendszer', desc: 'Vállalatirányítás: pénzügy, raktár, beszerzés, gyártás és munkatársak egy rendszerben.' },
    { kind: 'ops', route: 'maintenance', title: 'Üzemeltetés', desc: 'Tárhely, frissítések, mentések és módosítások, hogy neked ne kelljen ezekkel foglalkoznod.' },
  ],
  stackLabel: 'Amire építünk',
  sizesTitle: 'Bármekkora cégnek.',
  sizesLabel: 'Kinek dolgozunk',
  sizesText: 'Ugyanaz a minőség és ugyanaz a csapat, a projekt méretéhez igazítva.',
  sizes: [
    { size: 'Kis', who: 'Egyéni és kisvállalkozások', desc: 'Egyszerű indulás: bemutatkozó weboldal, online foglalás vagy webshop.' },
    { size: 'Közép', who: 'KKV-k és növekvő cégek', desc: 'Webshop, CRM és automatizálás, ami a meglévő folyamataitokhoz és rendszereitekhez igazodik.' },
    { size: 'Nagy', who: 'Nagyvállalatok', desc: 'ERP és egyedi rendszerek, összekötések és hosszú távú üzemeltetés, egy kapcsolattartóval.' },
  ],
  processLabel: 'Folyamat',
  processUnit: 'lépés',
  processText: 'Ötlettől élesig, átlátható lépésekben. Az ütemtervet a projekt elején közösen rögzítjük, így mindig tudod, hol tartunk.',
  steps: [
    { shape: 'chat', phase: 'Konzultáció', title: 'Beszéljünk', desc: 'Egy kötetlen beszélgetés. Elmondod, mit szeretnél, mi pedig azt, mit javaslunk és miért.' },
    { shape: 'pen', phase: 'Tervezés', title: 'Megtervezzük', desc: 'Struktúra, szöveg, dizájn. Mind a márkádra és a céljaidra szabva.' },
    { shape: 'progress', phase: 'Fejlesztés', title: 'Elkészítjük', desc: 'Fejlesztés, beállítás és tesztelés telefonon, tableten és asztali gépen.' },
    { shape: 'rocket', phase: 'Indulás', title: 'Élesítjük', desc: 'Indul az oldal. Mi pedig maradunk: karbantartás, módosítás, fejlesztés.' },
  ],
  opsTitle: 'Te az üzletre figyelsz. Mi a többire.',
  opsLabel: 'Üzemeltetés',
  opsText: 'Domain, tárhely, mentések, frissítések, support. Egy helyen, egy kapcsolattartóval. Neked semmit nem kell értened hozzá.',
  included: ['Domain és tárhely', 'Napi biztonsági mentés', 'Frissítések', 'Technikai support', 'Alap SEO', 'Mérőkódok', 'E-mail beállítás', 'Sebesség-optimalizálás'],
  opsLink: 'Mit tartalmaz pontosan?',
  refsTitle: 'Nem ígérjük. Megmutatjuk.',
  refsLabel: 'Referenciák',
  refsText: 'Néhány cég, akiknek mi építettük az online jelenlétét.',
  refsAll: 'Összes referencia',
  references: ['helkem', 'sztanfa', 'visitkigyos'],
  reviewsLabel: 'Ők mondják, nem mi',
  reviews: [
    { name: 'Kis Péter', role: 'Panzió tulajdonos', text: 'Az online foglalásaim száma megduplázódott az új weboldal óta. Profi csapat, gyors munka!' },
    { name: 'Nagy Éva', role: 'Fodrászat', text: 'Végre van egy oldalunk ami nem szégyenítő. Az ügyfelek mindig megdicsérik, és sokkal több visszaigazolt foglalásunk van.' },
  ],
  faqTitle: 'Kérdés? Válasz.',
  faqText: 'Ha a tiéd nincs köztük, írj, és válaszolunk.',
  faqLink: 'Kérdezz tőlünk',
  faqs: [
    { q: 'Mennyi idő alatt készül el?', a: 'A projekt méretétől függ: egy bemutatkozó oldal hamarabb elkészül, mint egy webshop vagy egy egyedi rendszer. A pontos ütemtervet az elején közösen rögzítjük, így mindig tudod, hol tartunk.' },
    { q: 'Mennyibe kerül?', a: 'A projekt méretétől és a szükséges funkcióktól függ, ezért nem dolgozunk sablonárakkal. Egy rövid konzultáció után pontos, kötelezettségmentes ajánlatot küldünk.' },
    { q: 'Hogyan lehet fizetni?', a: 'Egy összegben vagy részletekben. A pontos összeget és a fizetési ütemezést előre, az ajánlatban rögzítjük.' },
    { q: 'Később bővíthető a weboldal?', a: 'Igen, a weboldaladat bármikor bővíthetjük új aloldalakkal, funkciókkal vagy integrációkkal. A fejlesztések mindig az igényeidhez igazodnak.' },
    { q: 'Én is tudom majd szerkeszteni?', a: 'Attól függ, milyen rendszert választasz. Kezelőfelületes megoldásoknál lehetséges az önálló szerkesztés. Egyébként a módosításokat mi végezzük el a megállapodott kereten belül.' },
    { q: 'Segítetek a Google-ben is megjelenni?', a: 'Igen. Minden weboldalt alapszintű keresőoptimalizálással adunk át: gyors betöltés, strukturált adatok, mobilbarát kialakítás és megfelelő meta beállítások.' },
  ],
  ctaTitle: 'Kezdjük el.',
  ctaText: 'Írj nekünk, és 1 munkanapon belül jelentkezünk egy konkrét javaslattal. Kötelezettség nélkül.',
  codeFile: 'projekt.ts',
  code: [
    [{ t: 'const ', c: kw }, { t: 'projekt', c: 'text-white' }, { t: ' = {', c: punct }],
    [{ t: '  dizajn', c: key }, { t: ': ', c: punct }, { t: "'egyedi'", c: str }, { t: ',', c: punct }],
    [{ t: '  mobilbarát', c: key }, { t: ': ', c: punct }, { t: 'true', c: kw }, { t: ',', c: punct }],
    [{ t: '  seo', c: key }, { t: ': ', c: punct }, { t: 'true', c: kw }, { t: ',', c: punct }],
    [{ t: '  állapot', c: key }, { t: ': ', c: punct }, { t: "'élesítve'", c: ok }, { t: ',', c: punct }],
    [{ t: '}', c: punct }],
  ],
}

const en: HomeContent = {
  meta: {
    title: 'Weboldalas – Websites, webshops and systems for small, mid-sized and large companies',
    description: 'We design, build and maintain websites, webshops and custom systems for sole traders, SMEs and large companies. Pay in one go or in instalments.',
  },
  photoAlt: 'The Weboldalas team at work in front of two laptops',
  pill: 'ERP systems',
  h1: ['Websites.', 'Webshops.', 'Systems.'],
  heroLabel: 'Design · Development · Maintenance',
  heroText: 'We design, build and maintain websites, webshops and custom systems for sole traders, SMEs and large companies. From the first conversation to day-to-day maintenance, paid in one go or in instalments.',
  cta: 'Get a quote',
  work: 'Our work',
  marquee: ['Website', 'Webshop', 'Booking system', 'Landing page', 'CRM', 'ERP', 'Maintenance'],
  logosLabel: 'They already work with us',
  servicesTitle: 'One team. Everything you need online.',
  servicesLabel: 'Services',
  servicesText: 'Website, webshop, booking, CRM, ERP, maintenance. All in one place, with one point of contact.',
  services: [
    { kind: 'web', route: 'website', title: 'Business website', desc: 'Your company’s home on the web: who you are, what you do and how to reach you.' },
    { kind: 'shop', route: 'webshop', title: 'Webshop', desc: 'An online store with products, a cart, online payment and order management.' },
    { kind: 'booking', route: 'booking', title: 'Booking system', desc: 'Your customers book appointments, tables or rooms on your website themselves.' },
    { kind: 'landing', route: 'landing', title: 'Landing page', desc: 'A single page built for one goal, for ads and campaigns.' },
    { kind: 'crm', route: 'crm', title: 'CRM system', desc: 'Client management: leads, quotes and clients in one clear interface.' },
    { kind: 'erp', route: 'erp', title: 'ERP system', desc: 'Company management: finance, stock, purchasing, production and staff in one system.' },
    { kind: 'ops', route: 'maintenance', title: 'Maintenance', desc: 'Hosting, updates, backups and changes, so you don’t have to deal with them.' },
  ],
  stackLabel: 'What we build with',
  sizesTitle: 'For companies of any size.',
  sizesLabel: 'Who we work for',
  sizesText: 'The same quality and the same team, scaled to the size of the project.',
  sizes: [
    { size: 'Small', who: 'Sole traders and small businesses', desc: 'An easy start: a business website, online booking or a webshop.' },
    { size: 'Mid-sized', who: 'SMEs and growing companies', desc: 'Webshops, CRM and automation that fit the processes and systems you already have.' },
    { size: 'Large', who: 'Large companies', desc: 'ERP and custom systems, integrations and long-term maintenance, with one point of contact.' },
  ],
  processLabel: 'Process',
  processUnit: 'steps',
  processText: 'From idea to launch in clear steps. We agree the schedule together at the start of the project, so you always know where things stand.',
  steps: [
    { shape: 'chat', phase: 'Consultation', title: 'Let’s talk', desc: 'An informal conversation. You tell us what you want; we tell you what we suggest and why.' },
    { shape: 'pen', phase: 'Design', title: 'We design it', desc: 'Structure, copy, design. All tailored to your brand and your goals.' },
    { shape: 'progress', phase: 'Development', title: 'We build it', desc: 'Development, setup and testing on phones, tablets and desktops.' },
    { shape: 'rocket', phase: 'Launch', title: 'We launch it', desc: 'Your site goes live, and we stay on: maintenance, changes and new features.' },
  ],
  opsTitle: 'You focus on the business. We handle the rest.',
  opsLabel: 'Maintenance',
  opsText: 'Domain, hosting, backups, updates and support. In one place, with one point of contact. You don’t need to know any of the technical side.',
  included: ['Domain and hosting', 'Daily backups', 'Updates', 'Technical support', 'Basic SEO', 'Analytics tags', 'Email setup', 'Speed optimisation'],
  opsLink: 'What exactly is included?',
  refsTitle: 'We don’t promise. We show.',
  refsLabel: 'Our work',
  refsText: 'A few of the companies whose online presence we built.',
  refsAll: 'All case studies',
  references: ['helkem', 'sztanfa', 'visitkigyos'],
  reviewsLabel: 'In their words, not ours',
  reviews: [
    { name: 'Péter Kis', role: 'Guesthouse owner', text: 'My online bookings have doubled since the new website. A professional team and fast work!' },
    { name: 'Éva Nagy', role: 'Hair salon', text: 'Finally we have a website we’re proud of. Customers always compliment it, and we get far more confirmed bookings.' },
  ],
  faqTitle: 'Questions? Answers.',
  faqText: 'If yours isn’t here, write to us and we’ll answer.',
  faqLink: 'Ask us',
  faqs: [
    { q: 'How long does it take?', a: 'It depends on the size of the project: a business website is ready sooner than a webshop or a custom system. We agree the exact schedule together at the start, so you always know where things stand.' },
    { q: 'How much does it cost?', a: 'It depends on the size of the project and the features you need, so we don’t use off-the-shelf prices. After a short consultation we send you a precise, no-obligation quote.' },
    { q: 'How can I pay?', a: 'In one payment or in instalments. The exact amount and payment schedule are agreed in advance, in the quote.' },
    { q: 'Can the website be extended later?', a: 'Yes, we can add new pages, features or integrations at any time. Development always follows your needs.' },
    { q: 'Will I be able to edit it myself?', a: 'It depends on the system you choose. Solutions with an admin interface let you edit content yourself. Otherwise we make the changes within the agreed scope.' },
    { q: 'Will you help us show up on Google?', a: 'Yes. Every website is handed over with basic search engine optimisation: fast loading, structured data, a mobile-friendly layout and proper meta settings.' },
  ],
  ctaTitle: 'Let’s get started.',
  ctaText: 'Write to us and we’ll get back to you within one business day with a concrete proposal. No obligation.',
  codeFile: 'project.ts',
  code: [
    [{ t: 'const ', c: kw }, { t: 'project', c: 'text-white' }, { t: ' = {', c: punct }],
    [{ t: '  design', c: key }, { t: ': ', c: punct }, { t: "'custom'", c: str }, { t: ',', c: punct }],
    [{ t: '  mobileFriendly', c: key }, { t: ': ', c: punct }, { t: 'true', c: kw }, { t: ',', c: punct }],
    [{ t: '  seo', c: key }, { t: ': ', c: punct }, { t: 'true', c: kw }, { t: ',', c: punct }],
    [{ t: '  status', c: key }, { t: ': ', c: punct }, { t: "'live'", c: ok }, { t: ',', c: punct }],
    [{ t: '}', c: punct }],
  ],
}

export const HOME: Record<Locale, HomeContent> = { hu, en }
