import type { SupabaseClient } from '@supabase/supabase-js'

type LeadLike = { name: string | null; email: string | null; phone: string | null; industry?: string | null; interest_type?: string | null }

/**
 * Creates a partner (customers row) from a lead, with the lead as its primary contact.
 * Works with both the user's client and the service-role client.
 */
export async function createPartnerFromLead(supabase: SupabaseClient, lead: LeadLike) {
  const name = lead.name?.trim() || 'Névtelen partner'
  const { data: partner, error } = await supabase
    .from('customers')
    .insert({ name, email: lead.email, phone: lead.phone, contact_name: name, is_company: false, status: 'active' })
    .select('id')
    .single()
  if (error || !partner) return { error: error?.message ?? 'A partner létrehozása nem sikerült.' }

  if (lead.name || lead.email || lead.phone) {
    await supabase.from('partner_contacts').insert({ customer_id: partner.id, name, email: lead.email, phone: lead.phone, is_primary: true })
  }
  return { id: partner.id as string }
}
