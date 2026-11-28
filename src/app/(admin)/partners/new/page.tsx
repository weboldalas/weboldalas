import { PageHeader } from '@/components/crm/ui'
import { PartnerForm } from '../PartnerForm'

export const metadata = { title: 'Új partner' }

export default function NewPartnerPage() {
  return (
    <div className="crm-page" style={{ maxWidth: 960 }}>
      <PageHeader title="Új partner" subtitle="Az alapadatok elég az induláshoz, a többit később is kitöltheted." />
      <PartnerForm />
    </div>
  )
}
