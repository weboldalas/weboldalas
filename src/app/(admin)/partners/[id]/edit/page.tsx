import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PageHeader } from '@/components/crm/ui'
import { partnerName } from '@/lib/crm/format'
import { PartnerForm } from '../../PartnerForm'

export const metadata = { title: 'Partner szerkesztése' }

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: partner } = await supabase.from('customers').select('*').eq('id', id).single()
  if (!partner) notFound()
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title={partnerName(partner)} subtitle="Partneradatok szerkesztése" />
      <PartnerForm partner={partner} />
    </div>
  )
}
