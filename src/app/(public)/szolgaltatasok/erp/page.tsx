import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/erp'

export const metadata = { ...huMeta, alternates: alternates('hu', 'erp') }

export default function ErpPage() {
  return <ServicePage data={hu} locale="hu" />
}
