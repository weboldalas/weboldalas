import { createClient } from '@/utils/supabase/server'
import { ContractWizard } from './ContractWizard'

export const metadata = {
  title: 'Új Szerződés | Weboldalas Admin',
}

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ offer_id?: string; customer_id?: string }>
}) {
  const { offer_id, customer_id } = await searchParams
  const supabase = await createClient()

  const [
    { data: customers },
    { data: templates },
    { data: offer },
  ] = await Promise.all([
    supabase.from('customers').select('id, name, email, phone, is_company, company_name, contact_name, address, tax_number, registration_number').order('name'),
    supabase.from('document_templates').select('id, name, description, type').eq('is_active', true).eq('type', 'contract').order('name'),
    offer_id
      ? supabase.from('offers').select('id, total_amount, payment_type, installment_months, customers(name, company_name, is_company), leads(name)').eq('id', offer_id).single()
      : Promise.resolve({ data: null }),
  ])

  // Pre-select customer from offer
  const offerCustomer = offer?.customers as unknown as { name: string; company_name: string | null; is_company: boolean } | null
  const preCustomerId = customer_id || null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Új Szerződés</h1>
        <p className="text-white/40 mt-1 text-sm">Ügyfél → Sablon → Változók → Szerkesztés</p>
      </div>
      <ContractWizard
        customers={customers || []}
        templates={templates || []}
        preOfferId={offer_id || null}
        preCustomerId={preCustomerId}
        preOfferAmount={offer?.total_amount ?? null}
        preOfferPaymentType={offer?.payment_type ?? null}
        preOfferMonths={offer?.installment_months ?? null}
      />
    </div>
  )
}
