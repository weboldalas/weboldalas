import { LayoutTemplate, Target, CheckSquare, FileText, Star, MousePointerClick, BarChart2, Megaphone, Tag, Mail, Rocket } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Landing page készítés | Weboldalas',
  description: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz: ajánlatkérés, feliratkozás vagy vásárlás.',
}

const data: ServicePageData = {
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

export default function LandingPage() {
  return <ServicePage data={data} />
}
