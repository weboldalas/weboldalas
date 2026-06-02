import { LayoutTemplate, Target, CheckSquare, FileText, Star, MousePointerClick, BarChart2, Megaphone, Tag, Mail, Rocket } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Landing Page | Weboldalas',
  description: 'Konverzióra optimalizált landing page hirdetésekhez, kampányokhoz és termékbevezetőkhöz.',
}

const data: ServicePageData = {
  icon: LayoutTemplate,
  iconColor: 'amber',
  accentColor: '#f59e0b',
  accentGradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
  title: 'Landing Page',
  subtitle: 'Egy cél, egy oldal, maximális konverzió',
  hero: {
    badge: 'Landing Page',
    headline: 'Egyetlen oldal, ami eladja a szolgáltatásodat',
    sub: 'A landing page egy célra épített oldal — legyen az ajánlatkérés, feliratkozás vagy vásárlás. Hirdetésekhez és kampányokhoz ideális.',
    features: [
      'Erős CTA gombok és conversion elemek',
      'Mobilbarát, gyors betöltés',
      'Lead capture form (ajánlatkérő, feliratkozás)',
      'A/B tesztelésre alkalmas struktúra',
      'Analytics integráció (Google, Meta Pixel)',
      'Kampányspecifikus dizájn',
    ],
  },
  whatYouGet: {
    title: 'Mit tartalmaz a landing page?',
    items: [
      { icon: Target,           title: 'Erős headline és hook',  desc: 'Az első másodpercben megragadja a figyelmet és elmagyarázza az ajánlatot.' },
      { icon: CheckSquare,      title: 'Benefit lista',          desc: 'Vizuálisan kiemelve, miért érdemes téged választani.' },
      { icon: FileText,         title: 'Lead capture form',      desc: 'Ajánlatkérő vagy feliratkozási form — az érdeklődő adatai bekerülnek a CRM-be.' },
      { icon: Star,             title: 'Social proof',           desc: 'Vélemények, logók és referenciák a bizalom növeléséhez.' },
      { icon: MousePointerClick,title: 'Erős CTA blokkok',       desc: 'Több stratégiai helyen elhelyezett hívásra cselekvő gombok.' },
      { icon: BarChart2,        title: 'Tracking integráció',    desc: 'Google Analytics, Meta Pixel beállítva a kampány eredmény méréséhez.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan készül el?',
    steps: [
      { n: '01', title: 'Kampány cél',         desc: 'Megbeszéljük, mit szeretnél elérni — ajánlatkérés, feliratkozás, vásárlás.' },
      { n: '02', title: 'Szöveg és struktúra', desc: 'Megírjuk a headline-okat, benefit listákat és CTA szövegeket.' },
      { n: '03', title: 'Dizájn és fejlesztés',desc: 'Elkészítjük a landert és beállítjuk a form integráció és trackingeket.' },
      { n: '04', title: 'Élő és mérjük',       desc: '3–5 nap alatt kész. Beállítjuk a hirdetési fiókodhoz és mérjük az eredményeket.' },
    ],
  },
  forWhom: {
    title: 'Mikor van szükséged landing page-re?',
    items: [
      { icon: Megaphone, label: 'Hirdetésekhez',      desc: 'Meta, Google Ads kampányokhoz' },
      { icon: Tag,       label: 'Akcióhoz',           desc: 'Szezonális vagy időszakos akciókhoz' },
      { icon: Mail,      label: 'Email kampányhoz',   desc: 'Hírlevél kampány céloldalaként' },
      { icon: Rocket,    label: 'Termékbevezetőhöz', desc: 'Új termék vagy szolgáltatás bevezetéséhez' },
    ],
  },
  pricing: {
    title: 'Landing page árazás',
    note: '80.000 Ft-tól egyszeri fizetéssel. A terjedelem és a funkciók alapján személyre szabott ajánlatot adunk.',
    cta: 'Landing page ajánlatot kérek',
  },
  faqs: [
    { q: 'Mennyi ideig tart elkészíteni?', a: 'Általában 3–5 munkanap. Ha sürgős, gyorsabb átfutást is tudunk vállalni.' },
    { q: 'Kell hozzá teljes weboldal?', a: 'Nem. A landing page önálló oldal lehet, nem kell hozzá meglévő weboldal.' },
    { q: 'Beállítjátok a Meta és Google Pixelt is?', a: 'Igen, kérésre beállítjuk a szükséges tracking kódokat.' },
    { q: 'Az érdeklődők adatai hova kerülnek?', a: 'A form kitöltői automatikusan bekerülnek a CRM rendszerbe, ahol nyomon követheted őket.' },
  ],
}

export default function LandingPage() {
  return <ServicePage data={data} />
}
