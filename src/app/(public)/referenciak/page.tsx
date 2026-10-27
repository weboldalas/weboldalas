import { ReferencesView } from '@/components/public/views/ReferencesView'
import { REFERENCES_PAGE } from '@/content/referencesPage'
import { alternates } from '@/i18n/routes'

export const metadata = { ...REFERENCES_PAGE.hu.meta, alternates: alternates('hu', 'references') }

export default function ReferenciakPage() {
  return <ReferencesView locale="hu" />
}
