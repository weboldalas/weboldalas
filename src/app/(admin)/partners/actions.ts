'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { createPartnerFromLead } from '@/lib/crm/partners'

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean } | null

const text = (max = 300) => z.string().trim().max(max).transform(v => v || null)

const partnerSchema = z.object({
  is_company: z.enum(['true', 'false']).transform(v => v === 'true'),
  company_name: text(200),
  name: text(200),
  tax_number: text(40),
  registration_number: text(40),
  address: text(400),
  billing_address: text(400),
  website: text(300),
  email: z.string().trim().max(200).refine(v => !v || z.email().safeParse(v).success, 'Érvénytelen e-mail cím.').transform(v => v || null),
  billing_email: z.string().trim().max(200).refine(v => !v || z.email().safeParse(v).success, 'Érvénytelen e-mail cím.').transform(v => v || null),
  phone: text(60),
  status: z.enum(['active', 'paused', 'former']),
  tags: z.string().trim().max(400).transform(v => [...new Set(v.split(',').map(t => t.trim()).filter(Boolean))].slice(0, 12)),
  notes: text(5000),
})

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Add meg a kapcsolattartó nevét.').max(200),
  email: z.string().trim().max(200).refine(v => !v || z.email().safeParse(v).success, 'Érvénytelen e-mail cím.').transform(v => v || null),
  phone: text(60),
  position: text(120),
  notes: text(2000),
  is_primary: z.string().optional().transform(v => v === 'on' || v === 'true'),
})

function read(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map(key => [key, (formData.get(key) as string | null) ?? '']))
}

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) out[String(issue.path[0])] = issue.message
  return out
}

function displayName(data: z.infer<typeof partnerSchema>, contactName: string | null) {
  return (data.is_company ? data.company_name : data.name) || data.company_name || data.name || contactName
}

export async function createPartner(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = partnerSchema.safeParse(read(formData, Object.keys(partnerSchema.shape)))
  if (!parsed.success) return { error: 'Néhány mezőt javítani kell.', fieldErrors: fieldErrors(parsed.error) }
  const data = parsed.data

  const contactRaw = read(formData, ['contact_name', 'contact_email', 'contact_phone', 'contact_position'])
  const hasContact = Object.values(contactRaw).some(Boolean)
  const contact = hasContact
    ? contactSchema.safeParse({ name: contactRaw.contact_name, email: contactRaw.contact_email, phone: contactRaw.contact_phone, position: contactRaw.contact_position, notes: '', is_primary: 'true' })
    : null
  if (contact && !contact.success) {
    const errs = fieldErrors(contact.error)
    return { error: 'Néhány mezőt javítani kell.', fieldErrors: Object.fromEntries(Object.entries(errs).map(([k, v]) => [`contact_${k}`, v])) }
  }

  const name = displayName(data, contact?.success ? contact.data.name : null)
  if (!name) return { error: 'Add meg a cég vagy a magánszemély nevét.', fieldErrors: { [data.is_company ? 'company_name' : 'name']: 'Kötelező mező.' } }

  const supabase = await createClient()
  const primary = contact?.success ? contact.data : null
  const { data: partner, error } = await supabase.from('customers').insert({
    ...data,
    name,
    email: data.email ?? primary?.email ?? null,
    phone: data.phone ?? primary?.phone ?? null,
    contact_name: primary?.name ?? null,
    position: primary?.position ?? null,
  }).select('id').single()

  if (error || !partner) return { error: `A partner mentése nem sikerült: ${error?.message ?? 'ismeretlen hiba'}` }

  if (primary) {
    const { error: contactError } = await supabase.from('partner_contacts').insert({ ...primary, customer_id: partner.id, is_primary: true })
    if (contactError) console.error('Contact insert failed', contactError)
  }

  revalidatePath('/partners')
  redirect(`/partners/${partner.id}`)
}

