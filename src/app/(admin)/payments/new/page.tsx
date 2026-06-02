import { createClient } from '@/utils/supabase/server'
import { PaymentForm } from '../PaymentForm'

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  // Fetch customers for the dropdown
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name')
    .order('name')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Új Befizetés</h1>
      </div>
      <PaymentForm 
        customers={customers || []} 
        defaultCustomerId={resolvedSearchParams?.customer_id} 
      />
    </div>
  )
}
