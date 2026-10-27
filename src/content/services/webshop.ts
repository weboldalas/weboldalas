import { ShoppingBag, ShoppingCart, CreditCard, Package, BarChart2, Mail, Smartphone, Gift, Tag, Leaf, Building2 } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'Webshop készítés | Weboldalas',
  description: 'Webshop induló boltoknak, márkáknak és nagykereskedőknek: termékek, kosár, online fizetés és rendeléskezelés egy rendszerben.',
}

export const hu: ServicePageData = {
  shape: 'cart',
  kind: 'shop',
  icon: ShoppingBag,
  title: 'Webshop',
  hero: {
    badge: 'Webshop',
    headline: 'Árulj online, a nap bármely szakában',
    accent: 'online',
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

export const enMeta = {
  title: 'Webshop | Weboldalas',
  description: 'Webshops for new shops, brands and wholesalers: products, basket, online payment and order management in one system.',
}

export const en: ServicePageData = {
  shape: 'cart',
  kind: 'shop',
  icon: ShoppingBag,
  title: 'Webshop',
  hero: {
    badge: 'Webshop',
    headline: 'Sell online, at any time of day',
    accent: 'online',
    sub: 'A webshop is an online store: customers browse your products, add them to the basket and pay, while you see and manage the orders in an admin panel. We build and set up the whole thing.',
    features: [
      'Products with categories, images and variants',
      'Online card payments (e.g. SimplePay, Barion)',
      'Automatic emails to customers',
      'Stock tracking',
      'Easy shopping on mobile too',
      'Admin panel for orders',
    ],
  },
  whatYouGet: {
    title: 'What do you get with your webshop?',
    items: [
      { icon: ShoppingCart, title: 'Smooth shopping',         desc: 'Clear product pages and a simple checkout, so purchases don\'t stall halfway.' },
      { icon: CreditCard,   title: 'Online payment',          desc: 'Card payments through the provider of your choice; cash on delivery and bank transfer can be set up too.' },
      { icon: Package,      title: 'Order management',        desc: 'Every order in one place: status, shipping and customer details.' },
      { icon: BarChart2,    title: 'Stock management',        desc: 'The system tracks your stock and lets you know when a product is running low.' },
      { icon: Mail,         title: 'Automatic notifications', desc: 'Customers get emails about their order and its status, so you don\'t have to write them yourself.' },
      { icon: Smartphone,   title: 'Mobile-friendly',         desc: 'Your webshop is just as easy to use on a phone as on a computer.' },
    ],
  },
  howItWorks: {
    title: 'How is your webshop built?',
    steps: [
      { n: '01', title: 'Assessment',  desc: 'We go through your product range, shipping and payment options, and the systems your shop needs to connect to.' },
      { n: '02', title: 'Design',      desc: 'We plan the structure and design of the webshop to match your brand.' },
      { n: '03', title: 'Development', desc: 'We build the shop, set up payment and shipping, and help you upload your products.' },
      { n: '04', title: 'Launch',      desc: 'We test the full purchase process, put the webshop live and show you how to run it.' },
    ],
  },
  forWhom: {
    title: 'Who is a webshop for?',
    items: [
      { icon: Gift,      label: 'New shops',     desc: 'Handmade, gift and unique products' },
      { icon: Tag,       label: 'Brands',        desc: 'Fashion, lifestyle, cosmetics' },
      { icon: Leaf,      label: 'Wholesalers',   desc: 'Large product catalogues, B2B sales' },
      { icon: Building2, label: 'Manufacturers and large companies', desc: 'Own products, B2B and B2C, connected to your existing systems' },
    ],
  },
  pricing: {
    note: 'The price depends on the number of products, the features and the systems the webshop needs to connect to (such as invoicing or warehouse software).',
    cta: 'Request a quote',
  },
  faqs: [
    { q: 'Which payment methods are available?', a: 'Card payments (such as SimplePay or Barion), cash on delivery and bank transfer, in any combination.' },
    { q: 'Can it connect to invoicing or warehouse software?', a: 'Yes, the webshop can be connected to invoicing, warehouse or ERP systems as needed. The quote states exactly what it connects to.' },
    { q: 'Do I need to sort out hosting?', a: 'No. We take care of hosting, the domain and the security certificate.' },
    { q: 'Can I manage orders from my phone?', a: 'Yes, the admin panel is easy to use on a phone too.' },
  ],
}
