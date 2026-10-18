import { Wrench, Server, Shield, HardDrive, Settings, Pencil, Phone, Briefcase, Building2, Factory } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Weboldal üzemeltetés | Weboldalas',
  description: 'Átvállaljuk a weboldalad vagy rendszered technikai gondozását: tárhely, frissítések, mentések, hibajavítás és módosítások.',
}

const data: ServicePageData = {
  shape: 'gears',
  kind: 'ops',
  icon: Wrench,
  title: 'Üzemeltetés',
  hero: {
    badge: 'Üzemeltetés és karbantartás',
    headline: 'Te az üzletre figyelsz, mi a technikára',
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

export default function UzemeltesPage() {
  return <ServicePage data={data} />
}
