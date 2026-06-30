'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getTemplate, ContractData } from '@/lib/contract-templates'

export async function createContract(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const templateId = formData.get('template_id') as string
  const customerId = formData.get('customer_id') as string | null
  const offerId = formData.get('offer_id') as string | null
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const notes = formData.get('notes') as string | null

  if (!templateId || !title || !content) {
    return { error: 'Hiányzó kötelező mezők.' }
  }

  const { data, error } = await supabase
    .from('contracts')
    .insert([{
      template_id: templateId,
      customer_id: customerId || null,
      offer_id: offerId || null,
      title,
      content,
      notes: notes || null,
      status: 'draft',
    }])
    .select('id')
    .single()

  if (error || !data) {
    console.error('Error creating contract:', error)
    return { error: error?.message || 'Hiba a szerződés létrehozásakor.' }
  }

  revalidatePath('/contracts')
  redirect(`/contracts/${data.id}`)
}

export async function updateContractContent(id: string, content: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contracts')
    .update({ content })
    .eq('id', id)

  if (error) {
    console.error('Error updating contract:', error)
    return { error: error.message }
  }

  revalidatePath(`/contracts/${id}`)
  return { success: true }
}

export async function updateContractStatus(id: string, status: string) {
  const supabase = await createClient()

  const updates: Record<string, unknown> = { status }
  if (status === 'signed') updates.signed_at = new Date().toISOString()

  const { error } = await supabase
    .from('contracts')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating contract status:', error)
    return { error: error.message }
  }

  revalidatePath(`/contracts/${id}`)
  revalidatePath('/contracts')
  return { success: true }
}

export async function updateContractPdfUrl(id: string, pdfUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contracts')
    .update({ pdf_url: pdfUrl, generated_at: new Date().toISOString(), status: 'generated' })
    .eq('id', id)

  if (error) {
    console.error('Error updating pdf_url:', error)
    return { error: error.message }
  }

  revalidatePath(`/contracts/${id}`)
  revalidatePath('/contracts')
  return { success: true }
}

export async function deleteContract(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('contracts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting contract:', error)
    return { error: 'Hiba történt a szerződés törlése során.' }
  }

  revalidatePath('/contracts')
  redirect('/contracts')
}

export async function quickCreateCustomer(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null

  if (!name) return { error: 'Név megadása kötelező.' }

  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, email: email || null, phone: phone || null }])
    .select('id, name, email, phone')
    .single()

  if (error || !data) {
    console.error('Error creating customer:', error)
    return { error: error?.message || 'Hiba az ügyfél létrehozásakor.' }
  }

  return { customer: data }
}

export async function generateContractContent(
  templateId: string,
  data: ContractData,
): Promise<{ content: string } | { error: string }> {
  const template = getTemplate(templateId)
  if (!template) return { error: 'Sablon nem található.' }

  const content = template.generate(data)
  return { content }
}
