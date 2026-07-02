export type FieldType = 'text' | 'textarea' | 'select' | 'date'

export type TemplateField = {
  key: string
  label: string
  type: FieldType
  options?: string[]
  defaultValue?: string
  placeholder?: string
  required?: boolean
  rows?: number
}

const WEBOLDAL_FIELDS: TemplateField[] = [
  { key: 'project_name',        label: 'Projekt neve',                  type: 'text',     required: true,  placeholder: 'Pl. Vállalati weboldal fejlesztése' },
  { key: 'project_description', label: 'Fejlesztés tartalma / Scope',   type: 'textarea', rows: 3,         placeholder: 'Pl. 10 aloldalas, egyedi dizájnú bemutatkozó weboldal WordPress alapon' },
  { key: 'offer_price',         label: 'Vállalási díj (Ft)',            type: 'text',     required: true,  placeholder: '250 000' },
  { key: 'payment_terms',       label: 'Fizetési ütemezés',             type: 'textarea', rows: 2,         defaultValue: 'Előleg 50% (szerződéskötéskor) + végszámla 50% (átadáskor)' },
  { key: 'contract_start',      label: 'Kezdési dátum',                 type: 'text',     placeholder: 'Pl. 2026. augusztus 1.' },
  { key: 'deadline',            label: 'Átadási határidő',              type: 'text',     defaultValue: 'A szerződés aláírásától számított 30 munkanapon belül' },
  { key: 'warranty',            label: 'Garancia időtartama',           type: 'text',     defaultValue: '30 nap' },
]

const HAVIDIJAS_FIELDS: TemplateField[] = [
  { key: 'maintenance_package', label: 'Csomag neve',                   type: 'text',     placeholder: 'Pl. Alap karbantartási csomag' },
  { key: 'project_description', label: 'Ellátandó feladatok leírása',   type: 'textarea', rows: 3,         placeholder: 'Pl. Frissítések, biztonsági mentések, tartalomkezelés' },
  { key: 'offer_price',         label: 'Havi díj (Ft)',                 type: 'text',     required: true,  placeholder: '19 990' },
  { key: 'billing_frequency',   label: 'Számlázás gyakorisága',         type: 'select',   options: ['Havonta', 'Negyedévente', 'Félévente', 'Évente'] },
  { key: 'payment_terms',       label: 'Fizetési határidő',             type: 'text',     defaultValue: 'Minden hónap 1-jén, átutalással, 8 napon belül' },
  { key: 'contract_start',      label: 'Szerződés kezdete',             type: 'text',     placeholder: 'Pl. 2026. augusztus 1.' },
  { key: 'contract_duration',   label: 'Időtartam',                     type: 'select',   options: ['Határozatlan időre', 'Határozott (1 év)', 'Határozott (2 év)', 'Határozott – egyéb'] },
  { key: 'termination_period',  label: 'Felmondási idő',                type: 'text',     defaultValue: '30 nap (írásban)' },
  { key: 'included_hours',      label: 'Tartalmazott munkaóra / hó',    type: 'text',     defaultValue: '2 óra/hó' },
]

const WEBSHOP_FIELDS: TemplateField[] = [
  { key: 'project_name',        label: 'Projekt neve',                  type: 'text',     required: true,  placeholder: 'Pl. Online ruházati webshop fejlesztése' },
  { key: 'project_description', label: 'Fejlesztés tartalma',          type: 'textarea', rows: 2,         placeholder: 'Pl. WooCommerce alapú webshop, egyedi dizájn' },
  { key: 'offer_price',         label: 'Vállalási díj (Ft)',            type: 'text',     required: true,  placeholder: '450 000' },
  { key: 'payment_terms',       label: 'Fizetési feltételek',           type: 'textarea', rows: 2,         defaultValue: 'Előleg 50% (szerződéskötéskor) + végszámla 50% (átadáskor)' },
  { key: 'product_count',       label: 'Termékek száma (max.)',         type: 'text',     placeholder: 'Pl. 100 termék' },
  { key: 'payment_methods',     label: 'Fizetési módok',                type: 'text',     placeholder: 'Pl. bankkártya, banki átutalás, utánvét' },
  { key: 'shipping_methods',    label: 'Szállítási módok',              type: 'text',     placeholder: 'Pl. GLS, MPL, személyes átvétel' },
  { key: 'integrations',        label: 'Integrációk',                   type: 'text',     placeholder: 'Pl. SimplePay, Billingo, GLS API' },
  { key: 'deadline',            label: 'Teljesítési határidő',          type: 'text',     defaultValue: 'A szerződés aláírásától számított 45 munkanapon belül' },
  { key: 'warranty',            label: 'Garancia időtartama',           type: 'text',     defaultValue: '30 nap' },
]

const MARKETING_FIELDS: TemplateField[] = [
  { key: 'project_description', label: 'Ellátott szolgáltatások',       type: 'textarea', rows: 3,         placeholder: 'Pl. Facebook/Instagram hirdetések kezelése, havonta 2 poszt elkészítése, havi riport' },
  { key: 'offer_price',         label: 'Havi megbízási díj (Ft)',       type: 'text',     required: true,  placeholder: '60 000' },
  { key: 'ad_budget',           label: 'Hirdetési keret (Ft/hó)',       type: 'text',     placeholder: 'Pl. 100 000 (Megbízó fizeti külön)' },
  { key: 'payment_terms',       label: 'Fizetési feltételek',           type: 'text',     defaultValue: 'Minden hónap 1-jén, átutalással' },
  { key: 'contract_start',      label: 'Szerződés kezdete',             type: 'text',     placeholder: 'Pl. 2026. augusztus 1.' },
  { key: 'report_frequency',    label: 'Riport gyakorisága',            type: 'select',   options: ['Havi 1x', 'Kétheti', 'Heti'] },
  { key: 'termination_period',  label: 'Felmondási idő',                type: 'text',     defaultValue: '30 nap (írásban)' },
]

const ALTALANOS_FIELDS: TemplateField[] = [
  { key: 'project_name',        label: 'Megbízás tárgya',               type: 'text',     required: true,  placeholder: 'Pl. Grafikai tervezés' },
  { key: 'project_description', label: 'Részletes leírás',              type: 'textarea', rows: 3,         placeholder: 'A vállalt feladatok részletezése...' },
  { key: 'offer_price',         label: 'Egyszeri díj (Ft)',             type: 'text',     required: true,  placeholder: '50 000' },
  { key: 'payment_terms',       label: 'Fizetési feltételek',           type: 'text',     defaultValue: 'A teljesítéstől számított 8 napon belül, átutalással' },
  { key: 'deadline',            label: 'Teljesítési határidő',          type: 'text',     defaultValue: 'A szerződés aláírásától számított 30 munkanapon belül' },
]

export const TEMPLATE_FIELDS: Record<string, TemplateField[]> = {
  'Weboldal fejlesztési szerződés':  WEBOLDAL_FIELDS,
  'Havidíjas karbantartási szerződés': HAVIDIJAS_FIELDS,
  'Webshop fejlesztési szerződés':   WEBSHOP_FIELDS,
  'Marketing megbízási szerződés':   MARKETING_FIELDS,
  'Általános megbízási szerződés':   ALTALANOS_FIELDS,
}

export function getTemplateFields(templateName: string): TemplateField[] {
  return TEMPLATE_FIELDS[templateName] ?? ALTALANOS_FIELDS
}
