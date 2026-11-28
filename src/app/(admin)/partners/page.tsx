import Link from 'next/link'
import { AlertTriangle, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { invoiceDisplayStatus, invoiceOpenAmount } from '@/lib/crm/finance'
import { partnerName, todayKey } from '@/lib/crm/format'
import { PartnersTable, type PartnerListItem } from './PartnersTable'

export const metadata = { title: 'Partnerek' }

export default async function PartnersPage() {
  const supabase = await createClient()
  const today = todayKey()
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, company_name, is_company, email, phone, status, tags, created_at, partner_contacts(name, is_primary), subscriptions(monthly_fee, currency, status), invoices(id, total, status, due_date, payments(amount, status))')
    .order('created_at', { ascending: false })

  const partners: PartnerListItem[] = (data ?? []).map(p => {
    const contacts = p.partner_contacts ?? []
    const primary = contacts.find(c => c.is_primary) ?? contacts[0]
    const invoices = p.invoices ?? []
    return {
      id: p.id,
      name: partnerName(p),
      email: p.email,
      phone: p.phone,
      status: p.status ?? 'active',
      tags: p.tags ?? [],
      contact: primary?.name ?? null,
      contactCount: contacts.length,
      mrr: (p.subscriptions ?? []).filter(s => s.status === 'active' && (s.currency ?? 'HUF') === 'HUF').reduce((sum, s) => sum + Number(s.monthly_fee), 0),
      open: invoices.reduce((sum, inv) => sum + invoiceOpenAmount(inv), 0),
      overdue: invoices.some(inv => invoiceDisplayStatus(inv, today) === 'overdue' && invoiceOpenAmount(inv) > 0),
    }
  })

  return (
    <div className="crm-page">
      <PageHeader
        title="Partnerek"
        subtitle="Minden partnered egy helyen: kapcsolattartók, havidíjak, ajánlatok, számlák és projektek."
        actions={<Link href="/partners/new" className="crm-btn crm-btn-primary"><Plus /> Új partner</Link>}
      />
      {error && <div className="crm-alert is-danger" role="alert"><AlertTriangle />A partnerek betöltése nem sikerült. Ha még nem futtattad, futtasd le a CRM migrációt. ({error.message})</div>}
      <PartnersTable partners={partners} />
    </div>
  )
}
