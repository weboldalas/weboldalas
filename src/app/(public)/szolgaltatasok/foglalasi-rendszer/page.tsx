import { Calendar, Mail, Bell, RefreshCw, Clock, BarChart2, Scissors, Heart, Home, Utensils } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Online foglalási rendszer | Weboldalas',
  description: 'Online időpont-, asztal- és szobafoglalás a weboldaladba építve: automatikus visszaigazolás, emlékeztető és naptár-összekötés.',
}

const data: ServicePageData = {
  shape: 'calendar',
  kind: 'booking',
  icon: Calendar,
  title: 'Foglalási rendszer',
  hero: {
    badge: 'Foglalási rendszer',
    headline: 'Kevesebb telefonhívás, több lefoglalt időpont',
    accent: 'több lefoglalt időpont',
    sub: 'Az online foglalási rendszerrel az ügyfeleid maguk választanak szabad időpontot a weboldaladon, bármikor. A rendszer visszaigazolja a foglalást és emlékeztetőt küld, így kevesebb időt visz el az egyeztetés.',
    features: [
      'Szabad időpontok valós időben',
      'Automatikus visszaigazolás e-mailben',
      'Emlékeztető az ügyfélnek',
      'Összekötés a Google Naptárral',
      'Telefonon is kényelmes',
      'Saját nyitvatartás és szünetek',
    ],
  },
  whatYouGet: {
    title: 'Mire képes a foglalási rendszer?',
    items: [
      { icon: Calendar,  title: 'Online naptár',              desc: 'Az ügyfeleid látják a szabad időpontokat, és azonnal foglalhatnak.' },
      { icon: Mail,      title: 'Automatikus visszaigazolás', desc: 'Minden foglalás után e-mailt kap az ügyfél, és értesítést kapsz te is.' },
      { icon: Bell,      title: 'Emlékeztető',                desc: 'A rendszer a foglalás előtt emlékeztetőt küld, így kevesebb a kimaradó ügyfél.' },
      { icon: RefreshCw, title: 'Naptár-összekötés',          desc: 'A foglalások automatikusan megjelennek a Google Naptáradban.' },
      { icon: Clock,     title: 'Saját beosztás',             desc: 'Beállíthatod a nyitvatartást, a szabadnapokat és a szüneteket.' },
      { icon: BarChart2, title: 'Kimutatások',                desc: 'Látod, mennyi foglalásod volt, és melyek a legforgalmasabb időszakok.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan foglal az ügyfeled?',
    steps: [
      { n: '01', title: 'Megnyitja az oldalt',   desc: 'Rátalál a weboldaladra a Google-ből, a közösségi médiából vagy ajánlás alapján.' },
      { n: '02', title: 'Időpontot választ',     desc: 'Megnézi a szabad időpontokat, és kiválasztja a neki megfelelőt.' },
      { n: '03', title: 'Megadja az adatait',    desc: 'Nevet, e-mail-címet és telefonszámot ad meg, majd elküldi a foglalást.' },
      { n: '04', title: 'Visszaigazolást kap',   desc: 'Automatikusan megkapja a visszaigazolást és később az emlékeztetőt. Te is értesülsz.' },
    ],
  },
  forWhom: {
    title: 'Kinek a leghasznosabb?',
    items: [
      { icon: Scissors, label: 'Szépségipar', desc: 'Fodrász, körömstúdió, masszőr' },
      { icon: Heart,    label: 'Egészségügy', desc: 'Magánrendelőtől a többorvosos klinikáig' },
      { icon: Home,     label: 'Szállásadók', desc: 'Apartmantól a szállodáig' },
      { icon: Utensils, label: 'Éttermek',    desc: 'Egy étteremtől az étteremláncig' },
    ],
  },
  pricing: {
    note: 'Új és meglévő weboldalba is beépíthető. Az ár attól függ, hány szolgáltatást, munkatársat vagy helyszínt kell kezelnie a rendszernek.',
    cta: 'Ajánlatot kérek',
  },
  faqs: [
    { q: 'Meglévő weboldalba is beépíthető?', a: 'Igen, új és meglévő weboldalhoz is hozzáadható.' },
    { q: 'Tud SMS-emlékeztetőt küldeni?', a: 'Az emlékeztető e-mailben megy ki; igény szerint SMS-ben is beállítható.' },
    { q: 'Össze lehet kötni a Google Naptárral?', a: 'Igen, a foglalások automatikusan megjelennek a Google Naptárban.' },
    { q: 'Mi történik, ha le kell mondani egy foglalást?', a: 'Az ügyfél online lemondhatja, te pedig a kezelőfelületen törölheted. Mindkét fél értesítést kap.' },
  ],
}

export default function FoglalasiRendszerPage() {
  return <ServicePage data={data} />
}
