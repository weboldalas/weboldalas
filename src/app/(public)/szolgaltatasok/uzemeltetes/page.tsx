import { Wrench, Server, Shield, HardDrive, Settings, Pencil, Phone, Briefcase, Home, Utensils } from 'lucide-react'
import { ServicePage, type ServicePageData } from '@/components/public/ServicePage'

export const metadata = {
  title: 'Üzemeltetés és karbantartás | Weboldalas',
  description: 'Teljes weboldal üzemeltetés, karbantartás és support kisebb vállalkozásoknak. Te csak a bizniszre fókuszálj.',
}

const data: ServicePageData = {
  icon: Wrench,
  iconColor: 'slate',
  accentColor: '#64748b',
  accentGradient: 'linear-gradient(135deg, #475569, #64748b)',
  title: 'Üzemeltetés',
  subtitle: 'Gondtalan weboldal kezelés',
  hero: {
    badge: 'Üzemeltetés és karbantartás',
    headline: 'Te a bizniszedre fókuszálj — mi a technikára',
    sub: 'Nem kell értened a szerverekhöz, frissítésekhez és hibakereséshez. Mi gondoskodunk arról, hogy a weboldalad mindig tökéletesen működjön.',
    features: [
      'Tárhely és domain kezelés',
      'SSL tanúsítvány (https)',
      'Szoftverfrissítések és biztonság',
      'Napi automatikus mentés',
      'Képcsere, szövegcsere (1 óra/hó)',
      'Magyar ügyfélszolgálat munkaidőben',
    ],
  },
  whatYouGet: {
    title: 'Mit tartalmaz az üzemeltetés?',
    items: [
      { icon: Server,    title: 'Tárhely és domain',    desc: 'Gyors, megbízható szerver és domain névkezelés — minden egy helyen.' },
      { icon: Shield,    title: 'SSL és biztonság',     desc: 'HTTPS tanúsítvány, biztonsági frissítések és vírusvédelem.' },
      { icon: HardDrive, title: 'Napi mentés',          desc: 'Automatikusan minden nap mentjük a weboldalad — adatvesztés ellen védve.' },
      { icon: Settings,  title: 'Frissítések',          desc: 'Az összes szoftver naprakészen tartva, hogy ne legyenek biztonsági rések.' },
      { icon: Pencil,    title: 'Tartalomfrissítés',    desc: 'Havi 1 óra módosítási keret — képcsere, szövegfrissítés, apró változtatások.' },
      { icon: Phone,     title: 'Magyar support',       desc: 'Ha valami nem stimmel, elérhető vagy. Nem kell ticket rendszerben bolyongani.' },
    ],
  },
  howItWorks: {
    title: 'Hogyan működik a karbantartás?',
    steps: [
      { n: '01', title: 'Átvesszük a weboldalt',  desc: 'Áthelyezzük a weboldalad a mi szerverünkre, beállítjuk a monitoringot.' },
      { n: '02', title: 'Folyamatos felügyelet',  desc: 'Automatikus monitoringgal figyeljük — ha leáll, azonnal értesülünk.' },
      { n: '03', title: 'Havi karbantartás',      desc: 'Minden hónapban elvégezzük a szükséges frissítéseket és ellenőrzéseket.' },
      { n: '04', title: 'Te csak szólsz',         desc: 'Ha változtatni szeretnél valamit, jelzed nekünk — mi elvégezzük.' },
    ],
  },
  forWhom: {
    title: 'Kinek ajánljuk?',
    items: [
      { icon: Briefcase, label: 'Vállalkozóknak', desc: 'Akiknek nincs IT csapatuk' },
      { icon: Home,      label: 'Szállásadóknak', desc: 'Ahol a weboldal folyamatosan kell hogy működjön' },
      { icon: Utensils,  label: 'Éttermeknek',    desc: 'Ahol az online jelenlét üzletkritikus' },
      { icon: Wrench,    label: 'Szolgáltatóknak',desc: 'Akik nem akarnak technikával foglalkozni' },
    ],
  },
  pricing: {
    title: 'Üzemeltetési díj',
    note: '19.990 Ft/hó-tól. Minimum 12 hónapos együttműködéssel. Tartalmaz mindent — nincs rejtett díj.',
    cta: 'Üzemeltetési ajánlatot kérek',
  },
  faqs: [
    { q: 'Minimum mennyi ideig kell vállalni?', a: 'Minimum 12 hónap az együttműködés. Utána havi szinten mondható le 30 napos felmondási idővel.' },
    { q: 'Mi van ha többet változtatni szeretnék mint 1 óra/hó?', a: 'A havi kereten felüli módosítások óradíj alapján kerülnek számlázásra. Erről előre tájékoztatunk.' },
    { q: 'Ha valami elromlik éjszaka, mit csinálok?', a: 'Az automatikus monitoringunk azonnal jelez nekünk. Kritikus hibáknál este és hétvégén is reagálunk.' },
    { q: 'Tudtok átvenni meglévő weboldalt?', a: 'Igen, bármilyen meglévő weboldalt átveszünk üzemeltetésre. Előbb ingyenesen megvizsgáljuk.' },
  ],
}

export default function UzemeltesPage() {
  return <ServicePage data={data} />
}
