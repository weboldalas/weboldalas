import { Calendar, Mail, Bell, RefreshCw, Clock, BarChart2, Scissors, Heart, Home, Utensils } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'Online foglalási rendszer | Weboldalas',
  description: 'Online időpont-, asztal- és szobafoglalás a weboldaladba építve: automatikus visszaigazolás, emlékeztető és naptár-összekötés.',
}

export const hu: ServicePageData = {
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

export const enMeta = {
  title: 'Booking system | Weboldalas',
  description: 'Online appointment, table and room booking built into your website: automatic confirmations, reminders and calendar sync.',
}

export const en: ServicePageData = {
  shape: 'calendar',
  kind: 'booking',
  icon: Calendar,
  title: 'Booking system',
  hero: {
    badge: 'Booking system',
    headline: 'Fewer phone calls, more booked appointments',
    accent: 'more booked appointments',
    sub: 'With an online booking system, your clients pick a free slot on your website themselves, at any time. The system confirms the booking and sends a reminder, so you spend less time arranging appointments.',
    features: [
      'Available slots in real time',
      'Automatic email confirmation',
      'Reminders for your clients',
      'Google Calendar sync',
      'Easy to use on mobile',
      'Your own opening hours and breaks',
    ],
  },
  whatYouGet: {
    title: 'What can the booking system do?',
    items: [
      { icon: Calendar,  title: 'Online calendar',        desc: 'Your clients see the available slots and can book straight away.' },
      { icon: Mail,      title: 'Automatic confirmation', desc: 'After every booking, the client gets an email and you get a notification.' },
      { icon: Bell,      title: 'Reminders',              desc: 'The system sends a reminder before the appointment, so fewer clients miss it.' },
      { icon: RefreshCw, title: 'Calendar sync',          desc: 'Bookings appear in your Google Calendar automatically.' },
      { icon: Clock,     title: 'Your own schedule',      desc: 'Set your opening hours, days off and breaks.' },
      { icon: BarChart2, title: 'Reports',                desc: 'See how many bookings you\'ve had and which times are busiest.' },
    ],
  },
  howItWorks: {
    title: 'How do your clients book?',
    steps: [
      { n: '01', title: 'They visit your site',      desc: 'They find your website through Google, social media or a recommendation.' },
      { n: '02', title: 'They pick a slot',          desc: 'They check the available slots and choose the one that suits them.' },
      { n: '03', title: 'They enter their details',  desc: 'They give their name, email address and phone number, then send the booking.' },
      { n: '04', title: 'They get a confirmation',   desc: 'They receive a confirmation automatically, and a reminder later. You are notified too.' },
    ],
  },
  forWhom: {
    title: 'Who benefits most?',
    items: [
      { icon: Scissors, label: 'Beauty',        desc: 'Hairdressers, nail studios, massage therapists' },
      { icon: Heart,    label: 'Healthcare',    desc: 'From private practices to multi-doctor clinics' },
      { icon: Home,     label: 'Accommodation', desc: 'From apartments to hotels' },
      { icon: Utensils, label: 'Restaurants',   desc: 'From a single restaurant to a chain' },
    ],
  },
  pricing: {
    note: 'It can be built into a new or an existing website. The price depends on how many services, staff members or locations the system needs to handle.',
    cta: 'Request a quote',
  },
  faqs: [
    { q: 'Can it be added to my existing website?', a: 'Yes, it can be added to a new or an existing website.' },
    { q: 'Can it send SMS reminders?', a: 'Reminders go out by email; SMS can be set up if you need it.' },
    { q: 'Can it connect to Google Calendar?', a: 'Yes, bookings appear in Google Calendar automatically.' },
    { q: 'What happens if a booking needs to be cancelled?', a: 'The client can cancel online, and you can delete it in the admin panel. Both of you get a notification.' },
  ],
}
