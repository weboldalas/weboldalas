import { ServicePage } from '@/components/public/ServicePage'
import { alternates } from '@/i18n/routes'
import { en, enMeta } from '@/content/services/booking'

export const metadata = { ...enMeta, alternates: alternates('en', 'booking') }

export default function BookingSystemPageEn() {
  return <ServicePage data={en} locale="en" />
}
