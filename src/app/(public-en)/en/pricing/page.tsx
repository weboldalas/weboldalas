import { PricingView } from '@/components/public/views/PricingView'
import { PRICING } from '@/content/pricing'
import { alternates } from '@/i18n/routes'

export const metadata = { ...PRICING.en.meta, alternates: alternates('en', 'pricing') }

export default function PricingPageEn() {
  return <PricingView locale="en" />
}
