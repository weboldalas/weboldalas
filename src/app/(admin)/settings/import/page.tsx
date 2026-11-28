import { PageHeader } from '@/components/crm/ui'
import { PerfexImport } from './PerfexImport'

export const metadata = { title: 'Perfex import' }

export default function PerfexImportPage() {
  return (
    <div className="crm-page" style={{ maxWidth: 900 }}>
      <PageHeader title="Perfex import" subtitle="Partnerek, kapcsolattartók, projektek, feladatok és kommentek átvétele a Perfexből. Többször is futtatható, nem duplikál." />
      <PerfexImport />
    </div>
  )
}
