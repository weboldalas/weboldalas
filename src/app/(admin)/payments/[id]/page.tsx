import { createClient } from '@/utils/supabase/server'
import { PaymentForm } from '../PaymentForm'
import { notFound } from 'next/navigation'

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: payment, error },
    { data: customers }
  ] = await Promise.all([
    supabase.from('payments').select('*').eq('id', id).single(),
    supabase.from('customers').select('id, name').order('name')
  ])

  if (error || !payment) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Befizetés Szerkesztése</h1>
      </div>
      <PaymentForm 
        payment={payment} 
        customers={customers || []} 
      />
    </div>
  )
}
