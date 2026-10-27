import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/maintenance'

export const metadata = { ...enMeta, alternates: alternates('en', 'maintenance') }

export default function MaintenancePageEn() {
  return <ServicePage data={en} locale="en" />
}
