import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/crm'

export const metadata = { ...huMeta, alternates: alternates('hu', 'crm') }

export default function CrmPage() {
  return <ServicePage data={hu} locale="hu" />
}
