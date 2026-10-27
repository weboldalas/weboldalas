import { ReferencesView } from '@/components/public/views/ReferencesView'
import { REFERENCES_PAGE } from '@/content/referencesPage'
import { alternates } from '@/i18n/routes'

export const metadata = { ...REFERENCES_PAGE.en.meta, alternates: alternates('en', 'references') }

export default function ReferencesPageEn() {
  return <ReferencesView locale="en" />
}
