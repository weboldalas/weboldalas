import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/maintenance'

export const metadata = { ...huMeta, alternates: alternates('hu', 'maintenance') }

export default function UzemeltesPage() {
  return <ServicePage data={hu} locale="hu" />
}
