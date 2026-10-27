import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/crm'

export const metadata = { ...enMeta, alternates: alternates('en', 'crm') }

export default function CrmPageEn() {
  return <ServicePage data={en} locale="en" />
}
