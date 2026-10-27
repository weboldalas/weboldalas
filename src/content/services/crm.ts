import { Users, LayoutList, FileText, Banknote, ListChecks, Phone, BarChart2, Building2, Briefcase, Globe } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'CRM rendszer | Weboldalas',
  description: 'Ügyfélkezelő rendszer: érdeklődők, ajánlatok, ügyfelek és feladatok egy helyen, a céged folyamataihoz igazítva.',
}

export const hu: ServicePageData = {
  shape: 'funnel',
  kind: 'crm',
  icon: Users,
  title: 'CRM rendszer',
  hero: {
    badge: 'CRM rendszer',
    headline: 'Ne veszíts el egyetlen ügyfelet sem',
    accent: 'egyetlen ügyfelet',
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

export const enMeta = {
  title: 'CRM system | Weboldalas',
  description: 'A customer management system: leads, quotes, clients and tasks in one place, tailored to the way your business works.',
}

export const en: ServicePageData = {
  shape: 'funnel',
  kind: 'crm',
  icon: Users,
  title: 'CRM system',
  hero: {
    badge: 'CRM system',
    headline: 'Never lose a single client',
    accent: 'a single client',
    sub: 'A CRM is a customer management system: you see your leads, quotes, clients and to-dos in one place. Nothing slips through the cracks, and you always know the next step with everyone.',
    features: [
      'Your sales pipeline on one board',
      'Lead and client details in one place',
      'Create and send quotes',
      'Tasks with deadlines',
      'Log calls and history',
      'Tailored to the way you work',
    ],
  },
  whatYouGet: {
    title: 'What can the CRM do?',
    items: [
      { icon: LayoutList, title: 'Sales board', desc: 'Columns show where each lead stands: first contact, quote, decision.' },
      { icon: FileText,   title: 'Quotes',      desc: 'Create a quote, send it by email, and your client can accept it online.' },
      { icon: Banknote,   title: 'Finances',    desc: 'Track payments, instalments and recurring fees in one place.' },
      { icon: ListChecks, title: 'Tasks',       desc: 'To-dos with deadlines and reminders, so nothing gets missed.' },
      { icon: Phone,      title: 'Call log',    desc: 'Record the outcome of each call, the next step and when to call back.' },
      { icon: BarChart2,  title: 'Overview',    desc: 'See what matters at a glance: open quotes, to-dos, revenue.' },
    ],
  },
  howItWorks: {
    title: 'How do clients get into the system?',
    steps: [
      { n: '01', title: 'A lead comes in',   desc: 'Automatically from your website form, or added by hand after a phone enquiry.' },
      { n: '02', title: 'Follow-up',         desc: 'You guide them through the sales process, from first contact to quote.' },
      { n: '03', title: 'Quote',             desc: 'You prepare and send the quote, and the client accepts it online.' },
      { n: '04', title: 'They become a client', desc: 'Once accepted, you manage them as a client, together with their financial records.' },
    ],
  },
  forWhom: {
    title: 'Who do we recommend a CRM for?',
    items: [
      { icon: Building2, label: 'SMEs',            desc: 'With lots of leads and clients' },
      { icon: Briefcase, label: 'Large companies', desc: 'For custom processes and multiple teams' },
      { icon: Globe,     label: 'Agencies',        desc: 'That manage projects and invoice clients' },
      { icon: Phone,     label: 'Sales teams',     desc: 'For phone and email sales' },
    ],
  },
  pricing: {
    note: 'The price depends on the number of users, the features you need and the integrations (website, email, invoicing).',
    cta: 'Book a consultation',
  },
  faqs: [
    { q: 'Is this your own system?', a: 'Yes, it is a CRM we develop ourselves and tailor to the way your business works.' },
    { q: 'Do I need a website for it?', a: 'No. The CRM works on its own, but if you have a website, leads from its forms are added automatically.' },
    { q: 'Can several people use it?', a: 'Yes, it works well for teams, with permissions you can set per user.' },
    { q: 'Which devices can I use it on?', a: 'It runs in the browser, on computers, tablets and phones alike.' },
  ],
}
