import { HomeView } from '@/components/public/views/HomeView'
import { HOME } from '@/content/home'
import { alternates } from '@/i18n/routes'

export const metadata = { ...HOME.hu.meta, alternates: alternates('hu', 'home') }

export default function HomePage() {
  return <HomeView locale="hu" />
}
