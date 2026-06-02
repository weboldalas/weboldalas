import { Users, LayoutList, FileText, Banknote, ListChecks, Phone, BarChart2, Building2, Wrench, Globe } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'CRM rendszer | Weboldalas',
  description: 'Ügyfelek, ajánlatok, feladatok és pénzügyek egy helyen. Értékesítési pipeline kisebb vállalkozásoknak.',
}

const data: ServicePageData = {
  icon: Users,
  iconColor: 'rose',
  accentColor: '#f43f5e',
  accentGradient: 'linear-gradient(135deg, #e11d48, #f43f5e)',
  title: 'CRM rendszer',
  subtitle: 'Minden ügyfeled, egy helyen',
  hero: {
    badge: 'CRM rendszer',
    headline: 'Ne veszíts el egyetlen ügyfelet sem',
    sub: 'A CRM segít nyomon követni az érdeklődőket, ajánlatokat és ügyfeleket. Tudni fogod pontosan, hol tart minden értékesítés — és mit kell tenned a következő lépésben.',
    features: [
      'Értékesítési pipeline (Kanban tábla)',
      'Érdeklődők és ügyfelek kezelése',
      'Ajánlat készítés és email küldés',
      'Pénzügyi nyilvántartás',
      'Feladatkezelő határidőkkel',
      'Hívásnapló és előzmények',
    ],
  },
  whatYouGet: {
    title: 'Mit tud a CRM?',
    items: [
      { icon: LayoutList,  title: 'Lead pipeline',    desc: 'Kanban táblán látod hol tart minden érdeklődő az értékesítési folyamatban.' },
      { icon: FileText,    title: 'Ajánlatkezelés',   desc: 'Ajánlatot készítesz, emailben küldesz, az ügyfél elfogad — automatikusan.' },
      { icon: Banknote,    title: 'Pénzügy',          desc: 'Befizetések, részletek, előfizetések — minden egy helyen nyomon követhető.' },
      { icon: ListChecks,  title: 'Feladatkezelő',    desc: 'Prioritásos feladatlista határidőkkel és emlékeztetőkkel.' },
      { icon: Phone,       title: 'Hívásnapló',       desc: 'Rögzítheted a hívások eredményét, a következő lépést és visszahívási dátumot.' },
      { icon: BarChart2,   title: 'Dashboard',        desc: 'Egy pillantásra látod a legfontosabb mutatókat: pipeline, MRR, feladatok.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan kerülnek be az ügyfelek?',
    steps: [
      { n: '01', title: 'Érdeklődő érkezik',   desc: 'A weboldalad kontakt formján vagy hideg hívás után bekerül a CRM-be.' },
      { n: '02', title: 'Pipeline kezelés',    desc: 'Végigvezeted az értékesítési folyamaton — kapcsolatfelvételtől az ajánlatig.' },
      { n: '03', title: 'Ajánlat küldés',      desc: 'Elkészíted az ajánlatot, emailben kiküldöd, az ügyfél online elfogadja.' },
      { n: '04', title: 'Ügyfél és pénzügy',  desc: 'Elfogadás után automatikusan ügyfél lesz, és létrejönnek a pénzügyi tételek.' },
    ],
  },
  forWhom: {
    title: 'Kinek ajánljuk a CRM-et?',
    items: [
      { icon: Building2, label: 'Vállalkozásoknak', desc: 'Akiknek sok érdeklődőjük és ügyfelük van' },
      { icon: Wrench,    label: 'Szakembereknek',   desc: 'Akik ajánlatokat adnak ki rendszeresen' },
      { icon: Globe,     label: 'Ügynökségeknek',   desc: 'Akik projekteket kezelnek és számláznak' },
      { icon: Phone,     label: 'Sales csapatoknak',desc: 'Telefonos és emailes értékesítéshez' },
    ],
  },
  pricing: {
    title: 'CRM bevezetési árazás',
    note: 'A CRM rendszert egyedi igények alapján állítjuk be. Ingyenes demo és konzultáció elérhető.',
    cta: 'Ingyenes CRM bemutatót kérek',
  },
  faqs: [
    { q: 'Ez egy saját CRM rendszer?', a: 'Igen, a Weboldalas saját fejlesztésű CRM-je, amit a weboldalas értékesítési folyamatra optimalizáltunk.' },
    { q: 'Kell hozzá weboldal?', a: 'Nem szükséges. A CRM önállóan is működik, de ha van weboldalad, a kapcsolati formok automatikusan belekerülnek.' },
    { q: 'Több felhasználó is használhatja?', a: 'Igen, csapatoknak is alkalmas. Felhasználói jogosultságok is beállíthatók.' },
    { q: 'Milyen eszközökre elérhető?', a: 'Böngészőből elérhető — PC-n, tableten, mobilon egyaránt.' },
  ],
}

export default function CrmPage() {
  return <ServicePage data={data} />
}
