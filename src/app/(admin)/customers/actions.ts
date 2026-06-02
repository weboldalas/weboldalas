'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createCustomer(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  }

  const { error } = await supabase.from('customers').insert([data])

  if (error) {
    console.error('Error creating customer:', error)
    return { error: error.message }
  }

  revalidatePath('/customers')
  redirect('/customers')
}

export async function updateCustomer(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  }

  const { error } = await supabase.from('customers').update(data).eq('id', id)

  if (error) {
    console.error('Error updating customer:', error)
    return { error: error.message }
  }

  revalidatePath('/customers')
  redirect('/customers')
}

export async function convertLeadToCustomer(leadId: string) {
  const supabase = await createClient()

  // 1. Fetch lead
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (fetchError || !lead) {
    console.error('Érdeklődő nem található.')
    return
  }

  // 2. Create customer
  const { error: insertError } = await supabase.from('customers').insert([
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    },
  ])

  if (insertError) {
    console.error('Hiba az ügyfél létrehozásakor.')
    return
  }

  // 3. Update lead status
  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'won' })
    .eq('id', leadId)

  if (updateError) {
    console.error('Hiba a lead frissítésekor.')
    return
  }

  revalidatePath('/leads')
  revalidatePath('/customers')
  redirect('/customers')
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('customers').delete().eq('id', id)

  if (error) {
    console.error('Error deleting customer:', error)
    return { error: 'Hiba történt az ügyfél törlése során.' }
  }

  revalidatePath('/customers')
  redirect('/customers')
}
