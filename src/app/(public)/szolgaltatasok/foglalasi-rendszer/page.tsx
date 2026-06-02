import { Calendar, Mail, Bell, RefreshCw, Clock, BarChart2, Scissors, Heart, Home, Utensils } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Ingyenes foglalási rendszer | Weboldalas',
  description: 'Online időpontfoglalás ingyenesen minden weboldalhoz. Automatikus visszaigazolás, naptár szinkron.',
}

const data: ServicePageData = {
  icon: Calendar,
  iconColor: 'emerald',
  accentColor: '#10b981',
  accentGradient: 'linear-gradient(135deg, #059669, #10b981)',
  title: 'Foglalási rendszer',
  subtitle: 'Automatikus időpontkezelés',
  hero: {
    badge: 'Ingyenes foglalási rendszer',
    headline: 'Kevesebb telefonhívás, több lefoglalt időpont',
    sub: 'Az online foglalási rendszer automatikusan kezeli az egyeztetést. Az ügyfeleid bármikor, bárhonnan foglalhatnak — te pedig a munkádra koncentrálhatsz.',
    features: [
      '0 Ft extra havidíj — minden weboldalhoz jár',
      'Automatikus visszaigazolás emailben',
      'Emlékeztető email/SMS az ügyfélnek',
      'Naptár szinkronizáció (Google Naptár)',
      'Mobilbarát foglalási felület',
      'Saját rendelkezési időkorlátok beállítása',
    ],
  },
  whatYouGet: {
    title: 'Mire képes a foglalási rendszer?',
    items: [
      { icon: Calendar,   title: 'Online naptár',              desc: 'Az ügyfeleid valós időben látják a szabad időpontokat és rögtön foglalhatnak.' },
      { icon: Mail,       title: 'Automatikus visszaigazolás', desc: 'Minden foglalás után azonnal küldünk visszaigazolót az ügyfélnek és neked.' },
      { icon: Bell,       title: 'Emlékeztető értesítések',    desc: 'Automatikus emlékeztető SMS/email, hogy ne feledkezzenek el a foglalásukról.' },
      { icon: RefreshCw,  title: 'Google Naptár szinkron',     desc: 'A foglalások automatikusan megjelennek a naptáradban.' },
      { icon: Clock,      title: 'Nyitvatartás kezelés',       desc: 'Beállíthatod a munkaidődet, szabadnapjaidat és szüneteket.' },
      { icon: BarChart2,  title: 'Foglalás statisztikák',      desc: 'Lásd hány foglalásod volt, mikor a csúcsidő és ki volt a legtöbbször.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan foglal az ügyfeled?',
    steps: [
      { n: '01', title: 'Megnyitja a weboldalad', desc: 'Az ügyfeled rátalál a weboldaladra — Google, közösségi média, ajánlás alapján.' },
      { n: '02', title: 'Kiválaszt időpontot',    desc: 'Megnézi a szabad időpontokat és kiválasztja ami neki megfelel.' },
      { n: '03', title: 'Megadja adatait',         desc: 'Nevet, emailt, telefont ad meg és elküldi a foglalást.' },
      { n: '04', title: 'Kap visszaigazolást',     desc: 'Automatikusan kap visszaigazolót és emlékeztetőt. Te is értesülsz.' },
    ],
  },
  forWhom: {
    title: 'Kinek a leghasznosabb?',
    items: [
      { icon: Scissors, label: 'Szépségipar', desc: 'Fodrász, körömstúdió, masszőr' },
      { icon: Heart,    label: 'Egészségügy', desc: 'Orvos, fogorvos, fizioterapeuta' },
      { icon: Home,     label: 'Szállásadók', desc: 'Szoba, apartman, panzió foglalás' },
      { icon: Utensils, label: 'Éttermek',    desc: 'Asztalfoglalás vendéglátáshoz' },
    ],
  },
  pricing: {
    title: 'Ingyenes — minden weboldalhoz',
    note: 'A foglalási rendszer 0 Ft extra havidíjjal jár minden csomagunkhoz. Nem kell külön fizetni érte.',
    cta: 'Kérem a foglalási rendszert',
  },
  faqs: [
    { q: 'Valóban ingyenes a foglalási rendszer?', a: 'Igen, minden weboldalhoz díjmentesen adjuk. Nem kell külön szoftvert előfizetni, mi integráljuk.' },
    { q: 'Tud SMS emlékeztetőt küldeni?', a: 'Igen, SMS és email emlékeztetőt is tud küldeni az ügyfélnek a foglalás előtt.' },
    { q: 'Össze lehet kötni a Google Naptárral?', a: 'Igen, a foglalások automatikusan szinkronizálódnak a Google Naptárral.' },
    { q: 'Mi van ha le kell mondani egy foglalást?', a: 'Az ügyfél lemondhat online, te is törölheted az adminból. Mindkét fél kap értesítést.' },
  ],
}

export default function FoglalasiRendszerPage() {
  return <ServicePage data={data} />
}
