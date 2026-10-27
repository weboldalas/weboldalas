import { HomeView } from '@/components/public/views/HomeView'
import { HOME } from '@/content/home'
import { alternates } from '@/i18n/routes'

export const metadata = { ...HOME.en.meta, alternates: alternates('en', 'home') }

export default function HomePageEn() {
  return <HomeView locale="en" />
}
