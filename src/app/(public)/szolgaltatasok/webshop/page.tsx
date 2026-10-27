import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/webshop'

export const metadata = { ...huMeta, alternates: alternates('hu', 'webshop') }

export default function WebshopPage() {
  return <ServicePage data={hu} locale="hu" />
}
