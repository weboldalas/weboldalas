export type VariableMap = Record<string, string>

export type CompanyVars = {
  company_name: string
  logo_url: string
  address: string
  tax_number: string
  registration_number: string
  bank_account: string
  representative_name: string
  email: string
  phone: string
  website: string
}

export type CustomerVars = {
  name: string
  email: string
  phone: string
  is_company: boolean
  company_name: string
  contact_name: string
  position: string
  address: string
  billing_address: string
  tax_number: string
  registration_number: string
}

export type OfferVars = {
  total_amount: number | null
  payment_type: string | null
  installment_months: number | null
}

// All template variable names
export const ALL_VARIABLES = [
  // Company
  'company_name', 'company_tax', 'company_registration', 'company_address',
  'company_bank', 'company_rep', 'company_email', 'company_phone', 'company_website',
  // Client
  'client_company', 'client_name', 'client_tax', 'client_registration',
  'client_address', 'client_billing_address', 'client_email', 'client_phone',
  // Document
  'contract_date', 'contract_number',
  // Offer / manual
  'offer_price', 'payment_terms', 'project_description', 'deadline',
] as const

export type VariableKey = typeof ALL_VARIABLES[number]

export const VARIABLE_LABELS: Record<VariableKey, string> = {
  company_name:           'Saját cégnév',
  company_tax:            'Saját adószám',
  company_registration:   'Saját cégjegyzékszám',
  company_address:        'Saját székhely',
  company_bank:           'Bankszámlaszám',
  company_rep:            'Képviselő neve',
  company_email:          'Saját e-mail',
  company_phone:          'Saját telefon',
  company_website:        'Saját weboldal',
  client_company:         'Ügyfél cégnév',
  client_name:            'Ügyfél neve / Kapcsolattartó',
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
  project_description:    'Projekt leírása',
  deadline:               'Határidő',
}

// Manual-fill variables (not auto-derived from DB)
export const MANUAL_VARIABLES: VariableKey[] = [
  'offer_price', 'payment_terms', 'project_description', 'deadline', 'contract_number',
]

export function buildVariableMap(
  company: Partial<CompanyVars>,
  customer: Partial<CustomerVars> | null,
  offer: Partial<OfferVars> | null,
  overrides: VariableMap = {},
): VariableMap {
  const formatDate = () =>
    new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })

  const formatPrice = (amount: number | null) =>
    amount ? amount.toLocaleString('hu-HU') : ''

  const formatPaymentType = (type: string | null, months: number | null) => {
    if (!type) return 'Előleg 50% + végszámla 50%'
    if (type === 'installments') return `Részletfizetés ${months ?? ''} részletben`
    if (type === 'subscription') return 'Havi előfizetés'
    return 'Egyösszegű fizetés, banki átutalással, 8 napon belül'
  }

  const base: VariableMap = {
    // Company
    company_name:         company.company_name || '',
    company_tax:          company.tax_number || '',
    company_registration: company.registration_number || '',
    company_address:      company.address || '',
    company_bank:         company.bank_account || '',
    company_rep:          company.representative_name || '',
    company_email:        company.email || '',
    company_phone:        company.phone || '',
    company_website:      company.website || '',
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
    contract_date:   formatDate(),
    contract_number: `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    // Offer / manual defaults
    offer_price:         offer?.total_amount ? formatPrice(offer.total_amount) : '',
    payment_terms:       formatPaymentType(offer?.payment_type ?? null, offer?.installment_months ?? null),
    project_description: '',
    deadline:            'A szerződés aláírásától számított 30 munkanapon belül',
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
