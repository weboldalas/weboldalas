'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createLead(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const nextCallDateRaw = formData.get('next_call_date') as string
  const nextCallDate = nextCallDateRaw ? new Date(nextCallDateRaw).toISOString() : null

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: formData.get('status') as string,
    source: formData.get('source') as string,
    industry: formData.get('industry') as string || null,
    interest_type: formData.get('interest_type') as string,
    note: formData.get('note') as string,
    next_call_date: nextCallDate,
  }

  const { error } = await supabase.from('leads').insert([data])

  if (error) {
    console.error('Error creating lead:', error)
    return { error: error.message }
  }

  revalidatePath('/leads')
  redirect('/leads')
}

export async function updateLead(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const nextCallDateRaw = formData.get('next_call_date') as string
  const nextCallDate = nextCallDateRaw ? new Date(nextCallDateRaw).toISOString() : null

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: formData.get('status') as string,
    source: formData.get('source') as string,
    industry: formData.get('industry') as string || null,
    interest_type: formData.get('interest_type') as string,
    note: formData.get('note') as string,
    next_call_date: nextCallDate,
  }

  const { error } = await supabase.from('leads').update(data).eq('id', id)

  if (error) {
    console.error('Error updating lead:', error)
    return { error: error.message }
  }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  redirect(`/leads/${id}`)
}

export async function deleteLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('leads').delete().eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    return { error: 'Hiba történt az érdeklődő törlése során.' }
  }

  revalidatePath('/leads')
  redirect('/leads')
}

export async function moveLeadStage(id: string, newStatus: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/leads')
}

export async function createLeadNote(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const leadId = formData.get('lead_id') as string
  const nextActionDateRaw = formData.get('next_action_date') as string

  const data = {
    lead_id: leadId,
    body: formData.get('body') as string,
    type: formData.get('type') as string || 'note',
    outcome: formData.get('outcome') as string || null,
    next_action_date: nextActionDateRaw ? new Date(nextActionDateRaw).toISOString() : null,
  }

  if (!data.body) return { error: 'A megjegyzés nem lehet üres.' }

  const { error } = await supabase.from('lead_notes').insert([data])
  if (error) return { error: error.message }

  // If there's a next action date, update it on the lead too
  if (data.next_action_date) {
    await supabase.from('leads').update({ next_call_date: data.next_action_date }).eq('id', leadId)
  }

  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}
