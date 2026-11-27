import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { loadInvoiceFormOptions } from '../../../invoices/formOptions'
import { ProjectForm } from '../../ProjectForm'

export const metadata = { title: 'Projekt szerkesztése' }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: project }, { partners }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    loadInvoiceFormOptions(),
  ])
  if (!project) notFound()
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title={project.name} subtitle="Projekt szerkesztése" />
      <ProjectForm partners={partners} project={project} />
    </div>
  )
}
