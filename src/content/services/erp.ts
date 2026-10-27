import { Boxes, Warehouse, Truck, Wallet, Factory, Users, PlugZap, Store, Briefcase, Building2 } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'ERP rendszer | Weboldalas',
  description: 'Vállalatirányítási rendszer, ami összeköti a pénzügyet, a raktárat, a beszerzést, az értékesítést, a gyártást és a munkatársakat.',
}

export const hu: ServicePageData = {
  shape: 'hub',
  kind: 'erp',
  icon: Boxes,
  title: 'ERP rendszer',
  hero: {
    badge: 'ERP rendszer',
    headline: 'Az egész cég egy rendszerben',
    accent: 'egy rendszerben',
    sub: 'Az ERP (vállalatirányítási rendszer) összeköti a cég működésének részeit: pénzügy, raktár, beszerzés, értékesítés, gyártás és munkatársak. Az adatokat egyszer kell rögzíteni, és mindenki ugyanazt a naprakész információt látja.',
    features: [
      'Készlet- és raktárkezelés',
      'Beszerzés és rendelések',
      'Pénzügyi áttekintés és kimutatások',
      'Gyártás és munkafolyamatok követése',
      'Jogosultságok részlegenként',
      'Összekötés a meglévő rendszerekkel',
    ],
  },
  whatYouGet: {
    title: 'Mit fog össze az ERP?',
    items: [
      { icon: Warehouse, title: 'Raktár és készlet',   desc: 'Mindig látod, miből mennyi van, hol van, és mikor kell újrarendelni.' },
      { icon: Truck,     title: 'Beszerzés',           desc: 'Beszállítók, megrendelések és beérkezések követése egy helyen.' },
      { icon: Wallet,    title: 'Pénzügy',             desc: 'Bevételek, kiadások és kintlévőségek áttekinthetően, kimutatásokkal.' },
      { icon: Factory,   title: 'Gyártás és folyamatok', desc: 'Munkafolyamatok, gyártási lépések és határidők követése.' },
      { icon: Users,     title: 'Munkatársak és jogosultságok', desc: 'Mindenki azt látja és szerkeszti, ami a munkájához kell.' },
      { icon: PlugZap,   title: 'Összekötések',        desc: 'Kapcsolat a webshoppal, a számlázóval, a CRM-mel vagy más rendszerrel, hogy semmit ne kelljen kétszer rögzíteni.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan vezetjük be?',
    steps: [
      { n: '01', title: 'Felmérés',     desc: 'Megismerjük, hogyan működik ma a cég: milyen folyamatok, táblázatok és programok vannak használatban.' },
      { n: '02', title: 'Tervezés',     desc: 'Megtervezzük a modulokat és az adatok útját, hogy a rendszer a ti működésetekhez igazodjon, ne fordítva.' },
      { n: '03', title: 'Bevezetés',    desc: 'Lépésenként építjük és vezetjük be a modulokat, és átvesszük a meglévő adatokat.' },
      { n: '04', title: 'Támogatás',    desc: 'Megtanítjuk a munkatársaknak a használatát, és a bevezetés után is mellettetek maradunk.' },
    ],
  },
  forWhom: {
    title: 'Kinek ajánljuk?',
    items: [
      { icon: Factory,   label: 'Gyártó cégeknek',        desc: 'Anyagok, gyártási lépések és készlet egy rendszerben' },
      { icon: Store,     label: 'Kereskedőknek',          desc: 'Raktár, beszerzés és értékesítés összehangolva' },
      { icon: Briefcase, label: 'Szolgáltató cégeknek',   desc: 'Projektek, munkatársak és pénzügyek átlátható követése' },
      { icon: Building2, label: 'Növekvő és nagy cégeknek', desc: 'Ahol a táblázatok és a különálló programok már nem elegendők' },
    ],
  },
  pricing: {
    note: 'Az ár a szükséges moduloktól, a felhasználók számától és az összekötendő rendszerektől függ. Egy jól körülhatárolt modullal is el lehet indulni, és később bővíteni.',
    cta: 'Konzultációt kérek',
  },
  faqs: [
    { q: 'Mi a különbség a CRM és az ERP között?', a: 'A CRM az ügyfelekre és az értékesítésre fókuszál. Az ERP a teljes cég működését fogja össze: raktár, beszerzés, pénzügy, gyártás, munkatársak. A kettő össze is köthető.' },
    { q: 'Kész szoftvert telepítetek, vagy egyedit fejlesztetek?', a: 'A cégetek folyamataihoz igazított rendszert építünk. A felmérés után közösen döntjük el, mi a legjobb megoldás.' },
    { q: 'Át lehet hozni a meglévő adatokat?', a: 'Igen. A bevezetés során átvesszük az adatokat a meglévő táblázatokból és rendszerekből.' },
    { q: 'Meg kell állnia a munkának a bevezetés alatt?', a: 'Nem kell. A modulokat lépésenként vezetjük be, úgy tervezve, hogy a napi munka közben is folytatódhasson.' },
  ],
}

export const enMeta = {
  title: 'ERP system | Weboldalas',
  description: 'A business management system that connects finance, warehouse, purchasing, sales, production and your staff.',
}

export const en: ServicePageData = {
  shape: 'hub',
  kind: 'erp',
  icon: Boxes,
  title: 'ERP system',
  hero: {
    badge: 'ERP system',
    headline: 'Your whole business in one system',
    accent: 'in one system',
    sub: 'An ERP (enterprise resource planning) system connects the parts of your business: finance, warehouse, purchasing, sales, production and staff. Data is entered once, and everyone sees the same up-to-date information.',
    features: [
      'Stock and warehouse management',
      'Purchasing and orders',
      'Financial overview and reports',
      'Production and workflow tracking',
      'Permissions by department',
      'Connects to your existing systems',
    ],
  },
  whatYouGet: {
    title: 'What does the ERP bring together?',
    items: [
      { icon: Warehouse, title: 'Warehouse and stock',   desc: 'Always see what you have, how much, where it is and when to reorder.' },
      { icon: Truck,     title: 'Purchasing',            desc: 'Track suppliers, orders and deliveries in one place.' },
      { icon: Wallet,    title: 'Finance',               desc: 'A clear view of income, expenses and outstanding payments, with reports.' },
      { icon: Factory,   title: 'Production and processes', desc: 'Track workflows, production steps and deadlines.' },
      { icon: Users,     title: 'Staff and permissions', desc: 'Everyone sees and edits what they need for their job.' },
      { icon: PlugZap,   title: 'Integrations',          desc: 'Connections to your webshop, invoicing software, CRM or other systems, so nothing has to be entered twice.' },
    ],
  },
  howItWorks: {
    title: 'How do we roll it out?',
    steps: [
      { n: '01', title: 'Assessment', desc: 'We learn how your business runs today: the processes, spreadsheets and software you use.' },
      { n: '02', title: 'Planning',   desc: 'We plan the modules and how data flows, so the system fits the way you work, not the other way round.' },
      { n: '03', title: 'Rollout',    desc: 'We build and introduce the modules step by step, and migrate your existing data.' },
      { n: '04', title: 'Support',    desc: 'We train your staff to use it, and stay by your side after the rollout.' },
    ],
  },
  forWhom: {
    title: 'Who is it for?',
    items: [
      { icon: Factory,   label: 'Manufacturers',      desc: 'Materials, production steps and stock in one system' },
      { icon: Store,     label: 'Retailers and distributors', desc: 'Warehouse, purchasing and sales working together' },
      { icon: Briefcase, label: 'Service companies',  desc: 'Clear tracking of projects, staff and finances' },
      { icon: Building2, label: 'Growing and large companies', desc: 'Where spreadsheets and separate programs are no longer enough' },
    ],
  },
  pricing: {
    note: 'The price depends on the modules you need, the number of users and the systems to connect. You can start with one well-defined module and expand later.',
    cta: 'Book a consultation',
  },
  faqs: [
    { q: 'What is the difference between a CRM and an ERP?', a: 'A CRM focuses on clients and sales. An ERP brings the whole business together: warehouse, purchasing, finance, production and staff. The two can also be connected.' },
    { q: 'Do you install ready-made software or build a custom one?', a: 'We build a system tailored to your processes. After the assessment, we decide together on the best solution.' },
    { q: 'Can my existing data be brought over?', a: 'Yes. During the rollout, we migrate data from your existing spreadsheets and systems.' },
    { q: 'Does work have to stop during the rollout?', a: 'No. We introduce the modules step by step, planned so that day-to-day work can carry on.' },
  ],
}
