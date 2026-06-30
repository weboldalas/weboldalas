import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, Building2, CreditCard,
  Clock, Banknote, SlidersHorizontal, FileText, Calculator,
  Layers, ShoppingBag, Zap, Package,
} from 'lucide-react'
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
  features?: { icon: LucideIcon; title: string; description: string }[]
  outcome?: string
  testimonial?: { text: string; author: string; role: string }
  url?: string
}

export const REFERENCES: Reference[] = [
  {
    slug: 'helkem',
    name: 'Helkem',
    tagline: 'Egyedi B2B/B2C webshop partnerkezeléssel',
    category: 'Webshop',
    year: '2025',
    accentColor: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)',
    gradientFrom: '#0c4a6e',
    gradientTo: '#0369a1',
    description:
      'A Helkem számára egy teljesen egyedi B2B/B2C webshopot fejlesztettünk, amely egyszerre szolgálja ki a lakossági és céges vásárlókat. A projekt célja egy gyors, modern és hosszú távon bővíthető rendszer létrehozása volt, amely alkalmazkodik a vállalkozás egyedi működéséhez.',
    challenge:
      'A webshop nem csupán online értékesítési felületként működik, hanem automatizált funkciókkal támogatja a partnerkezelést, a rendelési folyamatokat és a napi adminisztrációt.',
    services: [
      { icon: ShoppingCart, label: 'Egyedi webshop fejlesztés' },
      { icon: Building2,    label: 'B2B partnerkezelés' },
      { icon: Wrench,       label: 'Folyamatos üzemeltetés' },
    ],
    features: [
      {
        icon: ShoppingCart,
        title: 'Egyedi B2B/B2C webshop',
        description: 'Egy rendszerben kezeli a lakossági és céges vásárlókat, eltérő jogosultságokkal és teljesen különálló működési logikával.',
      },
      {
        icon: Percent,
        title: 'Partnerenként eltérő árak',
        description: 'Minden partner saját árakat és kedvezményeket kap, amelyek automatikusan érvényesülnek rendeléskor, manuális beavatkozás nélkül.',
      },
      {
        icon: UserCheck,
        title: 'Céges regisztráció jóváhagyással',
        description: 'Az új céges partnerek regisztrációja adminisztrátori jóváhagyáshoz kötött — nincs automatikus hozzáférés B2B árakhoz.',
      },
      {
        icon: Building2,
        title: 'Céges ügyfélkezelés',
        description: 'Partneradatok, telephelyek, kedvezmények és jogosultságok kezelése egy helyen, strukturáltan.',
      },
      {
        icon: CreditCard,
        title: 'Testreszabott checkout',
        description: 'Teljesen egyedi WooCommerce rendelési és fizetési folyamat, a Helkem belső működésére szabva.',
      },
      {
        icon: Clock,
        title: 'Halasztott fizetési lehetőségek',
        description: '8, 15 és 30 napos fizetési határidő partnerenként szabályozható módon, automatikus nyomon követéssel.',
      },
      {
        icon: Banknote,
        title: 'Több pénznem, nettó/bruttó ár',
        description: 'HUF és EUR támogatás, valamint váltható nettó/bruttó ármegjelenítés mind a felületen, mind a számlázásban.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Intelligens termékszűrők',
        description: 'Gyors keresés és szűrés különböző terméktulajdonságok alapján, nagy termékkatalógus esetén is.',
      },
      {
        icon: FileText,
        title: 'Műszaki dokumentumtár',
        description: 'Technikai adatlapok, biztonsági adatlapok és egyéb dokumentumok kezelése közvetlenül a termékoldalakon.',
      },
      {
        icon: Calculator,
        title: 'Anyagszükséglet kalkulátorok',
        description: 'Beépített kalkulátorok a szükséges termékmennyiség kiszámításához — csökkentik a visszáru és a félrerendelés arányát.',
      },
      {
        icon: BarChart2,
        title: 'Analytics és Ads integráció',
        description: 'Google Analytics és Google Ads konverziómérés, marketing esemény követés és remarketing listák kezelése.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív, gyors, SEO-optimalizált',
        description: 'Modern technikai háttér, Core Web Vitals-optimalizált teljesítmény és keresőoptimalizálás minden eszközön.',
      },
      {
        icon: Wrench,
        title: 'Folyamatos fejlesztés és üzemeltetés',
        description: 'A rendszer az indulás után is folyamatosan fejlődik — új funkciók, automatizációk és biztonsági frissítések rendszeresen.',
      },
    ],
    outcome:
      'A Helkem webshopja ma már nem csupán egy webáruház, hanem egy összetett B2B értékesítési rendszer, amely gyorsabbá, átláthatóbbá és hatékonyabbá tette a vállalat online értékesítését és partnerkezelését.',
  },
  {
    slug: 'sztanfa',
    name: 'Sztanfa',
    tagline: 'Egyedi WooCommerce webshop faipari termékek értékesítésére',
    category: 'Webshop',
    year: '2025',
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
    gradientFrom: '#78350f',
    gradientTo: '#92400e',
    description:
      'A Sztanfa számára egy modern WooCommerce webshopot fejlesztettünk, amely a prémium faipari termékek egyszerű bemutatását és online értékesítését szolgálja. A projekt során kiemelt figyelmet fordítottunk a felhasználói élményre, az átlátható termékoldalakra és a gyors vásárlási folyamatra.',
    challenge:
      'Az eredmény egy gyors, letisztult és könnyen kezelhető webshop, amely egyszerre támogatja az értékesítést és a márka professzionális megjelenését minden eszközön.',
    services: [
      { icon: ShoppingCart, label: 'WooCommerce webshop fejlesztés' },
      { icon: Smartphone,   label: 'Reszponzív kialakítás' },
      { icon: Wrench,       label: 'Folyamatos üzemeltetés' },
    ],
    features: [
      {
        icon: ShoppingBag,
        title: 'Egyedi WooCommerce webshop',
        description: 'A vállalkozás igényeire szabott webshop egyedi kialakítással, nem sablon alapon.',
      },
      {
        icon: Layers,
        title: 'Modern termékoldalak',
        description: 'Átlátható termékbemutatás részletes információkkal és kiemelt vizuális megjelenéssel.',
      },
      {
        icon: Package,
        title: 'Variációs termékkezelés',
        description: 'Színek, méretek és egyéb termékváltozatok egyszerű kiválasztása a vásárló számára.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Intelligens termékszűrők',
        description: 'Gyors keresés kategóriák, tulajdonságok és egyéb szempontok alapján, nagy termékkatalógusnál is.',
      },
      {
        icon: ShoppingCart,
        title: 'Egyedi kosár és pénztár',
        description: 'Egyszerű, gyors és felhasználóbarát vásárlási folyamat, minimális súrlódással.',
      },
      {
        icon: Smartphone,
        title: 'Mobilbarát kialakítás',
        description: 'A webshop minden kijelzőméreten kényelmesen és hibátlanul használható.',
      },
      {
        icon: Zap,
        title: 'Gyors működés',
        description: 'Optimalizált betöltési sebesség és modern technikai háttér a legjobb felhasználói élményért.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát struktúra és metaadatok a jobb online láthatóság és organikus forgalom érdekében.',
      },
      {
        icon: BarChart2,
        title: 'Analytics és Ads integráció',
        description: 'Google Analytics és Google Ads konverziómérés — a látogatók és a kampányok teljesítményének pontos követése.',
      },
      {
        icon: Wrench,
        title: 'Folyamatos fejlesztés és üzemeltetés',
        description: 'A webshop az indulás után is folyamatos támogatást és fejlesztést kap, biztonsági frissítésekkel együtt.',
      },
    ],
    outcome:
      'A Sztanfa webshopja egy modern, gyors és könnyen használható online értékesítési felület lett, amely professzionális megjelenésével támogatja a márka építését és egyszerűbbé teszi a vásárlási folyamatot mind lakossági, mind üzleti ügyfelek számára.',
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
