import { PageHeader } from '@/components/crm/ui'
import { loadInvoiceFormOptions } from '../../invoices/formOptions'
import { ProjectForm } from '../ProjectForm'

export const metadata = { title: 'Új projekt' }

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ customer_id?: string }> }) {
  const { customer_id } = await searchParams
  const { partners } = await loadInvoiceFormOptions()
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title="Új projekt" />
      <ProjectForm partners={partners} defaultCustomerId={customer_id} />
    </div>
  )
}
