import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/website'

export const metadata = { ...enMeta, alternates: alternates('en', 'website') }

export default function WebsitePageEn() {
  return <ServicePage data={en} locale="en" />
}
