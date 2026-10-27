import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/landing'

export const metadata = { ...huMeta, alternates: alternates('hu', 'landing') }

export default function LandingPage() {
  return <ServicePage data={hu} locale="hu" />
}
