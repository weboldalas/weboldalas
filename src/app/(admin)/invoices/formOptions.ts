import { createClient } from '@/utils/supabase/server'
import { partnerName } from '@/lib/crm/format'

export async function loadInvoiceFormOptions() {
  const supabase = await createClient()
  const [partners, subs, projects] = await Promise.all([
    supabase.from('customers').select('id, name, company_name, is_company, status').order('name'),
    supabase.from('subscriptions').select('id, customer_id, plan_name, monthly_fee, currency, status').in('status', ['active', 'trial', 'past_due']),
    supabase.from('projects').select('id, customer_id, name, status').order('created_at', { ascending: false }),
  ])
  return {
    partners: (partners.data ?? [])
      .map(p => ({ id: p.id, label: partnerName(p) + (p.status === 'former' ? ' (korábbi)' : '') }))
      .sort((a, b) => a.label.localeCompare(b.label, 'hu')),
    subscriptions: subs.data ?? [],
    projects: projects.data ?? [],
  }
}
