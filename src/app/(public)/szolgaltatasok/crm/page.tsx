import { Users, LayoutList, FileText, Banknote, ListChecks, Phone, BarChart2, Building2, Briefcase, Globe } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'CRM rendszer | Weboldalas',
  description: 'Ügyfélkezelő rendszer: érdeklődők, ajánlatok, ügyfelek és feladatok egy helyen, a céged folyamataihoz igazítva.',
}

const data: ServicePageData = {
  shape: 'funnel',
  kind: 'crm',
  icon: Users,
  title: 'CRM rendszer',
  hero: {
    badge: 'CRM rendszer',
    headline: 'Ne veszíts el egyetlen ügyfelet sem',
    sub: 'A CRM egy ügyfélkezelő rendszer: egy helyen látod az érdeklődőket, az ajánlatokat, az ügyfeleket és a teendőket. Így semmi nem csúszik el, és mindig tudod, kivel mi a következő lépés.',
    features: [
      'Az értékesítés állása egy táblán',
      'Érdeklődők és ügyfelek adatai egy helyen',
      'Ajánlatkészítés és -küldés',
      'Feladatok határidővel',
      'Hívások és előzmények rögzítése',
      'A céged folyamataihoz igazítva',
    ],
  },
  whatYouGet: {
    title: 'Mit tud a CRM?',
    items: [
      { icon: LayoutList, title: 'Értékesítési tábla', desc: 'Oszlopokba rendezve látod, melyik érdeklődő hol tart: első megkeresés, ajánlat, döntés.' },
      { icon: FileText,   title: 'Ajánlatok',          desc: 'Ajánlatot készítesz, e-mailben elküldöd, és az ügyfél online elfogadhatja.' },
      { icon: Banknote,   title: 'Pénzügy',            desc: 'Befizetések, részletek és visszatérő díjak egy helyen követhetők.' },
      { icon: ListChecks, title: 'Feladatok',          desc: 'Teendők határidővel és emlékeztetővel, hogy semmi ne maradjon el.' },
      { icon: Phone,      title: 'Hívásnapló',         desc: 'Rögzítheted a hívások eredményét, a következő lépést és a visszahívás időpontját.' },
      { icon: BarChart2,  title: 'Áttekintő',          desc: 'Egy pillantásra látod a legfontosabbakat: nyitott ajánlatok, teendők, bevételek.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan kerülnek be az ügyfelek?',
    steps: [
      { n: '01', title: 'Érdeklődő érkezik', desc: 'A weboldal űrlapjáról automatikusan, vagy telefonos megkeresés után kézzel kerül be.' },
      { n: '02', title: 'Követés',           desc: 'Végigkíséred az értékesítésen, az első kapcsolatfelvételtől az ajánlatig.' },
      { n: '03', title: 'Ajánlat',           desc: 'Elkészíted és elküldöd az ajánlatot, az ügyfél online elfogadja.' },
      { n: '04', title: 'Ügyfél lesz',       desc: 'Elfogadás után ügyfélként kezeled tovább, a pénzügyi tételekkel együtt.' },
    ],
  },
  forWhom: {
    title: 'Kinek ajánljuk a CRM-et?',
    items: [
      { icon: Building2, label: 'KKV-knak',          desc: 'Akiknek sok érdeklődőjük és ügyfelük van' },
      { icon: Briefcase, label: 'Nagyvállalatoknak', desc: 'Egyedi folyamatokhoz, több csapathoz' },
      { icon: Globe,     label: 'Ügynökségeknek',    desc: 'Akik projekteket kezelnek és számláznak' },
      { icon: Phone,     label: 'Sales csapatoknak', desc: 'Telefonos és e-mailes értékesítéshez' },
    ],
  },
  pricing: {
    note: 'Az ár a felhasználók számától, a szükséges funkcióktól és az összekötésektől (weboldal, e-mail, számlázó) függ.',
    cta: 'Konzultációt kérek',
  },
  faqs: [
    { q: 'Ez saját fejlesztésű rendszer?', a: 'Igen, saját fejlesztésű CRM, amit a cégetek folyamataihoz igazítunk.' },
    { q: 'Kell hozzá weboldal?', a: 'Nem. A CRM önállóan is működik, de ha van weboldalad, az űrlapokról érkező érdeklődők automatikusan bekerülnek.' },
    { q: 'Többen is használhatják?', a: 'Igen, csapatoknak is alkalmas, felhasználónként beállítható jogosultságokkal.' },
    { q: 'Milyen eszközön érhető el?', a: 'Böngészőből, számítógépen, tableten és telefonon egyaránt.' },
  ],
}

export default function CrmPage() {
  return <ServicePage data={data} />
}
