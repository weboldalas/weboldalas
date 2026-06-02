import { createClient } from '@/utils/supabase/server'
import { SubscriptionForm } from '../SubscriptionForm'
import { notFound } from 'next/navigation'

export default async function EditSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: subscription, error },
    { data: customers }
  ] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('id', id).single(),
    supabase.from('customers').select('id, name').order('name')
  ])

  if (error || !subscription) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Előfizetés Szerkesztése</h1>
      </div>
      <SubscriptionForm 
        subscription={subscription} 
        customers={customers || []} 
      />
    </div>
  )
}
