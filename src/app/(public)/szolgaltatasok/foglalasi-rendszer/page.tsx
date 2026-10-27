import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/booking'

export const metadata = { ...huMeta, alternates: alternates('hu', 'booking') }

export default function FoglalasiRendszerPage() {
  return <ServicePage data={hu} locale="hu" />
}
