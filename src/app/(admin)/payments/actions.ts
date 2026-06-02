'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createPayment(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    customer_id: formData.get('customer_id') as string,
    amount: Number(formData.get('amount')),
    currency: formData.get('currency') as string,
    payment_type: formData.get('payment_type') as string,
    status: formData.get('status') as string,
    due_date: formData.get('due_date') ? new Date(formData.get('due_date') as string).toISOString() : null,
    payment_date: formData.get('payment_date') ? new Date(formData.get('payment_date') as string).toISOString() : null,
    note: formData.get('note') as string,
  }

  const { error } = await supabase.from('payments').insert([data])

  if (error) {
    console.error('Error creating payment:', error)
    return { error: error.message }
  }

  revalidatePath('/payments')
  revalidatePath(`/customers/${data.customer_id}`)
  redirect('/payments')
}

export async function updatePayment(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    customer_id: formData.get('customer_id') as string,
    amount: Number(formData.get('amount')),
    currency: formData.get('currency') as string,
    payment_type: formData.get('payment_type') as string,
    status: formData.get('status') as string,
    due_date: formData.get('due_date') ? new Date(formData.get('due_date') as string).toISOString() : null,
    payment_date: formData.get('payment_date') ? new Date(formData.get('payment_date') as string).toISOString() : null,
    note: formData.get('note') as string,
  }

  const { error } = await supabase.from('payments').update(data).eq('id', id)

  if (error) {
    console.error('Error updating payment:', error)
    return { error: error.message }
  }

  revalidatePath('/payments')
  revalidatePath(`/customers/${data.customer_id}`)
  redirect('/payments')
}
