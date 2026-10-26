import { Globe, Palette, Smartphone, Zap, MapPin, Mail, Search, Scissors, Heart, Home, Building2 } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Bemutatkozó weboldal | Weboldalas',
  description: 'Egyedi bemutatkozó weboldal egyéni vállalkozóktól a nagyvállalatokig: megmutatja, kik vagytok, mit csináltok, és hogyan lehet elérni benneteket.',
}

const data: ServicePageData = {
  shape: 'devices',
  kind: 'web',
  icon: Globe,
  title: 'Bemutatkozó weboldal',
  hero: {
    badge: 'Bemutatkozó weboldal',
    headline: 'Weboldal, ami megmutatja, kik vagytok',
    accent: 'kik vagytok',
    sub: 'A bemutatkozó weboldal a céged online névjegye: elmondja, mivel foglalkoztok, miért érdemes titeket választani, és hogyan lehet elérni benneteket. Megtervezzük, elkészítjük, és ha kell, a szövegekben is segítünk.',
    features: [
      'Egyedi, a cégedre szabott dizájn',
      'Telefonon, tableten és gépen is jól működik',
      'Gyors betöltés',
      'Kapcsolatfelvételi és ajánlatkérő űrlap',
      'Alap keresőoptimalizálás (Google)',
      'Igény szerint több nyelven',
    ],
  },
  whatYouGet: {
    title: 'Mit kapsz a weboldallal?',
    items: [
      { icon: Palette,    title: 'Egyedi dizájn',             desc: 'Nem sablon: a megjelenést a céged arculatához és a célközönségedhez tervezzük.' },
      { icon: Smartphone, title: 'Minden eszközön jól néz ki', desc: 'A látogatók nagy része telefonról érkezik, ezért az oldal mobilon, tableten és számítógépen is kényelmesen használható.' },
      { icon: Zap,        title: 'Gyors betöltés',            desc: 'Optimalizált képek és kód, hogy a látogatónak ne kelljen várnia.' },
      { icon: Mail,       title: 'Űrlapok',                   desc: 'Az érdeklődők üzenete egyenesen az e-mail-fiókodba érkezik.' },
      { icon: MapPin,     title: 'Térkép és elérhetőség',     desc: 'Cím, nyitvatartás és Google Térkép, hogy könnyen megtaláljanak.' },
      { icon: Search,     title: 'Alap keresőoptimalizálás',  desc: 'Beállítjuk, ami ahhoz kell, hogy a Google megfelelően megtalálja és megjelenítse az oldalt.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan készül el?',
    steps: [
      { n: '01', title: 'Megismerünk',  desc: 'Megbeszéljük, mivel foglalkoztok, kiknek szól az oldal, és mit szeretnél elérni vele.' },
      { n: '02', title: 'Megtervezzük', desc: 'Elkészítjük az oldal felépítését és dizájnját, amit közösen véglegesítünk.' },
      { n: '03', title: 'Elkészítjük',  desc: 'Megépítjük az oldalt, feltöltjük a tartalmat, és több eszközön is teszteljük.' },
      { n: '04', title: 'Átadjuk',      desc: 'Élesítjük a weboldalt, és megmutatjuk, hogyan tudod kezelni.' },
    ],
  },
  forWhom: {
    title: 'Kinek való?',
    items: [
      { icon: Scissors,  label: 'Szolgáltatóknak',          desc: 'Szépségipar, szakemberek, tanácsadók' },
      { icon: Heart,     label: 'Egészségügynek',           desc: 'Magánrendelőtől a klinikáig' },
      { icon: Home,      label: 'Szállás és vendéglátás',   desc: 'Vendégháztól a szállodáig' },
      { icon: Building2, label: 'Közép- és nagyvállalatoknak', desc: 'Céges arculat, több nyelv, karrier- és sajtóoldal' },
    ],
  },
  pricing: {
    note: 'Az ár elsősorban az oldalak számától, a tartalomtól és a szükséges funkcióktól függ. Egy rövid konzultáció után pontos, kötelezettségmentes ajánlatot küldünk.',
    cta: 'Ajánlatot kérek',
  },
  faqs: [
    { q: 'Mennyi idő alatt készül el a weboldal?', a: 'A projekt méretétől függ. A pontos ütemtervet az elején közösen rögzítjük, így mindig tudod, hol tartunk.' },
    { q: 'Kell, hogy legyen szövegem és képem?', a: 'Ha van, abból indulunk ki. Ha nincs, segítünk a szövegek és a képek összeállításában.' },
    { q: 'Később is lehet módosítani?', a: 'Igen. A módosításokat elvégezzük, vagy ha kezelőfelületet kérsz, a tartalmat te is szerkesztheted.' },
    { q: 'Bővíthető később foglalással vagy webshoppal?', a: 'Igen, a weboldal később is kiegészíthető online foglalással, webshoppal vagy más funkciókkal.' },
  ],
}

export default function BemutatkozoWeboldalPage() {
  return <ServicePage data={data} />
}
