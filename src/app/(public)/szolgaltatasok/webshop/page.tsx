import { ShoppingBag, ShoppingCart, CreditCard, Package, BarChart2, Mail, Smartphone, Gift, Tag, Leaf, Building2 } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Webshop | Weboldalas',
  description: 'Teljes körű webáruház kisebb vállalkozásoknak. Termékkezelés, kosár, biztonságos fizetés.',
}

const data: ServicePageData = {
  icon: ShoppingBag,
  iconColor: 'violet',
  accentColor: '#a855f7',
  accentGradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  title: 'Webshop',
  subtitle: 'Online értékesítés egyszerűen',
  hero: {
    badge: 'Webshop',
    headline: 'Árulj online — éjjel-nappal, automatikusan',
    sub: 'A webshop lehetővé teszi, hogy a termékeidet akkor is eladja valaki, amikor te alszol. Biztonságos fizetés, egyszerű rendeléskezelés, és minden ami kell.',
    features: [
      'Korlátlan termék feltöltés',
      'Biztonságos online fizetés (SimplePay, Barion)',
      'Automatikus rendelés-visszaigazolás',
      'Készletkezelés',
      'Mobilbarát kosár és pénztár',
      'Admin felület a rendelések kezelésére',
    ],
  },
  whatYouGet: {
    title: 'Mit kapsz a webshoppal?',
    items: [
      { icon: ShoppingCart, title: 'Prémium bolt dizájn',    desc: 'Konverzióra optimalizált termékoldalak és kosárfolyamat.' },
      { icon: CreditCard,   title: 'Biztonságos fizetés',   desc: 'SimplePay, Barion vagy bankkártyás fizetés integrálva.' },
      { icon: Package,      title: 'Rendeléskezelés',        desc: 'Átlátható admin felület — egy helyen kezeled az összes rendelést.' },
      { icon: BarChart2,    title: 'Készletkezelés',         desc: 'Automatikusan figyeli a raktárkészletet és jelzi ha elfogy a termék.' },
      { icon: Mail,         title: 'Automatikus emailek',    desc: 'Rendelés-visszaigazolás, szállítási értesítő — automatikusan.' },
      { icon: Smartphone,   title: 'Mobilbarát vásárlás',   desc: 'Telefonról is tökéletes vásárlási élmény.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan épül fel a webshopod?',
    steps: [
      { n: '01', title: 'Terméklista',          desc: 'Összegyűjtjük a termékeid adatait, képeit és leírásait.' },
      { n: '02', title: 'Fizetési integráció',  desc: 'Beállítjuk a fizetési szolgáltatót és teszteljük a folyamatot.' },
      { n: '03', title: 'Design és tartalom',   desc: 'Az áruházidat a márkád stílusához igazítjuk.' },
      { n: '04', title: 'Élesítés és oktatás',  desc: 'Átadjuk a webshopot és megtanítjuk kezelni.' },
    ],
  },
  forWhom: {
    title: 'Kinek való a webshop?',
    items: [
      { icon: Gift,      label: 'Ajándékboltok', desc: 'Egyedi és kézműves termékek online értékesítése' },
      { icon: Tag,       label: 'Ruházat',        desc: 'Ruha, kiegészítők, divatcikkek' },
      { icon: Leaf,      label: 'Bio termékek',   desc: 'Kézműves élelmiszer, kozmetikum' },
      { icon: Building2, label: 'Gyártók',        desc: 'Saját termék, B2B és B2C értékesítés' },
    ],
  },
  pricing: {
    title: 'Webshop árazás',
    note: '250.000 Ft-tól egyszeri fizetéssel. A termékek számától és a funkciók összetettségétől függően személyre szabott ajánlatot adunk.',
    cta: 'Ajánlatot kérek a webshophoz',
  },
  faqs: [
    { q: 'Hány terméket tölthetek fel?', a: 'Korlátlan számú terméket. Az árazás nem a termékek számától függ.' },
    { q: 'Milyen fizetési módokat lehet beállítani?', a: 'SimplePay, Barion, bankkártyás fizetés, utánvét és banki átutalás — tetszőleges kombináció.' },
    { q: 'Kell külön szerverre előfizetni?', a: 'Nem, mindent mi intézünk. Tárhely, SSL, domain — minden benne van a csomagban.' },
    { q: 'Kezelhetem a rendeléseket mobilról?', a: 'Igen, az admin felület mobilbarát, bármikor, bárhonnan elérhető.' },
  ],
}

export default function WebshopPage() {
  return <ServicePage data={data} />
}
