// Temporary pricing page (to be removed later); prices are starting points.
import type { Locale, RouteKey } from '@/i18n/routes'

export type PricingContent = {
  meta: { title: string; description: string }
  label: string
  title: string
  accent: string
  intro: string
  from: string
  details: string
  note: string
  items: { route: RouteKey; title: string; desc: string; price: string; unit: string; includes: string[] }[]
}

const hu: PricingContent = {
  meta: { title: 'Áraink | Weboldalas', description: 'Kiinduló áraink bemutatkozó weboldalra, webshopra, landing page-re, CRM és ERP rendszerre.' },
  label: 'Áraink',
  title: 'Átlátható kiinduló árak.',
  accent: 'kiinduló árak.',
  intro: 'Ennyiből indulnak a szolgáltatásaink. A pontos összeget a projekt ismeretében, egy rövid konzultáció után rögzítjük az ajánlatban.',
  from: '-tól',
  details: 'Részletek',
  note: 'A pontos összeg a funkcióktól és a projekt méretétől függ; az ajánlatban előre rögzítjük. Fizetheted egy összegben vagy részletekben.',
  items: [
    { route: 'website', title: 'Bemutatkozó weboldal', desc: 'A céged online névjegye.', price: '350 000', unit: 'Ft', includes: ['Egyedi dizájn', 'Mobilbarát', 'Alap keresőoptimalizálás', 'Kapcsolatfelvételi űrlap'] },
    { route: 'webshop', title: 'Webshop', desc: 'Online bolt fizetéssel és rendeléskezeléssel.', price: '990 000', unit: 'Ft', includes: ['Online fizetés', 'Rendeléskezelés', 'Készletnyilvántartás', 'Automatikus e-mailek'] },
    { route: 'landing', title: 'Landing page', desc: 'Egy oldal kampányokhoz, hirdetésekhez.', price: '200 000', unit: 'Ft', includes: ['Egy cél', 'Űrlap', 'Mérőkódok', 'Gyors betöltés'] },
    { route: 'crm', title: 'CRM rendszer', desc: 'Érdeklődők, ajánlatok, ügyfelek egy helyen.', price: '450 000', unit: 'Ft', includes: ['Értékesítési tábla', 'Ajánlatok', 'Feladatok', 'Hívásnapló'] },
    { route: 'erp', title: 'ERP rendszer', desc: 'Az egész cég működése egy rendszerben.', price: '1 500 000', unit: 'Ft', includes: ['Raktár és készlet', 'Beszerzés', 'Pénzügy', 'Összekötések'] },
  ],
}

const en: PricingContent = {
  meta: { title: 'Pricing | Weboldalas', description: 'Starting prices for business websites, webshops, landing pages, CRM and ERP systems.' },
  label: 'Pricing',
  title: 'Clear starting prices.',
  accent: 'starting prices.',
  intro: 'This is where our services start. We agree the exact amount in the quote, after a short consultation about your project.',
  from: 'From',
  details: 'Details',
  note: 'The exact amount depends on the features and the size of the project, and is fixed in advance in the quote. You can pay in one go or in instalments.',
  items: [
    { route: 'website', title: 'Business website', desc: 'Your company’s home on the web.', price: '900', unit: '€', includes: ['Custom design', 'Mobile-friendly', 'Basic SEO', 'Contact form'] },
    { route: 'webshop', title: 'Webshop', desc: 'An online store with payments and order management.', price: '2,500', unit: '€', includes: ['Online payment', 'Order management', 'Stock tracking', 'Automatic emails'] },
    { route: 'landing', title: 'Landing page', desc: 'One page for campaigns and ads.', price: '500', unit: '€', includes: ['One goal', 'Form', 'Analytics tags', 'Fast loading'] },
    { route: 'crm', title: 'CRM system', desc: 'Leads, quotes and clients in one place.', price: '1,150', unit: '€', includes: ['Sales board', 'Quotes', 'Tasks', 'Call log'] },
    { route: 'erp', title: 'ERP system', desc: 'Your whole company in one system.', price: '3,800', unit: '€', includes: ['Stock and inventory', 'Purchasing', 'Finance', 'Integrations'] },
  ],
}

export const PRICING: Record<Locale, PricingContent> = { hu, en }
