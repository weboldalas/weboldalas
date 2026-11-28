import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { addDays, todayKey } from '@/lib/crm/format'
import { InvoiceForm } from '../../InvoiceForm'
import { loadInvoiceFormOptions } from '../../formOptions'

export const metadata = { title: 'Számla szerkesztése' }

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: invoice }, options] = await Promise.all([
    supabase.from('invoices').select('*, invoice_items(description, quantity, unit_price, position)').eq('id', id).single(),
    loadInvoiceFormOptions(),
  ])
  if (!invoice) notFound()
  const items = [...(invoice.invoice_items ?? [])].sort((a, b) => a.position - b.position)
  const today = todayKey()
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title={invoice.number ? `${invoice.number} szerkesztése` : 'Számla szerkesztése'} />
      <InvoiceForm {...options} initial={{ ...invoice, items }} defaults={{ issueDate: today, dueDate: addDays(today, 8) }} />
    </div>
  )
}
