export type VariableMap = Record<string, string>

export type CompanySettings = {
  company_name?: string | null
  logo_url?: string | null
  address?: string | null
  tax_number?: string | null
  registration_number?: string | null
  bank_account?: string | null
  representative_name?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  business_type?: string | null
  brand_name?: string | null
  tax_form?: string | null
}

export type CustomerVars = {
  name?: string | null
  email?: string | null
  phone?: string | null
  is_company?: boolean
  company_name?: string | null
  contact_name?: string | null
  position?: string | null
  address?: string | null
  billing_address?: string | null
  tax_number?: string | null
  registration_number?: string | null
}

export type OfferVars = {
  total_amount?: number | null
  payment_type?: string | null
  installment_months?: number | null
}

export const ALL_VARIABLES = [
  // Company
  'company_name', 'company_brand', 'business_type',
  'company_tax', 'company_registration', 'company_address',
  'company_bank', 'company_rep', 'company_email', 'company_phone', 'company_website',
  'aam_note',
  // Client
  'client_company', 'client_name', 'client_tax', 'client_registration',
  'client_address', 'client_billing_address', 'client_email', 'client_phone',
  // Document
  'contract_date', 'contract_number',
  // Universal manual fields
  'offer_price', 'payment_terms', 'project_name', 'project_description', 'deadline',
  'contract_start',
  // Weboldal / Webshop
  'warranty',
  // Webshop
  'product_count', 'payment_methods', 'shipping_methods', 'integrations',
  // Havidíjas
  'maintenance_package', 'billing_frequency', 'contract_duration', 'termination_period', 'included_hours',
  // Marketing
  'ad_budget', 'report_frequency',
] as const

export type VariableKey = typeof ALL_VARIABLES[number]

export const VARIABLE_LABELS: Record<VariableKey, string> = {
  company_name:           'Saját cégnév / Név',
  company_brand:          'Márkanév',
  business_type:          'Vállalkozási forma',
  company_tax:            'Saját adószám',
  company_registration:   'Saját cégjegyzékszám',
  company_address:        'Saját székhely',
  company_bank:           'Bankszámlaszám',
  company_rep:            'Képviselő neve',
  company_email:          'Saját e-mail',
  company_phone:          'Saját telefon',
  company_website:        'Saját weboldal',
  aam_note:               'AAM megjegyzés (auto)',
  client_company:         'Ügyfél cégnév / Név',
  client_name:            'Ügyfél kapcsolattartója',
  client_tax:             'Ügyfél adószám',
  client_registration:    'Ügyfél cégjegyzékszám',
  client_address:         'Ügyfél cím',
  client_billing_address: 'Számlázási cím',
  client_email:           'Ügyfél e-mail',
  client_phone:           'Ügyfél telefon',
  contract_date:          'Szerződés dátuma',
  contract_number:        'Szerződés száma',
  offer_price:            'Ár (Ft)',
  payment_terms:          'Fizetési feltételek',
  project_name:           'Projekt neve / Megbízás tárgya',
  project_description:    'Projekt / feladat leírása',
  deadline:               'Teljesítési határidő',
  contract_start:         'Kezdési dátum',
  warranty:               'Garancia időtartama',
  product_count:          'Termékek száma',
  payment_methods:        'Fizetési módok',
  shipping_methods:       'Szállítási módok',
  integrations:           'Integrációk',
  maintenance_package:    'Karbantartási csomag neve',
  billing_frequency:      'Számlázás gyakorisága',
  contract_duration:      'Szerződés időtartama',
  termination_period:     'Felmondási idő',
  included_hours:         'Tartalmazott munkaóra / hó',
  ad_budget:              'Hirdetési keret (Ft/hó)',
  report_frequency:       'Riport gyakorisága',
}

export function buildVariableMap(
  company: CompanySettings,
  customer: CustomerVars | null,
  offer: OfferVars | null,
  overrides: VariableMap = {},
): VariableMap {
  const formatDate = () =>
    new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })

  const formatPrice = (amount: number | null | undefined) =>
    amount ? amount.toLocaleString('hu-HU') : ''

  const formatPaymentType = (type: string | null | undefined, months: number | null | undefined) => {
    if (!type) return 'Előleg 50% + végszámla 50%'
    if (type === 'installments') return `Részletfizetés ${months ?? ''} részletben`
    if (type === 'subscription') return 'Havi előfizetés'
    return 'Egyösszegű fizetés, banki átutalással, 8 napon belül'
  }

  const isAam = company.tax_form === 'aam'
  const aamNote = isAam
    ? 'A Megbízott alanyi adómentes egyéni vállalkozó, ezért a szolgáltatási díj ÁFA-t nem tartalmaz.'
    : ''

  const base: VariableMap = {
    // Company
    company_name:         company.company_name || '',
    company_brand:        company.brand_name || company.company_name || '',
    business_type:        company.business_type || 'Egyéni vállalkozó',
    company_tax:          company.tax_number || '',
    company_registration: company.registration_number || '',
    company_address:      company.address || '',
    company_bank:         company.bank_account || '',
    company_rep:          company.representative_name || company.company_name || '',
    company_email:        company.email || '',
    company_phone:        company.phone || '',
    company_website:      company.website || '',
    aam_note:             aamNote,
    // Client
    client_company:         customer?.is_company
                              ? (customer.company_name || customer.name || '')
                              : (customer?.name || ''),
    client_name:            customer?.is_company
                              ? (customer.contact_name || customer.name || '')
                              : (customer?.name || ''),
    client_tax:             customer?.tax_number || '',
    client_registration:    customer?.registration_number || '',
    client_address:         customer?.address || '',
    client_billing_address: customer?.billing_address || customer?.address || '',
    client_email:           customer?.email || '',
    client_phone:           customer?.phone || '',
    // Document
    contract_date:    formatDate(),
    contract_number:  `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    // Offer / manual defaults
    offer_price:          offer?.total_amount ? formatPrice(offer.total_amount) : '',
    payment_terms:        formatPaymentType(offer?.payment_type, offer?.installment_months),
    project_name:         '',
    project_description:  '',
    deadline:             'A szerződés aláírásától számított 30 munkanapon belül',
    contract_start:       '',
    warranty:             '30 nap',
    product_count:        '',
    payment_methods:      '',
    shipping_methods:     '',
    integrations:         '',
    maintenance_package:  '',
    billing_frequency:    'Havonta',
    contract_duration:    'Határozatlan időre',
    termination_period:   '30 nap (írásban)',
    included_hours:       '2 óra/hó',
    ad_budget:            '',
    report_frequency:     'Havi 1x',
    ...overrides,
  }

  return base
}

export function substituteVariables(template: string, variables: VariableMap): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value)
  }
  return result
}

export function findUnresolvedVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g) || []
  return [...new Set(matches.map(m => m.slice(2, -2).trim()))]
}
