import { Globe, Palette, Smartphone, Zap, MapPin, Mail, Search, Scissors, Heart, Home, Wrench } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Bemutatkozó weboldal | Weboldalas',
  description: 'Prémium bemutatkozó weboldal kisebb vállalkozásoknak. Modern dizájn, mobilbarát, foglalási rendszer opcióval.',
}

const data: ServicePageData = {
  icon: Globe,
  iconColor: 'blue',
  accentColor: '#0ea5e9',
  accentGradient: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
  title: 'Bemutatkozó weboldal',
  subtitle: 'A legjobb első benyomás',
  hero: {
    badge: 'Bemutatkozó weboldal',
    headline: 'Weboldal, ami dolgozik helyetted — éjjel-nappal',
    sub: 'Nem elég jelen lenni az interneten. Egy prémium, gyors és bizalomépítő weboldal az első lépés, hogy az online látogatókból valódi ügyfelek legyenek.',
    features: [
      'Prémium, egyedi dizájn',
      'Tökéletes mobilon és tableten',
      'Gyors betöltési idő (Google kedveli)',
      'Beépített kapcsolati és ajánlatkérő form',
      'SEO alapok beállítva',
      'Ingyenes foglalási rendszer opció',
    ],
  },
  whatYouGet: {
    title: 'Mit kapsz a weboldallal?',
    items: [
      { icon: Palette,    title: 'Prémium dizájn',          desc: 'Egyedi, modern megjelenés ami kiemeli a vállalkozásodat a versenytársak közül.' },
      { icon: Smartphone, title: 'Mobilbarát megjelenés',   desc: 'A látogatók többsége telefonról böngészik. A weboldalad mindenhol tökéletesen néz ki.' },
      { icon: Zap,        title: 'Gyors betöltés',          desc: 'Optimalizált kód és képek — nem várakoztatod el a látogatókat.' },
      { icon: MapPin,     title: 'Google Maps integráció',  desc: 'Az ügyfeled könnyen megtalál téged a térképen is.' },
      { icon: Mail,       title: 'Kapcsolati form',         desc: 'Minden érdeklődő üzenete egyenesen a postaládádba érkezik.' },
      { icon: Search,     title: 'SEO alap beállítás',      desc: 'Megfelelő meta adatok, sitemap és strukturált adatok a jobb keresési pozícióhoz.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan készül el?',
    steps: [
      { n: '01', title: 'Konzultáció',  desc: 'Megbeszéljük az igényeket, a márkád stílusát és a weboldalad céljait.' },
      { n: '02', title: 'Dizájn',       desc: 'Kiválasztasz egy sablont, amit testre szabunk a márkád szín- és képi világához.' },
      { n: '03', title: 'Fejlesztés',   desc: 'Elkészítjük a weboldalt, feltöltjük a tartalmakat és beállítjuk a funkciókat.' },
      { n: '04', title: 'Átadás',       desc: '5–10 munkanap után élőben van a weboldal. Betanítunk a kezelésére.' },
    ],
  },
  forWhom: {
    title: 'Kinek való?',
    items: [
      { icon: Scissors, label: 'Szépségipar',  desc: 'Fodrász, körömstúdió, kozmetika' },
      { icon: Heart,    label: 'Egészségügy',  desc: 'Orvos, fogorvos, fizioterapeuta' },
      { icon: Home,     label: 'Szállásadók',  desc: 'Panzió, apartman, vendégház' },
      { icon: Wrench,   label: 'Szakemberek',  desc: 'Villanyszerelő, vízvezeték-szerelő, festő' },
    ],
  },
  pricing: {
    title: 'Rugalmas fizetési lehetőségek',
    note: '250.000 Ft-tól egyszeri fizetéssel, vagy havi 19.990 Ft-tól előfizetéssel. Részletfizetés is elérhető.',
    cta: 'Ingyenes ajánlatot kérek',
  },
  faqs: [
    { q: 'Mennyi idő alatt készül el a weboldal?', a: 'Általában 5–10 munkanap alatt. Egyedi, összetettebb megrendeléseknél kicsit több időre lehet szükség.' },
    { q: 'Szükségem van tartalomra (szöveg, kép)?', a: 'Ha van, kiindulunk abból. Ha nincs, segítünk a szövegek és képek összeállításában.' },
    { q: 'Mi van ha változtatni akarok később?', a: 'Bármikor. Havidíjas ügyfeleinknél ez a csomag részét képezi. Egyszeri vásárlásnál külön díjas karbantartás érhető el.' },
    { q: 'Van foglalási rendszer?', a: 'Igen, opcionálisan beépítjük az online időpontfoglalást is — külön havidíj nélkül.' },
  ],
}

export default function BemutatkozoWeboldalPage() {
  return <ServicePage data={data} />
}
