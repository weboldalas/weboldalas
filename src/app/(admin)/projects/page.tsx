import Link from 'next/link'
import { AlertTriangle, FolderKanban, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, EmptyState, PageHeader, StatusBadge } from '@/components/crm/ui'
import { formatDate, formatMoney, partnerName, todayKey } from '@/lib/crm/format'
import { PROJECT_STATUS } from '@/lib/crm/status'

export const metadata = { title: 'Projektek' }

const FILTERS = [
  { id: 'running', label: 'Futó' },
  { id: 'completed', label: 'Kész' },
  { id: 'all', label: 'Összes' },
] as const

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null }

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const filter = FILTERS.some(f => f.id === status) ? status! : 'running'
  const supabase = await createClient()
  const today = todayKey()
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, status, start_date, due_date, budget, currency, customers(id, name, company_name, is_company)')
    .order('due_date', { ascending: true, nullsFirst: false })

  const all = data ?? []
  const pick = (f: string) => all.filter(p => f === 'all' ? true : f === 'completed' ? ['completed', 'cancelled'].includes(p.status) : !['completed', 'cancelled'].includes(p.status))
  const visible = pick(filter)

  return (
    <div className="crm-page">
      <PageHeader title="Projektek" subtitle="Futó munkák partnerenként, határidővel és kerettel." actions={<Link href="/projects/new" className="crm-btn crm-btn-primary"><Plus /> Új projekt</Link>} />
      {error && <div className="crm-alert is-danger" role="alert"><AlertTriangle />A projektek betöltése nem sikerült. Futtasd le a CRM migrációt. ({error.message})</div>}
      <div className="crm-chips" role="group" aria-label="Szűrés">
        {FILTERS.map(f => (
          <Link key={f.id} href={f.id === 'running' ? '/projects' : `/projects?status=${f.id}`} className={`crm-chip ${filter === f.id ? 'is-active' : ''}`}>{f.label}<span className="crm-chip-count">{pick(f.id).length}</span></Link>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="crm-card"><EmptyState icon={FolderKanban} title="Nincs ilyen projekt" text="Hozz létre projektet egy partnerhez, és kövesd a határidőt." action={{ href: '/projects/new', label: 'Új projekt' }} /></div>
      ) : (
        <div className="crm-grid crm-grid-3">
          {visible.map(p => {
            const partner = (Array.isArray(p.customers) ? p.customers[0] : p.customers) as PartnerRef | null
            const name = partnerName(partner)
            const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.active
            const late = p.due_date && p.due_date < today && !['completed', 'cancelled'].includes(p.status)
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="crm-kpi" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-[15px] font-semibold leading-snug">{p.name}</strong>
                  <StatusBadge label={st.label} tone={st.tone} />
                </div>
                <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-2)' }}><Avatar name={name} size="sm" />{name}</div>
                <div className="mt-auto flex justify-between text-[12.5px]" style={{ color: 'var(--text-3)' }}>
                  <span style={{ color: late ? 'var(--danger)' : undefined, fontWeight: late ? 600 : undefined }}>{p.due_date ? `Határidő: ${formatDate(p.due_date)}` : 'Nincs határidő'}</span>
                  {p.budget ? <span>{formatMoney(p.budget, p.currency ?? 'HUF')}</span> : null}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
