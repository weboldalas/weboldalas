import { ServicesOverviewView } from '@/components/public/views/ServicesOverviewView'
import { SERVICES_OVERVIEW } from '@/content/servicesOverview'
import { alternates } from '@/i18n/routes'

export const metadata = { ...SERVICES_OVERVIEW.en.meta, alternates: alternates('en', 'services') }

export default function ServicesPageEn() {
  return <ServicesOverviewView locale="en" />
}