export async function updatePartner(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = partnerSchema.safeParse(read(formData, Object.keys(partnerSchema.shape)))
  if (!parsed.success) return { error: 'Néhány mezőt javítani kell.', fieldErrors: fieldErrors(parsed.error) }
  const name = displayName(parsed.data, null)
  if (!name) return { error: 'Add meg a cég vagy a magánszemély nevét.' }

  const supabase = await createClient()
  const { error } = await supabase.from('customers').update({ ...parsed.data, name }).eq('id', id)
  if (error) return { error: `A mentés nem sikerült: ${error.message}` }

  revalidatePath('/partners')
  revalidatePath(`/partners/${id}`)
  redirect(`/partners/${id}`)
}

export async function deletePartner(id: string): Promise<FormState> {
  const supabase = await createClient()
  const { count } = await supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('customer_id', id)
  if (count) return { error: 'Ennek a partnernek vannak számlái, ezért nem törölhető. Állítsd „Korábbi” státuszra.' }
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) return { error: `A törlés nem sikerült: ${error.message}` }
  revalidatePath('/partners')
  redirect('/partners')
}

/** Keeps the partner's legacy single-contact columns (used by offers and contract templates) in sync with the primary contact. */
async function syncPrimary(supabase: Awaited<ReturnType<typeof createClient>>, customerId: string) {
  const { data: primary } = await supabase.from('partner_contacts').select('name, email, phone, position')
    .eq('customer_id', customerId).eq('is_primary', true).limit(1).maybeSingle()
  if (!primary) return
  const { data: partner } = await supabase.from('customers').select('email, phone').eq('id', customerId).single()
  await supabase.from('customers').update({
    contact_name: primary.name,
    position: primary.position,
    email: partner?.email || primary.email,
    phone: partner?.phone || primary.phone,
  }).eq('id', customerId)
}

export async function saveContact(customerId: string, contactId: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(read(formData, ['name', 'email', 'phone', 'position', 'notes', 'is_primary']))
  if (!parsed.success) return { error: 'Néhány mezőt javítani kell.', fieldErrors: fieldErrors(parsed.error) }

  const supabase = await createClient()
  const { count } = await supabase.from('partner_contacts').select('id', { count: 'exact', head: true }).eq('customer_id', customerId)
  // The first contact is always the primary one.
  const isPrimary = parsed.data.is_primary || !count || (count === 1 && !!contactId)

  if (isPrimary) {
    await supabase.from('partner_contacts').update({ is_primary: false }).eq('customer_id', customerId).neq('id', contactId ?? '00000000-0000-0000-0000-000000000000')
  }

  const row = { ...parsed.data, is_primary: isPrimary, customer_id: customerId }
  const { error } = contactId
    ? await supabase.from('partner_contacts').update(row).eq('id', contactId).eq('customer_id', customerId)
    : await supabase.from('partner_contacts').insert(row)
  if (error) return { error: `A mentés nem sikerült: ${error.message}` }

  if (isPrimary) await syncPrimary(supabase, customerId)
  revalidatePath(`/partners/${customerId}`)
  return { ok: true }
}

export async function deleteContact(customerId: string, contactId: string): Promise<FormState> {
  const supabase = await createClient()
  const { data: contact } = await supabase.from('partner_contacts').select('is_primary').eq('id', contactId).single()
  const { error } = await supabase.from('partner_contacts').delete().eq('id', contactId).eq('customer_id', customerId)
  if (error) return { error: `A törlés nem sikerült: ${error.message}` }
  if (contact?.is_primary) {
    const { data: next } = await supabase.from('partner_contacts').select('id').eq('customer_id', customerId).order('created_at').limit(1).maybeSingle()
    if (next) {
      await supabase.from('partner_contacts').update({ is_primary: true }).eq('id', next.id)
      await syncPrimary(supabase, customerId)
    }
  }
  revalidatePath(`/partners/${customerId}`)
  return { ok: true }
}

export async function convertLeadToPartner(leadId: string) {
  const supabase = await createClient()
  const { data: lead } = await supabase.from('leads').select('name, email, phone').eq('id', leadId).single()
  if (!lead) return
  const result = await createPartnerFromLead(supabase, lead)
  if ('error' in result) { console.error(result.error); return }
  await supabase.from('leads').update({ status: 'elfogadott' }).eq('id', leadId)
  revalidatePath('/leads')
  revalidatePath('/partners')
  redirect(`/partners/${result.id}`)
}
