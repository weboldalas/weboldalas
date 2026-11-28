import { PageHeader } from '@/components/crm/ui'
import { addDays, todayKey } from '@/lib/crm/format'
import { InvoiceForm } from '../InvoiceForm'
import { loadInvoiceFormOptions } from '../formOptions'

export const metadata = { title: 'Új számla' }

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ customer_id?: string; subscription_id?: string; project_id?: string }> }) {
  const { customer_id, subscription_id, project_id } = await searchParams
  const options = await loadInvoiceFormOptions()
  const today = todayKey()
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title="Új számla" subtitle="Rögzítsd, mit kell fizetnie a partnernek. Ha befizeti, egy kattintással fizetettnek jelölheted." />
      <InvoiceForm {...options} defaults={{ customerId: customer_id, subscriptionId: subscription_id, projectId: project_id, issueDate: today, dueDate: addDays(today, 8) }} />
    </div>
  )
}
