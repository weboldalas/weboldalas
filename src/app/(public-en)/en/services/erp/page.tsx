import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/erp'

export const metadata = { ...enMeta, alternates: alternates('en', 'erp') }

export default function ErpPageEn() {
  return <ServicePage data={en} locale="en" />
}
