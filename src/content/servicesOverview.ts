import type { ServiceKind } from '@/components/public/home/ServiceVisual'
import type { Locale, RouteKey } from '@/i18n/routes'

export type ServicesOverviewContent = {
  meta: { title: string; description: string }
  label: string
  title: string
  accent: string
  intro: string
  items: { kind: ServiceKind; route: RouteKey; title: string; sub: string; points: string[] }[]
}

const hu: ServicesOverviewContent = {
  meta: {
    title: 'Szolgáltatások | Weboldalas',
    description: 'Weboldal, webshop, foglalási rendszer, landing page, CRM, ERP és üzemeltetés kis-, közép- és nagyvállalatoknak.',
  },
  label: 'Szolgáltatások',
  title: 'Minden, ami online kell.',
  accent: 'online',
  intro: 'Weboldal, webshop, foglalás, CRM, ERP és üzemeltetés. Egy csapat, egy kapcsolattartó, és olyan megoldások, amik a cégedhez igazodnak, legyen szó egyéni vállalkozásról vagy nagyvállalatról.',
  items: [
    { kind: 'web', route: 'website', title: 'Bemutatkozó weboldal', sub: 'A céged online névjegye: megmutatja, mivel foglalkoztok, miért érdemes titeket választani, és hogyan lehet elérni benneteket.', points: ['Egyedi dizájn', 'Mobilbarát', 'Alap keresőoptimalizálás', 'Kapcsolatfelvételi űrlap'] },
    { kind: 'shop', route: 'webshop', title: 'Webshop', sub: 'Online bolt: a vásárlók kosárba teszik és kifizetik a termékeidet, te pedig egy felületen intézed a rendeléseket.', points: ['Online fizetés', 'Rendeléskezelés', 'Készletnyilvántartás', 'Automatikus e-mailek'] },
    { kind: 'booking', route: 'booking', title: 'Foglalási rendszer', sub: 'Az ügyfeleid maguk foglalnak szabad időpontot a weboldaladon; a visszaigazolást és az emlékeztetőt a rendszer küldi.', points: ['Online időpontfoglalás', 'Google Naptár', 'Automatikus visszaigazolás', 'Emlékeztető'] },
    { kind: 'landing', route: 'landing', title: 'Landing page', sub: 'Egyetlen célra épített oldal hirdetésekhez és kampányokhoz: ajánlatkérés, feliratkozás vagy vásárlás.', points: ['Egy cél', 'Űrlap', 'Mérőkódok', 'Gyors betöltés'] },
    { kind: 'crm', route: 'crm', title: 'CRM rendszer', sub: 'Ügyfélkezelő rendszer: érdeklődők, ajánlatok, ügyfelek és teendők egy helyen, hogy semmi ne csússzon el.', points: ['Értékesítési tábla', 'Ajánlatok', 'Feladatok', 'Hívásnapló'] },
    { kind: 'erp', route: 'erp', title: 'ERP rendszer', sub: 'Vállalatirányítási rendszer: összeköti a pénzügyet, a raktárat, a beszerzést, a gyártást és a munkatársakat.', points: ['Raktár és készlet', 'Beszerzés', 'Pénzügy', 'Összekötések'] },
    { kind: 'ops', route: 'maintenance', title: 'Üzemeltetés', sub: 'Átvállaljuk a weboldalad vagy rendszered technikai gondozását: tárhely, frissítések, mentések és módosítások.', points: ['Tárhely és domain', 'Frissítések', 'Napi mentés', 'Magyar ügyfélszolgálat'] },
  ],
}

const en: ServicesOverviewContent = {
  meta: {
    title: 'Services | Weboldalas',
    description: 'Websites, webshops, booking systems, landing pages, CRM, ERP and maintenance for small, mid-sized and large companies.',
  },
  label: 'Services',
  title: 'Everything you need online.',
  accent: 'online',
  intro: 'Website, webshop, booking, CRM, ERP and maintenance. One team, one point of contact, and solutions that fit your company, whether you are a sole trader or a large enterprise.',
  items: [
    { kind: 'web', route: 'website', title: 'Business website', sub: 'Your company’s home on the web: it shows what you do, why people should choose you and how to reach you.', points: ['Custom design', 'Mobile-friendly', 'Basic SEO', 'Contact form'] },
    { kind: 'shop', route: 'webshop', title: 'Webshop', sub: 'An online store: customers add your products to the cart and pay, and you manage orders in one place.', points: ['Online payment', 'Order management', 'Stock tracking', 'Automatic emails'] },
    { kind: 'booking', route: 'booking', title: 'Booking system', sub: 'Your customers book free slots on your website themselves; the system sends the confirmation and the reminder.', points: ['Online booking', 'Google Calendar', 'Automatic confirmation', 'Reminders'] },
    { kind: 'landing', route: 'landing', title: 'Landing page', sub: 'A single page built for one goal, for ads and campaigns: enquiries, sign-ups or sales.', points: ['One goal', 'Form', 'Analytics tags', 'Fast loading'] },
    { kind: 'crm', route: 'crm', title: 'CRM system', sub: 'A client management system: leads, quotes, clients and tasks in one place, so nothing slips through.', points: ['Sales board', 'Quotes', 'Tasks', 'Call log'] },
    { kind: 'erp', route: 'erp', title: 'ERP system', sub: 'A company management system that connects finance, stock, purchasing, production and your people.', points: ['Stock and inventory', 'Purchasing', 'Finance', 'Integrations'] },
    { kind: 'ops', route: 'maintenance', title: 'Maintenance', sub: 'We take care of the technical side of your website or system: hosting, updates, backups and changes.', points: ['Hosting and domain', 'Updates', 'Daily backups', 'Support'] },
  ],
}

export const SERVICES_OVERVIEW: Record<Locale, ServicesOverviewContent> = { hu, en }
