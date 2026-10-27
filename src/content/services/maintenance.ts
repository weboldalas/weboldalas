import { Wrench, Server, Shield, HardDrive, Settings, Pencil, Phone, Briefcase, Building2, Factory } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'Weboldal üzemeltetés | Weboldalas',
  description: 'Átvállaljuk a weboldalad vagy rendszered technikai gondozását: tárhely, frissítések, mentések, hibajavítás és módosítások.',
}

export const hu: ServicePageData = {
  shape: 'gears',
  kind: 'ops',
  icon: Wrench,
  title: 'Üzemeltetés',
  hero: {
    badge: 'Üzemeltetés és karbantartás',
    headline: 'Te az üzletre figyelsz, mi a technikára',
    accent: 'mi a technikára',
    sub: 'Az üzemeltetés azt jelenti, hogy átvállaljuk a weboldalad vagy rendszered technikai gondozását: tárhely, frissítések, biztonsági mentések, hibajavítás és kisebb módosítások. Neked nem kell értened hozzá.',
    features: [
      'Tárhely és domain',
      'SSL tanúsítvány (biztonságos https)',
      'Rendszeres frissítések',
      'Napi automatikus mentés',
      'Tartalmi módosítások',
      'Magyar ügyfélszolgálat munkaidőben',
    ],
  },
  whatYouGet: {
    title: 'Mit tartalmaz az üzemeltetés?',
    items: [
      { icon: Server,    title: 'Tárhely és domain', desc: 'Megbízható szerver és domainkezelés, egy helyen intézve.' },
      { icon: Shield,    title: 'Biztonság',         desc: 'SSL tanúsítvány és rendszeres biztonsági frissítések.' },
      { icon: HardDrive, title: 'Napi mentés',       desc: 'Minden nap automatikusan mentjük az oldalt, hogy baj esetén vissza lehessen állítani.' },
      { icon: Settings,  title: 'Frissítések',       desc: 'A használt szoftvereket naprakészen tartjuk, hogy ne maradjanak biztonsági rések.' },
      { icon: Pencil,    title: 'Módosítások',       desc: 'Képcsere, szövegfrissítés, kisebb változtatások: szólsz, és elvégezzük.' },
      { icon: Phone,     title: 'Elérhető segítség', desc: 'Ha kérdésed van vagy valami nem működik, magyarul, közvetlenül elérsz minket.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan működik?',
    steps: [
      { n: '01', title: 'Átvesszük',      desc: 'Átnézzük és átvesszük a weboldalt vagy rendszert, és beállítjuk a felügyeletet.' },
      { n: '02', title: 'Felügyeljük',    desc: 'Automatikusan figyeljük, hogy az oldal elérhető-e és rendben működik-e.' },
      { n: '03', title: 'Karbantartjuk',  desc: 'Rendszeresen elvégezzük a frissítéseket és az ellenőrzéseket.' },
      { n: '04', title: 'Te csak szólsz', desc: 'Ha változtatni szeretnél valamin, jelzed nekünk, és elvégezzük.' },
    ],
  },
  forWhom: {
    title: 'Kinek ajánljuk?',
    items: [
      { icon: Briefcase, label: 'Kisvállalkozásoknak', desc: 'Akiknek nincs saját informatikusuk' },
      { icon: Building2, label: 'Középvállalatoknak',  desc: 'Ahol a weboldalnak folyamatosan működnie kell' },
      { icon: Factory,   label: 'Nagyvállalatoknak',   desc: 'Akik tehermentesítenék a belső IT-t' },
      { icon: Wrench,    label: 'Bárkinek',            desc: 'Aki nem szeretne technikával foglalkozni' },
    ],
  },
  pricing: {
    note: 'Az üzemeltetés folyamatos szolgáltatás. A díját a weboldal vagy rendszer méretétől és a kért szolgáltatásoktól függően, az ajánlatban rögzítjük.',
    cta: 'Ajánlatot kérek',
  },
  faqs: [
    { q: 'Más által készített oldalt is átvesztek?', a: 'Igen. Előbb átnézzük, milyen állapotban van, és csak utána adunk ajánlatot.' },
    { q: 'Mi történik, ha hiba van az oldalon?', a: 'Az automatikus felügyelet jelez nekünk, ha az oldal nem érhető el, és a hibát a lehető leghamarabb javítjuk.' },
    { q: 'Mennyi módosítás fér bele?', a: 'Ezt az ajánlatban rögzítjük. Nagyobb fejlesztésekre külön ajánlatot adunk.' },
    { q: 'Nekem kell bármit csinálnom?', a: 'Nem. Elég szólnod, ha módosítást szeretnél, a technikai részt mi intézzük.' },
  ],
}

export const enMeta = {
  title: 'Maintenance | Weboldalas',
  description: 'We take care of the technical side of your website or system: hosting, updates, backups, bug fixes and changes.',
}

export const en: ServicePageData = {
  shape: 'gears',
  kind: 'ops',
  icon: Wrench,
  title: 'Maintenance',
  hero: {
    badge: 'Hosting and maintenance',
    headline: 'You focus on the business, we handle the tech',
    accent: 'we handle the tech',
    sub: 'Maintenance means we take care of the technical side of your website or system: hosting, updates, backups, bug fixes and smaller changes. You don\'t need to understand any of it.',
    features: [
      'Hosting and domain',
      'SSL certificate (secure https)',
      'Regular updates',
      'Automatic daily backups',
      'Content changes',
      'Support during business hours',
    ],
  },
  whatYouGet: {
    title: 'What does maintenance include?',
    items: [
      { icon: Server,    title: 'Hosting and domain', desc: 'Reliable servers and domain management, all handled in one place.' },
      { icon: Shield,    title: 'Security',           desc: 'SSL certificate and regular security updates.' },
      { icon: HardDrive, title: 'Daily backups',      desc: 'We back up your site automatically every day, so it can be restored if something goes wrong.' },
      { icon: Settings,  title: 'Updates',            desc: 'We keep the software up to date, so no security gaps are left open.' },
      { icon: Pencil,    title: 'Changes',            desc: 'New images, updated text, small tweaks: just let us know and we\'ll do it.' },
      { icon: Phone,     title: 'Help when you need it', desc: 'If you have a question or something isn\'t working, you can reach us directly.' },
    ],
  },
  howItWorks: {
    title: 'How does it work?',
    steps: [
      { n: '01', title: 'We take over',     desc: 'We review and take over your website or system, and set up monitoring.' },
      { n: '02', title: 'We monitor',       desc: 'We automatically check that your site is online and working properly.' },
      { n: '03', title: 'We maintain',      desc: 'We carry out updates and checks on a regular basis.' },
      { n: '04', title: 'You just ask',     desc: 'If you want something changed, let us know and we\'ll take care of it.' },
    ],
  },
  forWhom: {
    title: 'Who is it for?',
    items: [
      { icon: Briefcase, label: 'Small businesses',  desc: 'Without their own IT staff' },
      { icon: Building2, label: 'Medium-sized companies', desc: 'Where the website has to keep running' },
      { icon: Factory,   label: 'Large companies',   desc: 'Looking to take load off their in-house IT' },
      { icon: Wrench,    label: 'Anyone',            desc: 'Who would rather not deal with the technical side' },
    ],
  },
  pricing: {
    note: 'Maintenance is an ongoing service. The fee depends on the size of your website or system and the services you need, and is set out in the quote.',
    cta: 'Request a quote',
  },
  faqs: [
    { q: 'Do you take over sites built by someone else?', a: 'Yes. We review its condition first, and only then send you a quote.' },
    { q: 'What happens if something goes wrong with the site?', a: 'Our automatic monitoring alerts us if the site goes down, and we fix the problem as soon as possible.' },
    { q: 'How many changes are included?', a: 'This is set out in the quote. Larger developments are quoted separately.' },
    { q: 'Do I need to do anything?', a: 'No. Just tell us when you want a change, and we handle the technical side.' },
  ],
}
