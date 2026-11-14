import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, Building2, CreditCard,
  Banknote, SlidersHorizontal, FileText,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Shield, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
  Languages, ShieldCheck, Truck, Receipt, LayoutDashboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ShapeName } from '@/components/public/home/particleShapes'

export type Reference = {
  slug: string
  name: string
  tagline: string
  category: string
  year: string
  /** Particle shape in the detail hero; defaults to cart for webshops, devices otherwise. */
  shape?: ShapeName
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
  /** Screenshots under /public/references/<slug>/; the first one is shown large. */
  images?: { src: string; alt: string; caption?: string }[]
  url?: string
}

export const REFERENCES: Reference[] = [
  {
    slug: 'helkem',
    name: 'Helkem',
    tagline: 'Saját fejlesztésű, több országot kiszolgáló B2B e-commerce platform',
    category: 'B2B e-commerce',
    year: '2026',
    shape: 'cartridge',
    accentColor: '#84cc16',
    gradient: 'linear-gradient(135deg, #65a30d, #84cc16, #a3e635)',
    gradientFrom: '#1a2e05',
    gradientTo: '#365314',
    description:
      'A Helkem építőipari ragasztó- és tömítőanyag-nagykereskedés. Egy teljesen új, saját fejlesztésű e-commerce platformot építettünk nekik, amely egy rendszerből szolgál ki több országot. A célközönség a céges partnerek köre (B2B), de a webshop magánszemélyeket is kiszolgál, saját árazással és ÁFA-kezeléssel. Az első piac Szlovákia (helkem.sk), a további országok ugyanerre az alapra épülnek.',
    challenge:
      'A korábbi WooCommerce rendszert közel 80 egyedi bővítmény tartotta össze. A cél egy egységes platform volt, ahol a partnerkezelés, a többnyelvű katalógus, az országonként eltérő ÁFA-szabályok, a számlázás és a szállítás egy helyen, automatizáltan működik, és egy új ország bevezetése nem egy új webshop építését jelenti.',
    services: [
      { icon: Layers,          label: 'Egyedi B2B platform' },
      { icon: LayoutDashboard, label: 'Admin és rendeléskezelés' },
      { icon: ShoppingCart,    label: 'Többnyelvű webshop' },
      { icon: Wrench,          label: 'Folyamatos fejlesztés' },
    ],
    features: [
      {
        icon: Languages,
        title: 'Több ország, több nyelv',
        description: 'Egy rendszer, országonkénti webshoppal. A termékek, kategóriák és tulajdonságok fordíthatók, egy új ország saját nyelvet, árlistát és pénznemet kap.',
      },
      {
        icon: UserCheck,
        title: 'Partnerkezelés jóváhagyással',
        description: 'Céges regisztráció adminisztrátori jóváhagyással, partnerenként több felhasználó telephely-hozzárendeléssel, saját fizetési módokkal és határidőkkel.',
      },
      {
        icon: Percent,
        title: 'Háromszintű kedvezményrendszer',
        description: 'Kategória-, termék- és fizetésimód-szintű kedvezmények lejárattal. A kedvezmények nem halmozódnak: a rendszer mindig a vevőnek kedvezőbbet alkalmazza.',
      },
      {
        icon: ShieldCheck,
        title: 'Automatikus ÁFA-kezelés',
        description: 'VIES adószám-ellenőrzés, fordított adózás EU-s cégeknek, OSS magánszemélyeknek. Az ÁFA-döntés és annak alapja minden rendelésen rögzítve van.',
      },
      {
        icon: Banknote,
        title: 'Több pénznem, napi árfolyam',
        description: 'HUF és EUR számlázás, a napi MNB-árfolyam automatikus szinkronjával. Az árfolyam a rendelés pillanatában rögzül.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Facettás katalógus, variációk',
        description: 'Márka, terméktípus és felhasználási terület szerinti szűrők, szín × kiszerelés variációk generálása, RAL-színkereső és variánsonkénti képek.',
      },
      {
        icon: CreditCard,
        title: 'Pénztár és online fizetés',
        description: 'Bankkártyás fizetés (Barion), utánvét díjsávokkal, előre utalás kedvezménnyel és partnerenként engedélyezett halasztott fizetés.',
      },
      {
        icon: Truck,
        title: 'Szállítás GLS-sel',
        description: 'Csomagpont-választás a pénztárban, címke és kézbesítési igazolás mentése, országonkénti irányítószám-ellenőrzés és város-kitöltés.',
      },
      {
        icon: Receipt,
        title: 'Automatikus számlázás',
        description: 'Billingo-integráció: számla a megfelelő rendelési státusznál, sztornó, díjbekérő → előlegszámla → végszámla, és a befizetések kétirányú szinkronja.',
      },
      {
        icon: Package,
        title: 'Rendeléskezelés munkafolyamattal',
        description: 'Státuszok kötelező ellenőrzési lépéssel, gyűjtőlista vonalkód-olvasással, szállítólevél, automatikus készletlevonás és e-mail értesítések a rendelés nyelvén.',
      },
      {
        icon: FileText,
        title: 'Partnerportál és dokumentumtár',
        description: 'Rendelések és számlák letöltése, kedvencek, valamint műszaki és biztonsági adatlapok, láthatósági szinttel csak az arra jogosult partnereknek.',
      },
      {
        icon: BarChart2,
        title: 'Vezetői dashboard és export',
        description: 'KPI-k, teendőlista, országonkénti áttekintés, könyvelési export (belföldi, OSS) Excelben, GA4 e-commerce mérés és Consent Mode v2 cookie-kezelés.',
      },
    ],
    images: [
      { src: '/references/helkem/webshop-termekoldal.webp', alt: 'Helkem webshop – termékoldal', caption: 'A szlovák webshop termékoldala: ár ÁFÁ-val vagy anélkül, készlet, várható kiszállítás.' },
      { src: '/references/helkem/admin-attekintes.webp', alt: 'Helkem admin – áttekintés', caption: 'Az admin áttekintése: KPI-k, forgalmi trend, teendők és a napi MNB-árfolyam.' },
      { src: '/references/helkem/admin-rendeles.webp', alt: 'Helkem admin – rendelés adatlap', caption: 'Rendelés adatlap folyamatjelzővel, következő lépéssel, számlázással és GLS-címkével.' },
      { src: '/references/helkem/admin-rendelesek.webp', alt: 'Helkem admin – rendelések', caption: 'Rendelések munkafolyamat-fülekkel, régió- és státuszszűrővel.' },
      { src: '/references/helkem/webshop-felhasznalasi-teruletek.webp', alt: 'Helkem webshop – felhasználási területek', caption: 'Felhasználási területek a webshop főoldalán.' },
    ],
    outcome:
      'A Helkem partnerei, rendelései, számlázása és szállítása ma egy saját, bővíthető rendszerben fut, a szlovák webshop pedig az első ország a sorban. Egy új piac bevezetése fordítás és beállítás kérdése, nem egy újabb webshopé.',
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
    tagline: 'Modern turisztikai weboldal a település bemutatására',
    category: 'Turizmus',
    year: '2025',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
    gradientFrom: '#064e3b',
    gradientTo: '#065f46',
    description:
      'A Visit Kígyós számára egy modern, reszponzív turisztikai weboldalt készítettünk, amely egy helyen mutatja be a település látnivalóit, programjait, szálláshelyeit és szolgáltatásait.',
    challenge:
      'A cél egy könnyen kezelhető, gyors és látványos weboldal létrehozása volt, amely egyszerre nyújt hasznos információt a látogatóknak, miközben erősíti a település online jelenlétét.',
    services: [
      { icon: Globe,    label: 'Egyedi turisztikai weboldal' },
      { icon: Search,   label: 'SEO optimalizálás' },
      { icon: Wrench,   label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Map,
        title: 'Modern egyedi megjelenés',
        description: 'A település arculatához igazított, teljesen egyedi dizájn — nem sablon alapú megoldás.',
      },
      {
        icon: PartyPopper,
        title: 'Programok és események',
        description: 'Aktuális rendezvények és események egyszerű kezelése és megjelenítése a látogatók számára.',
      },
      {
        icon: Landmark,
        title: 'Látnivalók bemutatása',
        description: 'A település nevezetességeinek részletes ismertetése képekkel és strukturált információkkal.',
      },
      {
        icon: BedDouble,
        title: 'Szálláshelyek megjelenítése',
        description: 'A helyi szállásadók bemutatása elérhetőségekkel és képgalériával, egy helyen.',
      },
      {
        icon: Store,
        title: 'Szolgáltatók bemutatása',
        description: 'Helyi vállalkozások és szolgáltatások egységes, rendezett megjelenítése.',
      },
      {
        icon: Images,
        title: 'Képgalériák',
        description: 'Látványos galériák a település hangulatának és rendezvényeinek bemutatására.',
      },
      {
        icon: Mail,
        title: 'Kapcsolati és érdeklődési űrlapok',
        description: 'Egyszerű kapcsolatfelvételi lehetőség a látogatók számára, spam-védett megoldással.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'Tökéletes működés mobiltelefonon, tableten és számítógépen egyaránt.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát technikai háttér és metaadatok a jobb online láthatóság érdekében.',
      },
      {
        icon: Zap,
        title: 'Gyors és biztonságos működés',
        description: 'Optimalizált teljesítmény és megbízható technikai háttér, folyamatos rendelkezésre állással.',
      },
      {
        icon: Settings,
        title: 'Egyszerű tartalomkezelés',
        description: 'Az adminisztrációs felületen a tartalmak gyorsan és könnyen frissíthetők technikai tudás nélkül.',
      },
      {
        icon: Wrench,
        title: 'Folyamatos üzemeltetés és támogatás',
        description: 'A weboldal az indulás után is folyamatos karbantartást, biztonsági frissítéseket és fejlesztést kap.',
      },
    ],
    outcome:
      'A Visit Kígyós weboldala egy modern turisztikai információs felületté vált, amely átlátható módon mutatja be a település értékeit, programjait és szolgáltatásait, miközben egyszerűbbé teszi a látogatók tájékozódását.',
  },
  {
    slug: 'csabai-piac',
    name: 'Csabai Piac',
    tagline: 'Modern weboldal és információs rendszer',
    category: 'Weboldal',
    year: '2025',
    accentColor: '#f97316',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316, #fb923c)',
    gradientFrom: '#7c2d12',
    gradientTo: '#9a3412',
    description:
      'A Csabai Piac számára egy modern, könnyen kezelhető weboldalt fejlesztettünk, amely egyszerre szolgálja a látogatók gyors tájékoztatását és az üzemeltetők egyszerű tartalomkezelését.',
    challenge:
      'A weboldal a modern megjelenést egy könnyen kezelhető adminisztrációs rendszerrel ötvözi, így az üzemeltetők külön fejlesztő segítsége nélkül is frissíthetik a tartalmakat.',
    services: [
      { icon: Globe,    label: 'Egyedi weboldal fejlesztés' },
      { icon: Settings, label: 'Tartalomkezelő rendszer' },
      { icon: Wrench,   label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Globe,
        title: 'Egyedi webdesign',
        description: 'A piac arculatához igazított, teljesen egyedi megjelenés — nem sablon alapú megoldás.',
      },
      {
        icon: Newspaper,
        title: 'Hírek és közlemények',
        description: 'Egyszerűen kezelhető hírrendszer aktuális információk és közlemények megjelenítésére.',
      },
      {
        icon: Calendar,
        title: 'Programok és rendezvények',
        description: 'A piac eseményeinek és rendezvényeinek kezelése és megjelenítése, dátum szerint rendezve.',
      },
      {
        icon: Users,
        title: 'Árusi adatlapok',
        description: 'Az árusok részletes bemutatása elérhetőségekkel, termékekkel és képekkel.',
      },
      {
        icon: Tag,
        title: 'Kategóriák és keresés',
        description: 'Gyors böngészés és keresés az árusok és termékek között kategóriák alapján.',
      },
      {
        icon: Info,
        title: 'Nyitvatartás és információk',
        description: 'Mindig naprakész nyitvatartási adatok és látogatói információk egy helyen.',
      },
      {
        icon: Images,
        title: 'Galéria',
        description: 'Látványos képgaléria a piac életéről, hangulatáról és rendezvényeiről.',
      },
      {
        icon: Mail,
        title: 'Kapcsolati űrlap',
        description: 'Egyszerű, spam-védett kapcsolatfelvételi lehetőség a látogatók számára.',
      },
      {
        icon: Settings,
        title: 'Adminisztrációs felület',
        description: 'A tartalmak egyszerű kezelése és frissítése külön fejlesztő bevonása nélkül.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'Mobilon, tableten és számítógépen egyaránt tökéletes felhasználói élmény.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát technikai háttér és metaadatok a jobb online láthatóság érdekében.',
      },
      {
        icon: Zap,
        title: 'Gyors és biztonságos működés',
        description: 'Optimalizált teljesítmény, stabil rendszer és folyamatos biztonsági frissítések.',
      },
    ],
    outcome:
      'A Csabai Piac új weboldala gyorsabbá és átláthatóbbá tette a látogatók tájékozódását, miközben az adminisztráció számára is jelentősen egyszerűbbé vált a tartalmak kezelése és frissítése.',
  },
  {
    slug: 'hello-roar',
    name: 'Hello Roar',
    tagline: 'Modern vállalati weboldal biztosítási tanácsadók számára',
    category: 'Vállalati weboldal',
    year: '2025',
    accentColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa)',
    gradientFrom: '#2e1065',
    gradientTo: '#4c1d95',
    description:
      'A Hello Roar számára — a Palm Group megbízásából — egy egyedi vállalati weboldalt készítettünk, amely egyszerre szolgálja a márkaépítést, az ügyfélszerzést és az új tanácsadók toborzását.',
    challenge:
      'Kiemelt figyelmet fordítottunk az egyedi vizuális megjelenésre, a felhasználói élményre és az átlátható tartalmi struktúrára — a cél egy professzionális platform volt, amely tükrözi a vállalat karakterét.',
    services: [
      { icon: Globe,     label: 'Egyedi vállalati weboldal' },
      { icon: Briefcase, label: 'Karrieroldal és toborzás' },
      { icon: Wrench,    label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Egyedi webdesign',
        description: 'Teljesen egyedi, a márka arculatához igazított vizuális megjelenés — nem sablon alapú megoldás.',
      },
      {
        icon: Building2,
        title: 'Bemutatkozó vállalati weboldal',
        description: 'A vállalat, szolgáltatások és értékek professzionális, átlátható bemutatása.',
      },
      {
        icon: FileText,
        title: 'Szolgáltatások bemutatása',
        description: 'A biztosítási megoldások részletes ismertetése könnyen áttekinthető, strukturált formában.',
      },
      {
        icon: Briefcase,
        title: 'Karrier oldal',
        description: 'Külön aloldal az új tanácsadók toborzására, a csapat bemutatására és a jelentkezések ösztönzésére.',
      },
      {
        icon: Newspaper,
        title: 'Blog rendszer',
        description: 'Egyszerűen kezelhető blog a szakmai tartalmak, hírek és cikkek rendszeres publikálására.',
      },
      {
        icon: Mail,
        title: 'Kapcsolati űrlapok',
        description: 'Gyors kapcsolatfelvételi és ajánlatkérési lehetőség, spam-védett megoldással.',
      },
      {
        icon: MousePointerClick,
        title: 'Egyedi animációk és interakciók',
        description: 'Modern vizuális megoldások és micro-interakciók a felhasználói élmény javítására.',
      },
      {
        icon: Settings,
        title: 'Tartalomkezelő rendszer',
        description: 'Az adminisztráció egyszerűen frissítheti a weboldal tartalmát fejlesztő bevonása nélkül.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'Tökéletes működés mobiltelefonon, tableten és asztali számítógépen egyaránt.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát technikai háttér, strukturált adatok és metaadatok a jobb láthatóságért.',
      },
      {
        icon: Zap,
        title: 'Gyors és optimalizált működés',
        description: 'Modern technológiai háttér, optimalizált betöltési sebesség minden eszközön.',
      },
      {
        icon: Wrench,
        title: 'Folyamatos támogatás és üzemeltetés',
        description: 'A weboldal az indulás után is folyamatos karbantartást, fejlesztést és biztonsági frissítéseket kap.',
      },
    ],
    outcome:
      'A Hello Roar weboldala egy modern és vizuálisan karakteres vállalati platform lett, amely egyszerre támogatja a márkaépítést, a szolgáltatások bemutatását és az új tanácsadók megszólítását. Az egyedi megjelenés és az átlátható felépítés professzionális online jelenlétet biztosít a vállalat számára.',
  },
]
