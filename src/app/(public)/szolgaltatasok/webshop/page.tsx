import { ShoppingBag, ShoppingCart, CreditCard, Package, BarChart2, Mail, Smartphone, Gift, Tag, Leaf, Building2 } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Webshop készítés | Weboldalas',
  description: 'Webshop induló boltoknak, márkáknak és nagykereskedőknek: termékek, kosár, online fizetés és rendeléskezelés egy rendszerben.',
}

const data: ServicePageData = {
  shape: 'cart',
  kind: 'shop',
  icon: ShoppingBag,
  title: 'Webshop',
  hero: {
    badge: 'Webshop',
    headline: 'Árulj online, a nap bármely szakában',
    sub: 'A webshop egy online bolt: a vásárlók böngészik a termékeidet, kosárba teszik és kifizetik őket, te pedig egy kezelőfelületen látod és intézed a rendeléseket. Az egészet megépítjük és beállítjuk.',
    features: [
      'Termékek kategóriákkal, képekkel, változatokkal',
      'Online bankkártyás fizetés (pl. SimplePay, Barion)',
      'Automatikus e-mail a vásárlónak',
      'Készletnyilvántartás',
      'Kényelmes vásárlás telefonon is',
      'Kezelőfelület a rendelésekhez',
    ],
  },
  whatYouGet: {
    title: 'Mit kapsz a webshoppal?',
    items: [
      { icon: ShoppingCart, title: 'Átgondolt vásárlás',      desc: 'Áttekinthető termékoldalak és egyszerű pénztár, hogy a vásárlás ne akadjon el félúton.' },
      { icon: CreditCard,   title: 'Online fizetés',          desc: 'Bankkártyás fizetés a választott szolgáltatón keresztül; utánvét és átutalás is beállítható.' },
      { icon: Package,      title: 'Rendeléskezelés',         desc: 'Minden rendelés egy helyen: állapot, szállítás és a vásárló adatai.' },
      { icon: BarChart2,    title: 'Készletkezelés',          desc: 'A rendszer követi a készletet, és jelzi, ha egy termék elfogyóban van.' },
      { icon: Mail,         title: 'Automatikus értesítések', desc: 'A vásárló e-mailt kap a rendelésről és annak állapotáról, neked nem kell külön írnod.' },
      { icon: Smartphone,   title: 'Mobilbarát',              desc: 'A webshop telefonon is ugyanolyan kényelmes, mint számítógépen.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan épül fel a webshopod?',
    steps: [
      { n: '01', title: 'Felmérés',     desc: 'Átnézzük a termékkört, a szállítási és fizetési módokat, és hogy milyen rendszerekhez kell kapcsolódnia a boltnak.' },
      { n: '02', title: 'Tervezés',     desc: 'Megtervezzük a webshop felépítését és dizájnját a márkádhoz igazítva.' },
      { n: '03', title: 'Fejlesztés',   desc: 'Megépítjük a boltot, beállítjuk a fizetést és a szállítást, és segítünk feltölteni a termékeket.' },
      { n: '04', title: 'Indulás',      desc: 'Végigteszteljük a teljes vásárlást, élesítjük a webshopot, és megmutatjuk a kezelését.' },
    ],
  },
  forWhom: {
    title: 'Kinek való a webshop?',
    items: [
      { icon: Gift,      label: 'Induló boltoknak',  desc: 'Kézműves, ajándék és egyedi termékek' },
      { icon: Tag,       label: 'Márkáknak',         desc: 'Divat, lifestyle, kozmetikum' },
      { icon: Leaf,      label: 'Nagykereskedőknek', desc: 'Nagy termékkatalógus, B2B értékesítés' },
      { icon: Building2, label: 'Gyártóknak és nagyvállalatoknak', desc: 'Saját termék, B2B és B2C, meglévő rendszerekhez kötve' },
    ],
  },
  pricing: {
    note: 'Az ár a termékek számától, a funkcióktól és attól függ, milyen rendszerekhez (például számlázóhoz vagy raktárhoz) kell kapcsolódnia a webshopnak.',
    cta: 'Ajánlatot kérek',
  },
  faqs: [
    { q: 'Milyen fizetési módok lehetnek?', a: 'Bankkártyás fizetés (például SimplePay vagy Barion), utánvét és banki átutalás, tetszőleges kombinációban.' },
    { q: 'Összeköthető számlázóval vagy raktárrendszerrel?', a: 'Igen, a webshop igény szerint összeköthető számlázó-, raktár- vagy ERP rendszerrel. Az ajánlatban pontosan rögzítjük, mihez kapcsolódik.' },
    { q: 'Nekem kell tárhelyet intéznem?', a: 'Nem. A tárhelyet, a domaint és a biztonsági tanúsítványt mi intézzük.' },
    { q: 'Mobilról is kezelhetem a rendeléseket?', a: 'Igen, a kezelőfelület telefonról is kényelmesen használható.' },
  ],
}

export default function WebshopPage() {
  return <ServicePage data={data} />
}
