import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, CreditCard,
  Banknote, SlidersHorizontal, FileText,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Shield, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
  Languages, ShieldCheck, Truck, Receipt, LayoutDashboard,
  Mic, RotateCcw, PackagePlus, ChefHat, Waves, Pencil, Accessibility,
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
    tagline: 'Saját termékkezelő app AI-val, magyar és román webshoppal',
    category: 'Belső app és webshop',
    year: '2026',
    shape: 'log',
    accentColor: '#d89244',
    gradient: 'linear-gradient(135deg, #b9762d, #d89244, #f6c27a)',
    gradientFrom: '#13241f',
    gradientTo: '#1c342f',
    description:
      'A Sztanfa gyalu- és fűrészáru-kereskedés, magyar és román webshoppal. A webshopok mellé egy saját, telefonról használható termékkezelő appot fejlesztettünk: a csapat elmondja vagy beírja, mi változzon egy terméken, az AI kitölti belőle a mezőket, a módosítás pedig jóváhagyás után élesedik a megfelelő webshopban.',
    challenge:
      'A faáru adatai sűrűn változnak: árak méretenként, akciók, készlet, kiszerelés, képek. A WordPress admin telefonról nehézkes, és nem a raktárban dolgozóknak készült. A cél egy olyan eszköz volt, amellyel bárki pár mondatban jelezheti a változást a telepről is, a webshop viszont csak ellenőrzés után változik, és két külön shopot kell kiszolgálnia.',
    services: [
      { icon: Smartphone,   label: 'Egyedi belső app' },
      { icon: Sparkles,     label: 'AI-integráció' },
      { icon: ShoppingCart, label: 'WooCommerce webshop' },
      { icon: Wrench,       label: 'Folyamatos fejlesztés' },
    ],
    features: [
      {
        icon: Mic,
        title: 'Mondd el, mit változtassunk',
        description: 'Egy diktált vagy beírt mondatból („a 4 méteres ára 10 500 lesz, akciósan 9 990 a hónap végéig”) az AI kitölti a mezőket, megmutatja, hogyan értette, és visszakérdez, ha valami nem egyértelmű.',
      },
      {
        icon: ShieldCheck,
        title: 'Jóváhagyás tételenként',
        description: 'Semmi nem élesedik magától. A jóváhagyó mezőnként pipál, élesítés előtt javíthat az értékeken, vagy indoklással elutasítja a kérést.',
      },
      {
        icon: RotateCcw,
        title: 'Ütközésfigyelés és visszavonás',
        description: 'Ha egy mezőt közben az adminban átírtak, az app jelzi, és nem írja felül magától. Élesítés után pontosan a korábbi értékek állíthatók vissza, minden lépés naplózva.',
      },
      {
        icon: Languages,
        title: 'Két webshop, egy app',
        description: 'A magyar és a román shop termékei ugyanabból az appból kezelhetők, aláírt belső kapcsolaton. A román shopban lejben számol, és a szöveges mezőket románul javasolja.',
      },
      {
        icon: PackagePlus,
        title: 'Új termék pár fotóból',
        description: 'Néhány fotóból és mondatból termékvázlat készül névvel, kategóriával, árakkal és méretekkel. Jóváhagyás után piszkozatként jön létre a webshopban, képekkel és sávos árakkal.',
      },
      {
        icon: Tag,
        title: 'Teljes termékszerkesztés telefonról',
        description: 'Ár és mértékegység, mennyiségi árak, akció dátummal, készlet, leírás, kategória, attribútumok, kép, termékvideó és kivezetés, méretenként külön is.',
      },
      {
        icon: Layers,
        title: 'Tömeges élesítés',
        description: 'A várakozó kérések kategóriánként szűrhetők, és egyszerre élesíthetők. Ami közben megváltozott a terméken, az kimarad, a végén összesítő mutatja az eredményt.',
      },
      {
        icon: Smartphone,
        title: 'Telepíthető mobil app, biztonságos belépés',
        description: 'A telefon kezdőképernyőjére tehető, a webshop belépőjével és kétlépcsős azonosításával működik. A beküldők külön szerepkört kapnak, a WordPress adminba nem jutnak be.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Szűrős termékkatalógus',
        description: 'Kategória, hosszúság és méret szerinti szűrés élő darabszámokkal, kereső, aktív szűrők, megosztható szűrt linkek és végtelen görgetés, mobilon alulról felcsúszó szűrőpanellel.',
      },
      {
        icon: ShoppingBag,
        title: 'Faipari termékoldalak',
        description: 'Hosszúság szerinti méretválasztás, szálankénti vagy négyzetméteres ár, akció- és rakatos jelölések, házhozszállítási információk a főoldalon.',
      },
    ],
    images: [
      { src: '/references/sztanfa/app-ai-ertelmezes.webp', alt: 'Sztanfa termékkezelő app – AI értelmezés', caption: 'A termékkezelő app: kezdőképernyő, a „Mondd el” bevitel és az „Így értettem” összegzés (demó adatokkal).' },
      { src: '/references/sztanfa/app-jovahagyas.webp', alt: 'Sztanfa termékkezelő app – jóváhagyás', caption: 'Jóváhagyás: várakozó kérések kategóriaszűrővel, tételenkénti pipa és ütközésjelzés (demó adatokkal).' },
      { src: '/references/sztanfa/webshop-fooldal.webp', alt: 'Sztanfa webshop – főoldal', caption: 'A webshop főoldala szállítási információkkal.' },
      { src: '/references/sztanfa/webshop-termekek.webp', alt: 'Sztanfa webshop – termékek', caption: 'Termékkatalógus hosszúság és méret szűrőkkel.' },
      { src: '/references/sztanfa/webshop-termekoldal.webp', alt: 'Sztanfa webshop – termékoldal', caption: 'Termékoldal hosszúság szerinti méretválasztással.' },
    ],
    outcome:
      'A termékadatok karbantartása ma a csapat telefonján történik: egy mondat a telepről, egy jóváhagyás az irodából, és a változás kint van a magyar vagy a román webshopban. A WordPress admin a jóváhagyónak marad.',
  },
  {
    slug: 'nadas-padel',
    name: 'Nádas Padel Club',
    tagline: 'Weboldal és saját online pályafoglaló rendszer egy békéscsabai padelklubnak',
    category: 'Foglalási rendszer',
    year: '2026',
    shape: 'padel',
    url: 'https://nadaspadel.hu',
    accentColor: '#add636',
    gradient: 'linear-gradient(135deg, #7fa31f, #add636, #d4f07a)',
    gradientFrom: '#0b0b0b',
    gradientTo: '#2c3a0c',
    description:
      'A Nádas Padel Club négy szabadtéri padelpályát üzemeltet Békéscsabán. Új weboldalt és saját online pályafoglaló rendszert építettünk nekik: a játékos pár koppintással kiválasztja a napot, a pályát és az órákat, a foglalás azonnal érvényes, a visszaigazolás e-mailben érkezik, a klub pedig egy admin felületen kezeli a foglalásokat, a nyitvatartást és az árakat.',
    challenge:
      'A cél egy olyan foglalási rendszer volt, ahol a játékos regisztráció nélkül, percek alatt foglal, a szabad időpontok mindig naprakészek, dupla foglalás nem fordulhat elő, és a lemondás is önkiszolgáló. A klubnak közben fejlesztő nélkül kell tudnia állítani a nyitvatartást, az árakat és a lezárt sávokat.',
    services: [
      { icon: Globe,           label: 'Weboldal' },
      { icon: Calendar,        label: 'Online foglalási rendszer' },
      { icon: LayoutDashboard, label: 'Admin felület' },
      { icon: Mail,            label: 'E-mail automatizálás' },
    ],
    features: [
      {
        icon: Calendar,
        title: 'Online pályafoglalás',
        description: 'Nap, pálya és órák kiválasztása egy oldalon, egyszerre több órára is. Single (2 fő) és standard (4 fő) pályák, élő összesítő a fizetendő összeggel, regisztráció nélkül.',
      },
      {
        icon: ShieldCheck,
        title: 'Dupla foglalás kizárva',
        description: 'A foglalást az adatbázis egy lépésben ellenőrzi és rögzíti. Foglalt, elmúlt vagy nyitvatartáson kívüli időpontot nem enged, akkor sem, ha ketten egyszerre kattintanak.',
      },
      {
        icon: Mail,
        title: 'Automatikus e-mailek',
        description: 'Visszaigazolás útvonaltervezővel és lemondó gombbal, emlékeztető a játék előtti napon, és értesítés a klubnak minden új foglalásról és lemondásról.',
      },
      {
        icon: RotateCcw,
        title: 'Önkiszolgáló lemondás',
        description: 'A játékos az e-mailben kapott egyedi linkkel mondja le a foglalását, az időpont azonnal felszabadul, és a klub is értesítést kap.',
      },
      {
        icon: LayoutDashboard,
        title: 'Admin felület',
        description: 'Napi nézet pályánként, a közelgő foglalások listája, lemondás értesítéssel, és egyes sávok lezárása, például edzésre vagy karbantartásra.',
      },
      {
        icon: Settings,
        title: 'Nyitvatartás és árak adminból',
        description: 'Alap nyitvatartás, napi, heti vagy havi eltérések és zárva tartás, valamint a pályadíjak, az ütő- és a labdabérlés ára, mind a klub kezében.',
      },
      {
        icon: Package,
        title: 'Felszerelésbérlés a foglalásban',
        description: 'Ütő és labda már a foglaláskor kérhető, az ára benne van az összesítőben, a fizetés a helyszínen történik.',
      },
      {
        icon: Images,
        title: 'Klubos weboldal',
        description: 'Pályák és díjak, galéria a klub saját fotóival, foglalási útmutató és kapcsolat, mobilra tervezve.',
      },
    ],
    images: [
      { src: '/references/nadas-padel/foglalas.webp', alt: 'Nádas Padel Club – online foglalás', caption: 'Online foglalás: nap, pálya és órák kiválasztása, élő összesítővel.' },
      { src: '/references/nadas-padel/fooldal.webp', alt: 'Nádas Padel Club – főoldal', caption: 'A weboldal főoldala.' },
      { src: '/references/nadas-padel/email-visszaigazolas.webp', alt: 'Nádas Padel Club – visszaigazoló e-mail', caption: 'A visszaigazoló e-mail útvonaltervezővel és lemondó gombbal (demó adatokkal).' },
      { src: '/references/nadas-padel/foglalas-lepesek.webp', alt: 'Nádas Padel Club – foglalási útmutató', caption: 'Foglalási útmutató három lépésben.' },
      { src: '/references/nadas-padel/palyak.webp', alt: 'Nádas Padel Club – pályák', caption: 'Pályák, díjak és felszerelésbérlés.' },
    ],
    outcome:
      'A Nádas Padel Club játékosai a nap bármely szakában percek alatt foglalnak pályát, a klub pedig minden foglalásról azonnal értesül, és egy felületen látja a napját. Nyitvatartást, árat és lezárt sávot a klub maga állít.',
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
    tagline: 'Weboldal interaktív piactérképpel, árusi adatlapokkal és receptekkel Békéscsaba piacának',
    category: 'Weboldal és piactérkép',
    year: '2025',
    shape: 'market',
    url: 'https://csabaipiac.hu',
    accentColor: '#e8813a',
    gradient: 'linear-gradient(135deg, #d9692a, #e8813a, #7aa97c)',
    gradientFrom: '#13231a',
    gradientTo: '#2a3f2e',
    description:
      'A Csabai Piac Békéscsaba egyik legélénkebb pontja: termelők, kézművesek, büfék és a csabai kolbász árusai egy helyen. Új weboldalt építettünk nekik, amelynek a középpontjában egy interaktív piactérkép áll. A látogató árusra vagy termékre keres, kategóriára szűr, és rögtön látja, melyik standnál találja, amit keres.',
    challenge:
      'Egy nagy, sok épületből és pavilonból álló piacon nehéz eligazodni, a látogatók pedig leginkább azt kérdezik, ki árul csabai kolbászt, és hol van. A cél egy olyan oldal volt, amely ezt pár koppintással megválaszolja, mobilon is, miközben a piac üzemeltetői fejlesztő nélkül frissítik az árusokat, a híreket és a programokat.',
    services: [
      { icon: Globe,    label: 'Egyedi weboldal fejlesztés' },
      { icon: Map,      label: 'Interaktív piactérkép' },
      { icon: Settings, label: 'Tartalomkezelő rendszer' },
      { icon: Wrench,   label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Map,
        title: 'Interaktív piactérkép',
        description: 'A piac teljes alaprajza nagyítható, kereshető térképen. Az árus- vagy termékkeresés és a kategóriaszűrők a térképen és a mellette lévő árus-listán egyszerre jelölik ki a találatokat.',
      },
      {
        icon: Store,
        title: 'Hol vegyünk csabai kolbászt?',
        description: 'Külön oldal a csabai kolbász árusainak, kártyánként kinyitható bemutatással. A térképen a kolbászárusok és a kóstolóhelyek saját színnel, kiemelve jelennek meg.',
      },
      {
        icon: Users,
        title: 'Árusi adatlapok',
        description: 'Minden árus saját adatlapot kap fotóval, kínálattal és elérhetőséggel, a térkép és a lista ugyanezekből az adatokból dolgozik.',
      },
      {
        icon: ChefHat,
        title: 'Receptek',
        description: 'Receptgyűjtemény a piac termékeiből, címkékkel és kereséssel receptre vagy hozzávalóra.',
      },
      {
        icon: Newspaper,
        title: 'Hírek és programok',
        description: 'Közlemények, rendezvények és programok, az adminból egyszerűen frissítve.',
      },
      {
        icon: Info,
        title: 'Nyitvatartás mindig szem előtt',
        description: 'A napokra bontott nyitvatartás, a telefonszám és az e-mail-cím minden oldal tetején látszik.',
      },
      {
        icon: Images,
        title: 'Galéria',
        description: 'Képek a piac életéről, hangulatáról és rendezvényeiről.',
      },
      {
        icon: Settings,
        title: 'Adminisztrációs felület',
        description: 'Árusok, hírek, programok és receptek kezelése külön fejlesztő bevonása nélkül.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'A térkép és a keresés mobilon is kényelmesen használható, ott, ahol a látogató épp a piacon sétál.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát technikai háttér és metaadatok a jobb online láthatóság érdekében.',
      },
    ],
    images: [
      { src: '/references/csabai-piac/piacterkep.webp', alt: 'Csabai Piac – interaktív piactérkép', caption: 'Interaktív piactérkép kereséssel, kategóriaszűrőkkel és árus-listával.' },
      { src: '/references/csabai-piac/kolbasz-arusok.webp', alt: 'Csabai Piac – Hol vegyünk csabai kolbászt?', caption: 'A csabai kolbász árusai egy oldalon.' },
      { src: '/references/csabai-piac/fooldal.webp', alt: 'Csabai Piac – főoldal', caption: 'A főoldal, felül a nyitvatartással.' },
      { src: '/references/csabai-piac/receptek.webp', alt: 'Csabai Piac – receptek', caption: 'Receptek címkékkel és kereséssel.' },
      { src: '/references/csabai-piac/a-piacrol.webp', alt: 'Csabai Piac – a piacról', caption: 'A piac bemutatása.' },
    ],
    outcome:
      'A Csabai Piac látogatói pár koppintással megtalálják, kinél és hol vehetnek csabai kolbászt vagy bármi mást, a piac üzemeltetői pedig maguk tartják naprakészen az árusokat, a híreket és a programokat.',
  },
  {
    slug: 'arpad-furdo',
    name: 'Árpád Gyógy- és Strandfürdő',
    tagline: 'Háromnyelvű weboldal élő pályafoglaltsággal és a fürdő saját szerkesztőfelületével',
    category: 'Weboldal és admin',
    year: '2026',
    shape: 'sunrise',
    url: 'https://arpadfurdo.hu',
    accentColor: '#1bb3c4',
    gradient: 'linear-gradient(135deg, #0f8796, #1bb3c4, #6fd6e0)',
    gradientFrom: '#0c2830',
    gradientTo: '#14404a',
    description:
      'Az Árpád Gyógy- és Strandfürdő 1922 óta Békéscsaba egyik legkedveltebb fürdője: termálvíz, uszoda, strand és szauna egy helyen. Új, háromnyelvű weboldalt építettünk nekik, amelyen a látogató egy pillantással látja az uszoda heti pályabeosztását, az árakat, a nyitvatartást és a híreket, a fürdő munkatársai pedig maguk szerkesztik az oldal tartalmát.',
    challenge:
      'A fürdőt a gyerekes családoktól az idősebb gyógyvendégekig mindenki használja, ezért az oldalnak mindenkinek könnyen olvashatónak kell lennie, magyarul, románul és angolul is. Az úszók leggyakoribb kérdése, hogy mikor van szabad pálya, a munkatársaknak pedig fejlesztő nélkül kell tudniuk frissíteni a híreket, az árakat és a pályabeosztást.',
    services: [
      { icon: Globe,           label: 'Egyedi weboldal fejlesztés' },
      { icon: Languages,       label: 'Háromnyelvű tartalom' },
      { icon: LayoutDashboard, label: 'Admin felület' },
      { icon: Accessibility,   label: 'Akadálymentesítés' },
    ],
    features: [
      {
        icon: Waves,
        title: 'Élő pályafoglaltság',
        description: 'Az uszoda 8 pályájának heti beosztása óránként: szabad pálya az 50 és a 21 méteres medencében, úszóklub és vízilabda. Az admin módosítása azonnal megjelenik minden látogatónál, újratöltés nélkül.',
      },
      {
        icon: Pencil,
        title: 'Szerkesztés közvetlenül az oldalon',
        description: 'Bejelentkezve a munkatárs szerkesztő módban magán az oldalon írja át a szövegeket és cseréli a képeket, nyelvenként külön.',
      },
      {
        icon: Languages,
        title: 'Magyar, román és angol',
        description: 'A teljes oldal és az adminban rögzített hírek, események három nyelven. Ha egy fordítás hiányzik, a magyar szöveg jelenik meg.',
      },
      {
        icon: Accessibility,
        title: 'Akadálymentesítési panel',
        description: 'Betűméret négy fokozatban, magas kontraszt, szürkeárnyalat, linkek kiemelése, animációk leállítása és olvasható betűtípus. A böngésző megjegyzi a beállításokat.',
      },
      {
        icon: LayoutDashboard,
        title: 'Admin felület',
        description: 'Hírek szövegszerkesztővel, események, árlista, galéria és pályabeosztás kezelése egy helyen.',
      },
      {
        icon: UserCheck,
        title: 'Felhasználók és jogosultságok',
        description: 'Szuperadmin, admin és szerkesztő szerepkör, a munkatársak fiókjait a fürdő maga kezeli.',
      },
      {
        icon: Newspaper,
        title: 'Hírek megosztásra készen',
        description: 'Minden hír saját képpel, címmel és leírással jelenik meg, ha Facebookon vagy más közösségi oldalon megosztják.',
      },
      {
        icon: Receipt,
        title: 'Árak és nyitvatartás',
        description: 'Jegyárak, Csaba Kártyás és közgyógyellátási árak, szolgáltatások és nyitvatartás, mindig naprakészen.',
      },
      {
        icon: Landmark,
        title: 'Történet és házirend',
        description: 'A fürdő története archív fotókkal, a házirend és a szolgáltatások részletes bemutatása.',
      },
    ],
    images: [
      { src: '/references/arpad-furdo/palyafoglaltsag.webp', alt: 'Árpád Fürdő – élő pályafoglaltság', caption: 'Élő pályafoglaltság: az uszoda 8 pályájának beosztása óránként, naponként.' },
      { src: '/references/arpad-furdo/fooldal.webp', alt: 'Árpád Fürdő – főoldal', caption: 'A főoldal.' },
      { src: '/references/arpad-furdo/szerkeszto-mod.webp', alt: 'Árpád Fürdő – szerkesztő mód', caption: 'Szerkesztő mód: a szövegek és képek közvetlenül az oldalon írhatók át, nyelvenként.' },
      { src: '/references/arpad-furdo/akadalymentesites.webp', alt: 'Árpád Fürdő – akadálymentesítés', caption: 'Akadálymentesítési panel.' },
    ],
    outcome:
      'Az Árpád Fürdő látogatói három nyelven, a saját igényeikre állítható felületen tájékozódnak, az úszók előre látják, mikor van szabad pálya, a fürdő munkatársai pedig fejlesztő nélkül tartják naprakészen az oldalt.',
  },
  {
    slug: 'hello-roar',
    name: 'ROAR.',
    tagline: 'Karakteres vállalati weboldal a biztosítási és pénzügyi tanácsadók új generációjának',
    category: 'Vállalati weboldal',
    year: '2025',
    shape: 'lion',
    url: 'https://helloroar.hu',
    accentColor: '#3ee69a',
    gradient: 'linear-gradient(135deg, #e0479e, #3ee69a, #9ff5c9)',
    gradientFrom: '#0e2a1f',
    gradientTo: '#173f2e',
    description:
      'A ROAR. a biztosítási és pénzügyi tanácsadók új generációja, a Palm Group csapata. Egyedi vállalati weboldalt készítettünk nekik, amely a márka bátor, low-poly oroszlános arculatára épül, és egyszerre szolgálja a márkaépítést, az ügyfélszerzést és az új tanácsadók toborzását.',
    challenge:
      'A biztosítás sokaknak száraz téma, a ROAR. viszont fiatalos és közvetlen hangon szól. A cél egy olyan oldal volt, amely élethelyzetekből indul ki (lakás, autó, munkahelyváltás, gyermekvállalás), érthetően mutatja be a megoldásokat, és minden oldalon kéznél van az ingyenes tanácsadás, közben pedig a karrieroldalon az új kollégákat is megszólítja.',
    services: [
      { icon: Globe,     label: 'Egyedi vállalati weboldal' },
      { icon: Sparkles,  label: 'Arculatra épülő webdesign' },
      { icon: Briefcase, label: 'Karrieroldal és toborzás' },
      { icon: Wrench,    label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Arculatra épülő design',
        description: 'A low-poly oroszlánmaszkok, a zöld és pink színvilág és a festékfelhők a weboldal minden részén visszaköszönnek. Egyedi megjelenés, nem sablon.',
      },
      {
        icon: UserCheck,
        title: 'Megoldások élethelyzetek szerint',
        description: 'Lakás, autó, munkahelyváltás vagy gyermekvállalás: a látogató a saját élethelyzetéből indulva találja meg a hozzá illő biztosítást.',
      },
      {
        icon: Layers,
        title: 'Témakörönként felépített megoldások',
        description: 'Öngondoskodás, megtakarítás, magán egészségbiztosítás, nyugdíj, jármű- és kerékpárbiztosítás, mind saját, áttekinthető aloldalon.',
      },
      {
        icon: MousePointerClick,
        title: 'Ingyenes tanácsadás mindig kéznél',
        description: 'Az „Ingyenes tanácsadás” gomb minden oldalon látszik, a kapcsolatfelvétel pár kattintás.',
      },
      {
        icon: Briefcase,
        title: 'Karrieroldal',
        description: 'Külön „Dolgozz velünk” aloldal az új tanácsadók toborzására és a csapat bemutatására.',
      },
      {
        icon: Newspaper,
        title: 'Blog',
        description: 'Szakmai cikkek és hírek egyszerű publikálása a márka hangján.',
      },
      {
        icon: Mail,
        title: 'Kapcsolati és ajánlatkérő űrlapok',
        description: 'Gyors kapcsolatfelvétel és ajánlatkérés, spam-védett megoldással.',
      },
      {
        icon: Settings,
        title: 'Tartalomkezelő rendszer',
        description: 'A csapat fejlesztő bevonása nélkül frissítheti a megoldásokat, a blogot és a karrieroldalt.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'A karakteres megjelenés mobilon, tableten és asztali gépen egyaránt működik.',
      },
      {
        icon: Search,
        title: 'SEO-optimalizált felépítés',
        description: 'Keresőbarát technikai háttér, strukturált adatok és metaadatok a jobb láthatóságért.',
      },
    ],
    images: [
      { src: '/references/hello-roar/fooldal.webp', alt: 'ROAR. – főoldal', caption: 'A főoldal a márka oroszlánmaszkos arculatával.' },
      { src: '/references/hello-roar/megoldasok.webp', alt: 'ROAR. – megoldások', caption: 'Megoldások élethelyzetek szerint.' },
      { src: '/references/hello-roar/ongondoskodas.webp', alt: 'ROAR. – öngondoskodás', caption: 'Öngondoskodás: megtakarítás, egészségbiztosítás, nyugdíj.' },
      { src: '/references/hello-roar/jarmu.webp', alt: 'ROAR. – jármű', caption: 'Jármű- és kerékpárbiztosítás.' },
    ],
    outcome:
      'A ROAR. weboldala ugyanolyan bátor és közvetlen lett, mint maga a márka: a látogató a saját élethelyzetéből indulva jut el a megfelelő megoldáshoz és az ingyenes tanácsadáshoz, a karrieroldal pedig az új tanácsadókat is megszólítja.',
  },
  {
    slug: 'most-koltozom',
    name: 'Most Költözöm',
    tagline: 'Letisztult, fotós weboldal könnyűszerkezetes családi házakhoz, házkonfigurátorral és interaktív falrétegrenddel',
    category: 'Vállalati weboldal',
    year: '2026',
    shape: 'house',
    url: 'https://mostkoltozombe.hu',
    accentColor: '#ef8a1e',
    gradient: 'linear-gradient(135deg, #3f9b3a, #ef8a1e, #f7b25a)',
    gradientFrom: '#132416',
    gradientTo: '#25391f',
    description:
      'A Most Költözöm Kft. könnyűszerkezetes családi házakat tervez és épít kulcsrakészre Békéscsabán. Új weboldalt készítettünk nekik, amely nagy látványtervekkel, alaprajzzal és helyiséglistával mutatja be a tervezett otthont, interaktív ábrán magyarázza el a falszerkezetet, és egy ötlépéses konfigurátorral segíti az első ajánlatkérést.',
    challenge:
      'Egy családi ház megépíttetése nagy döntés, és a vevő tudni szeretné, mi van a falakban, és pontosan mit kap a pénzéért. A cél egy olyan oldal volt, amely érthetően mutatja be a szerkezetet és a vállalt tartalmat, nem ígér többet, mint ami a szerződésbe kerül, és az érdeklődőt egyszerű lépésekben vezeti el az első egyeztetésig.',
    services: [
      { icon: Globe, label: 'Egyedi weboldal fejlesztés' },
      { icon: Sparkles, label: 'Fotós, letisztult webdesign' },
      { icon: SlidersHorizontal, label: 'Házkonfigurátor' },
      { icon: Wrench, label: 'Üzemeltetés és támogatás' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Fotós nyitóoldal',
        description: 'Nagy, lassan váltakozó látványtervek bélyegképekkel. Ha a látogató a kép fölé visz az egérrel, a váltás megáll, csökkentett mozgás beállításnál pedig nem is indul el.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Ötlépéses házkonfigurátor',
        description: 'Telek és település, alapterület, hálószobák és helyiségek, kiegészítők, időzítés. A végén összesítés, és a választásokkal előre kitöltött e-mail, amit a látogató egy kattintással elküld.',
      },
      {
        icon: Layers,
        title: 'Interaktív falrétegrend',
        description: 'A külső fal tíz rétege kattintható ábrán, mindegyik mellett egy mondat arról, mire való. Billentyűzettel is bejárható.',
      },
      {
        icon: FileText,
        title: 'Alaprajz és helyiséglista',
        description: 'Nagyítható előzetes alaprajz, letölthető PDF és helyiségenkénti területek egy áttekinthető táblázatban.',
      },
      {
        icon: ShieldCheck,
        title: 'Kulcsrakész tartalom átláthatóan',
        description: 'Két oszlopban látszik, mi része a vállalásnak, és mi az, amiről külön kell egyeztetni.',
      },
      {
        icon: Images,
        title: 'Referenciagaléria',
        description: 'Mozaikos képrács a korábbi munkákról, teljes képernyős nagyítással, lapozással nyilakkal, billentyűzettel és mobilon húzással.',
      },
      {
        icon: Info,
        title: 'Pontos, félreérthetetlen szövegek',
        description: 'Minden látványterv mellett ott a jelzés, hogy előzetes terv, a gyakori kérdések pedig egyenesen válaszolnak a telekre, a kulcsrakész állapotra és a jótállásra.',
      },
      {
        icon: Accessibility,
        title: 'Akadálymentes kezelés',
        description: 'Billentyűzettel is használható galéria, falrétegrend és konfigurátor, jól látható fókusz és a mozgást csökkentő beállítás tiszteletben tartása.',
      },
      {
        icon: Smartphone,
        title: 'Reszponzív kialakítás',
        description: 'Mobilon a tartalom fölé úszó menü, átrendezett képek és kártyába tördelt magyarázatok.',
      },
      {
        icon: Search,
        title: 'SEO és megosztás',
        description: 'Oldalanként saját cím, leírás és megosztási kép, hogy a közösségi oldalakon is rendesen jelenjen meg.',
      },
    ],
    images: [
      { src: '/references/most-koltozom/fooldal.webp', alt: 'Most Költözöm – főoldal', caption: 'A fotós nyitóoldal a ház látványterveivel.' },
      { src: '/references/most-koltozom/konfigurator.webp', alt: 'Most Költözöm – házkonfigurátor', caption: 'Az ötlépéses házkonfigurátor második lépése.' },
      { src: '/references/most-koltozom/falretegek.webp', alt: 'Most Költözöm – interaktív falrétegrend', caption: 'A külső fal rétegei, rétegenkénti magyarázattal.' },
      { src: '/references/most-koltozom/kulcsrakesz.webp', alt: 'Most Költözöm – kulcsrakész tartalom', caption: 'Mi része a vállalásnak, és hogyan jut el az ügyfél az átadásig.' },
    ],
    outcome:
      'A Most Költözöm Kft. weboldala átláthatóan mutatja be a tervezett otthont és az építési megoldást: az érdeklődő látja, miből épül a fal és mi tartozik a kulcsrakész vállalásba, a konfigurátorral pedig összeállítja, milyen házat szeretne, mielőtt felveszi a kapcsolatot.',
  },
]
