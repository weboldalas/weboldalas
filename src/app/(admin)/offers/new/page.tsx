import { createClient } from '@/utils/supabase/server'
import { OfferForm } from '../OfferForm'
import { SERVICE_CATALOG } from '../services'

export default async function NewOfferPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string; lead_id?: string; interest_type?: string }>
}) {
  const { customer_id, lead_id, interest_type } = await searchParams
  const supabase = await createClient()

  const [{ data: customers }, { data: leads }] = await Promise.all([
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('leads').select('id, name').order('name'),
  ])

  // Ha van interest_type, előre betöltjük a katalógus tételt
  const defaultItems = interest_type && SERVICE_CATALOG[interest_type]
    ? [SERVICE_CATALOG[interest_type]]
    : undefined

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Új Ajánlat</h1>
      </div>
      <OfferForm
        customers={customers || []}
        leads={leads || []}
        defaultCustomerId={customer_id}
        defaultLeadId={lead_id}
        defaultItems={defaultItems}
      />
    </div>
  )
}
