import { LayoutTemplate, Target, CheckSquare, FileText, Star, MousePointerClick, BarChart2, Megaphone, Tag, Mail, Rocket } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'Landing page készítés | Weboldalas',
  description: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz: ajánlatkérés, feliratkozás vagy vásárlás.',
}

export const hu: ServicePageData = {
  shape: 'target',
  kind: 'landing',
  icon: LayoutTemplate,
  title: 'Landing page',
  hero: {
    badge: 'Landing page',
    headline: 'Egy oldal, egy cél: több érdeklődő',
    accent: 'több érdeklődő',
    sub: 'A landing page egyetlen célra épített oldal, például ajánlatkérésre, feliratkozásra vagy egy termék megvásárlására. Leginkább hirdetésekhez és kampányokhoz használják, mert minden eleme ezt az egy lépést segíti.',
    features: [
      'Egyértelmű üzenet, jól látható gombok',
      'Gyors betöltés, mobilra tervezve',
      'Űrlap az érdeklődők adataihoz',
      'Mérőkódok (Google Analytics, Meta Pixel)',
      'A kampányhoz illő dizájn',
      'Könnyen tesztelhető változatok',
    ],
  },
  whatYouGet: {
    title: 'Mit tartalmaz a landing page?',
    items: [
      { icon: Target,            title: 'Erős nyitás',       desc: 'Már az első képernyőn kiderül, mit kínálsz, és miért érdemes továbbolvasni.' },
      { icon: CheckSquare,       title: 'Előnyök röviden',   desc: 'Áttekinthetően, miért téged érdemes választani.' },
      { icon: FileText,          title: 'Űrlap',             desc: 'Ajánlatkérő vagy feliratkozó űrlap; az adatok e-mailben vagy a CRM-ben érkeznek.' },
      { icon: Star,              title: 'Bizalomépítés',     desc: 'Vélemények, referenciák és partnerlogók a hitelesség érdekében.' },
      { icon: MousePointerClick, title: 'Cselekvésre ösztönző gombok', desc: 'Jól látható gombok az oldal több pontján.' },
      { icon: BarChart2,         title: 'Mérés',             desc: 'Mérőkódok, hogy lásd, hány látogató és érdeklődő érkezik a kampányból.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan készül el?',
    steps: [
      { n: '01', title: 'A cél',               desc: 'Tisztázzuk, mit kell elérnie az oldalnak, és kinek szól.' },
      { n: '02', title: 'Szöveg és felépítés', desc: 'Megírjuk az üzenetet, és megtervezzük, milyen sorrendben jelenjenek meg az információk.' },
      { n: '03', title: 'Dizájn és fejlesztés', desc: 'Elkészítjük az oldalt, beállítjuk az űrlapot és a mérőkódokat.' },
      { n: '04', title: 'Indulás és mérés',     desc: 'Élesítjük az oldalt, és segítünk értelmezni az első eredményeket.' },
    ],
  },
  forWhom: {
    title: 'Mikor van szükséged landing page-re?',
    items: [
      { icon: Megaphone, label: 'Hirdetésekhez',     desc: 'Meta- és Google-kampányokhoz' },
      { icon: Tag,       label: 'Akciókhoz',         desc: 'Szezonális vagy időszakos ajánlatokhoz' },
      { icon: Mail,      label: 'E-mail-kampányhoz', desc: 'Hírlevelek céloldalaként' },
      { icon: Rocket,    label: 'Termékbevezetéshez', desc: 'Új termék vagy szolgáltatás bemutatásához' },
    ],
  },
  pricing: {
    note: 'Az ár a terjedelemtől, a szövegírástól és a szükséges összekötésektől (például CRM vagy hírlevélküldő) függ.',
    cta: 'Ajánlatot kérek',
  },
  faqs: [
    { q: 'Mennyi ideig tart elkészíteni?', a: 'A tartalomtól és a funkcióktól függ. A pontos ütemtervet az elején közösen rögzítjük; sürgős kampánynál erről is egyeztetünk.' },
    { q: 'Kell hozzá teljes weboldal?', a: 'Nem. A landing page önálló oldalként is működik.' },
    { q: 'Beállítjátok a Meta és Google mérőkódokat?', a: 'Igen, kérésre beállítjuk a szükséges mérőkódokat.' },
    { q: 'Hova kerülnek az érdeklődők adatai?', a: 'E-mailben kapod meg őket, vagy igény szerint egyenesen a CRM rendszerbe kerülnek.' },
  ],
}

export const enMeta = {
  title: 'Landing page | Weboldalas',
  description: 'A page built for a single goal, for ads and campaigns: quote requests, sign-ups or purchases.',
}

export const en: ServicePageData = {
  shape: 'target',
  kind: 'landing',
  icon: LayoutTemplate,
  title: 'Landing page',
  hero: {
    badge: 'Landing page',
    headline: 'One page, one goal: more leads',
    accent: 'more leads',
    sub: 'A landing page is built for a single goal, such as a quote request, a sign-up or buying a product. It is mostly used for ads and campaigns, because every part of it supports that one step.',
    features: [
      'A clear message and visible buttons',
      'Fast loading, designed for mobile',
      'A form to capture leads',
      'Tracking codes (Google Analytics, Meta Pixel)',
      'Design that matches your campaign',
      'Variants that are easy to test',
    ],
  },
  whatYouGet: {
    title: 'What does the landing page include?',
    items: [
      { icon: Target,            title: 'A strong opening',     desc: 'The first screen makes it clear what you offer and why it\'s worth reading on.' },
      { icon: CheckSquare,       title: 'Benefits at a glance', desc: 'A clear summary of why people should choose you.' },
      { icon: FileText,          title: 'Form',                 desc: 'A quote request or sign-up form; the details arrive by email or in your CRM.' },
      { icon: Star,              title: 'Building trust',       desc: 'Reviews, references and partner logos for credibility.' },
      { icon: MousePointerClick, title: 'Call-to-action buttons', desc: 'Clearly visible buttons at several points on the page.' },
      { icon: BarChart2,         title: 'Tracking',             desc: 'Tracking codes so you can see how many visitors and leads the campaign brings in.' },
    ],
  },
  howItWorks: {
    title: 'How does it come together?',
    steps: [
      { n: '01', title: 'The goal',               desc: 'We clarify what the page needs to achieve and who it is for.' },
      { n: '02', title: 'Copy and structure',     desc: 'We write the message and plan the order in which the information appears.' },
      { n: '03', title: 'Design and development', desc: 'We build the page and set up the form and tracking codes.' },
      { n: '04', title: 'Launch and tracking',    desc: 'We put the page live and help you make sense of the first results.' },
    ],
  },
  forWhom: {
    title: 'When do you need a landing page?',
    items: [
      { icon: Megaphone, label: 'For ads',             desc: 'For Meta and Google campaigns' },
      { icon: Tag,       label: 'For promotions',      desc: 'For seasonal or limited-time offers' },
      { icon: Mail,      label: 'For email campaigns', desc: 'As the destination for your newsletters' },
      { icon: Rocket,    label: 'For product launches', desc: 'To introduce a new product or service' },
    ],
  },
  pricing: {
    note: 'The price depends on the length of the page, the copywriting and the integrations you need (such as a CRM or newsletter tool).',
    cta: 'Request a quote',
  },
  faqs: [
    { q: 'How long does it take to build?', a: 'It depends on the content and features. We agree on a clear schedule at the start; for urgent campaigns, we discuss that too.' },
    { q: 'Do I need a full website as well?', a: 'No. A landing page works perfectly well on its own.' },
    { q: 'Do you set up the Meta and Google tracking codes?', a: 'Yes, we set up the tracking codes you need on request.' },
    { q: 'Where do the leads\' details go?', a: 'You receive them by email, or if you prefer, they go straight into your CRM.' },
  ],
}
