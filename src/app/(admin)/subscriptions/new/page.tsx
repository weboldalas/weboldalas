import { createClient } from '@/utils/supabase/server'
import { SubscriptionForm } from '../SubscriptionForm'

export default async function NewSubscriptionPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Új Előfizetés</h1>
      </div>
      <SubscriptionForm 
        customers={customers || []} 
        defaultCustomerId={resolvedSearchParams?.customer_id} 
      />
    </div>
  )
}
