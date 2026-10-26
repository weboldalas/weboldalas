import { Boxes, Warehouse, Truck, Wallet, Factory, Users, PlugZap, Store, Briefcase, Building2 } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'ERP rendszer | Weboldalas',
  description: 'Vállalatirányítási rendszer, ami összeköti a pénzügyet, a raktárat, a beszerzést, az értékesítést, a gyártást és a munkatársakat.',
}

const data: ServicePageData = {
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

export default function ErpPage() {
  return <ServicePage data={data} />
}
