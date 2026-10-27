import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { hu, huMeta } from '@/content/services/website'

export const metadata = { ...huMeta, alternates: alternates('hu', 'website') }

export default function BemutatkozoWeboldalPage() {
  return <ServicePage data={hu} locale="hu" />
}
