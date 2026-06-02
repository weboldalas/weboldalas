import { Globe, Calendar, Wrench, Search, BarChart2, Smartphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Reference = {
  slug: string
  name: string
  tagline: string
  category: string
  year: string
  accentColor: string
  gradient: string
  gradientFrom: string
  gradientTo: string
  description: string
  challenge: string
  services: { icon: LucideIcon; label: string }[]
  testimonial?: { text: string; author: string; role: string }
  url?: string
}

export const REFERENCES: Reference[] = [
  {
    slug: 'helkem',
    name: 'Helkem',
    tagline: 'Prémium szálláshely weboldal foglalási rendszerrel',
    category: 'Szálláshely',
    year: '2025',
    accentColor: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)',
    gradientFrom: '#0c4a6e',
    gradientTo: '#0369a1',
    description:
      'A Helkem egy vidéki szálláshely, amely korábban csak telefonon és emailen fogadott foglalásokat. Az új weboldallal teljesen automatizálták az időpontkezelést — az ügyfelek bármikor foglalhatnak, visszaigazolás azonnal megérkezik.',
    challenge:
      'A tulajdonos rengeteg időt töltött manuális foglalásegyeztetéssel. Szükség volt egy profi megjelenésre és egy rendszerre, ami önállóan kezeli a foglalásokat.',
    services: [
      { icon: Globe,     label: 'Bemutatkozó weboldal' },
      { icon: Calendar,  label: 'Foglalási rendszer' },
      { icon: Wrench,    label: 'Üzemeltetés' },
    ],
    testimonial: {
      text: 'Azóta sokkal több online foglalásunk van, és nem kell minden héten emaileket írogatni. A rendszer önmagát kezeli — mi csak a vendégekre figyelünk.',
      author: 'Helkem tulajdonosa',
      role: 'Szállásadó',
    },
  },
  {
    slug: 'sztanfa',
    name: 'Sztanfa',
    tagline: 'Modern étterem weboldal asztalfoglalással',
    category: 'Vendéglátás',
    year: '2025',
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
    gradientFrom: '#78350f',
    gradientTo: '#92400e',
    description:
      'A Sztanfa egy helyi étterem, amely szerette volna modernizálni az online jelenlétét és leegyszerűsíteni az asztalfoglalást. Az új weboldal tükrözi az étterem karakterét és automatizálja a foglalási folyamatot.',
    challenge:
      'Az étteremnek nem volt saját weboldalja, csak Facebook oldala. Szükség volt egy profi bemutatkozó felületre és egy online asztalfoglalási rendszerre.',
    services: [
      { icon: Globe,      label: 'Bemutatkozó weboldal' },
      { icon: Calendar,   label: 'Asztalfoglalási rendszer' },
      { icon: Smartphone, label: 'Mobilbarát megjelenés' },
    ],
    testimonial: {
      text: 'Végre van egy rendes weboldalunk. Az ügyfelek imádják, hogy online tudnak asztalt foglalni, és mi sem veszítünk el több foglalást elfelejtett telefonok miatt.',
      author: 'Sztanfa étterem',
      role: 'Tulajdonos',
    },
  },
  {
    slug: 'visitkigyos',
    name: 'VisitKígyós',
    tagline: 'Turisztikai bemutatkozó oldal helyi látványosságokkal',
    category: 'Turizmus',
    year: '2025',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
    gradientFrom: '#064e3b',
    gradientTo: '#065f46',
    description:
      'A VisitKígyós projekt célja Kígyós község turisztikai vonzerejének online bemutatása volt. A weboldal megmutatja a helyi látnivalókat, eseményeket és elősegíti a helyi turizmus fejlődését.',
    challenge:
      'A községnek nem volt egységes online turisztikai felülete. A látogatók nehezen találták meg az információkat a helyi programokról és látnivalókról.',
    services: [
      { icon: Globe,    label: 'Bemutatkozó weboldal' },
      { icon: Search,   label: 'SEO optimalizálás' },
      { icon: BarChart2,label: 'Analytics integráció' },
    ],
    testimonial: {
      text: 'A weboldal megjelenése óta sokkal több érdeklődőt kapunk a helyi programjainkra. Büszkék vagyunk rá, hogy Kígyósnak végre van egy méltó online arca.',
      author: 'VisitKígyós',
      role: 'Projekt koordinátor',
    },
  },
]
