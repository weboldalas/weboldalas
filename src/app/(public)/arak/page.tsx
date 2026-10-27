import { PricingView } from '@/components/public/views/PricingView'
import { PRICING } from '@/content/pricing'
import { alternates } from '@/i18n/routes'

export const metadata = { ...PRICING.hu.meta, alternates: alternates('hu', 'pricing') }

export default function ArakPage() {
  return <PricingView locale="hu" />
}
