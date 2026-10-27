import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/webshop'

export const metadata = { ...enMeta, alternates: alternates('en', 'webshop') }

export default function WebshopPageEn() {
  return <ServicePage data={en} locale="en" />
}
