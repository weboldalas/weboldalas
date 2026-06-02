'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createSubscription(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    customer_id: formData.get('customer_id') as string,
    plan_name: formData.get('plan_name') as string,
    monthly_fee: Number(formData.get('monthly_fee')),
    currency: formData.get('currency') as string,
    status: formData.get('status') as string,
    start_date: formData.get('start_date') ? new Date(formData.get('start_date') as string).toISOString() : null,
    end_date: formData.get('end_date') ? new Date(formData.get('end_date') as string).toISOString() : null,
    next_billing_date: formData.get('next_billing_date') ? new Date(formData.get('next_billing_date') as string).toISOString() : null,
    note: formData.get('note') as string,
  }

  const { error } = await supabase.from('subscriptions').insert([data])

  if (error) {
    console.error('Error creating subscription:', error)
    return { error: error.message }
  }

  revalidatePath('/subscriptions')
  revalidatePath('/payments')
  revalidatePath(`/customers/${data.customer_id}`)
  redirect('/subscriptions')
}

export async function updateSubscription(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    customer_id: formData.get('customer_id') as string,
    plan_name: formData.get('plan_name') as string,
    monthly_fee: Number(formData.get('monthly_fee')),
    currency: formData.get('currency') as string,
    status: formData.get('status') as string,
    start_date: formData.get('start_date') ? new Date(formData.get('start_date') as string).toISOString() : null,
    end_date: formData.get('end_date') ? new Date(formData.get('end_date') as string).toISOString() : null,
    next_billing_date: formData.get('next_billing_date') ? new Date(formData.get('next_billing_date') as string).toISOString() : null,
    note: formData.get('note') as string,
  }

  const { error } = await supabase.from('subscriptions').update(data).eq('id', id)

  if (error) {
    console.error('Error updating subscription:', error)
    return { error: error.message }
  }

  revalidatePath('/subscriptions')
  revalidatePath('/payments')
  revalidatePath(`/customers/${data.customer_id}`)
  redirect('/subscriptions')
}
