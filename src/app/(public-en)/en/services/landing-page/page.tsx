import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/landing'

export const metadata = { ...enMeta, alternates: alternates('en', 'landing') }

export default function LandingPagePageEn() {
  return <ServicePage data={en} locale="en" />
}
