import { Globe, Palette, Smartphone, Zap, MapPin, Mail, Search, Scissors, Heart, Home, Building2 } from 'lucide-react'
import type { ServicePageData } from '@/components/public/ServicePage'

export const huMeta = {
  title: 'Bemutatkozó weboldal | Weboldalas',
  description: 'Egyedi bemutatkozó weboldal egyéni vállalkozóktól a nagyvállalatokig: megmutatja, kik vagytok, mit csináltok, és hogyan lehet elérni benneteket.',
}

export const hu: ServicePageData = {
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

export const enMeta = {
  title: 'Business website | Weboldalas',
  description: 'A custom business website for everyone from sole traders to large companies: it shows who you are, what you do and how people can reach you.',
}

export const en: ServicePageData = {
  shape: 'devices',
  kind: 'web',
  icon: Globe,
  title: 'Business website',
  hero: {
    badge: 'Business website',
    headline: 'A website that shows who you are',
    accent: 'who you are',
    sub: 'Your business website is your online business card: it tells people what you do, why they should choose you and how to get in touch. We design and build it, and we can help with the copy too.',
    features: [
      'Custom design that fits your business',
      'Works well on phones, tablets and computers',
      'Fast loading',
      'Contact and quote request forms',
      'Basic search engine optimisation (Google)',
      'Multiple languages if you need them',
    ],
  },
  whatYouGet: {
    title: 'What do you get with your website?',
    items: [
      { icon: Palette,    title: 'Custom design',             desc: 'No templates: we design the look around your brand and your audience.' },
      { icon: Smartphone, title: 'Looks good on any device',  desc: 'Most visitors arrive on their phones, so the site is easy to use on mobile, tablet and desktop.' },
      { icon: Zap,        title: 'Fast loading',              desc: 'Optimised images and code, so your visitors never have to wait.' },
      { icon: Mail,       title: 'Forms',                     desc: 'Enquiries go straight to your inbox.' },
      { icon: MapPin,     title: 'Map and contact details',   desc: 'Address, opening hours and Google Maps, so people can find you easily.' },
      { icon: Search,     title: 'Basic SEO',                 desc: 'We set up what Google needs to find and display your site properly.' },
    ],
  },
  howItWorks: {
    title: 'How does it come together?',
    steps: [
      { n: '01', title: 'We get to know you', desc: 'We talk about what you do, who the site is for and what you want it to achieve.' },
      { n: '02', title: 'We design it',       desc: 'We plan the structure and design of the site, and finalise it together with you.' },
      { n: '03', title: 'We build it',        desc: 'We build the site, add the content and test it on several devices.' },
      { n: '04', title: 'We hand it over',    desc: 'We put the website live and show you how to manage it.' },
    ],
  },
  forWhom: {
    title: 'Who is it for?',
    items: [
      { icon: Scissors,  label: 'Service providers',          desc: 'Beauty, trades, consultants' },
      { icon: Heart,     label: 'Healthcare',                 desc: 'From private practices to clinics' },
      { icon: Home,      label: 'Hospitality',                desc: 'From guesthouses to hotels' },
      { icon: Building2, label: 'Medium and large companies', desc: 'Corporate branding, multiple languages, careers and press pages' },
    ],
  },
  pricing: {
    note: 'The price depends mainly on the number of pages, the content and the features you need. After a short consultation, we send you a precise, no-obligation quote.',
    cta: 'Request a quote',
  },
  faqs: [
    { q: 'How long does it take to build the website?', a: 'It depends on the size of the project. We agree on a clear schedule at the start, so you always know where things stand.' },
    { q: 'Do I need to have my own text and images?', a: 'If you have them, we start from those. If not, we help you put the text and images together.' },
    { q: 'Can it be changed later?', a: 'Yes. We can make the changes for you, or if you ask for an admin panel, you can edit the content yourself.' },
    { q: 'Can I add booking or a webshop later?', a: 'Yes, your website can be extended later with online booking, a webshop or other features.' },
  ],
}
