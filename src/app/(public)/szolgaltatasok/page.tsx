import { ServicesOverviewView } from '@/components/public/views/ServicesOverviewView'
import { SERVICES_OVERVIEW } from '@/content/servicesOverview'
import { alternates } from '@/i18n/routes'

export const metadata = { ...SERVICES_OVERVIEW.hu.meta, alternates: alternates('hu', 'services') }

export default function SzolgaltatasokPage() {
  return <ServicesOverviewView locale="hu" />
}
