import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, CheckSquare, FolderKanban, Pencil, Plus, Receipt } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, CardHeader, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatDate, formatMoney, partnerName, todayKey } from '@/lib/crm/format'
import { invoiceDisplayStatus, invoiceOpenAmount, invoicePaidAmount } from '@/lib/crm/finance'
import { INVOICE_STATUS, PROJECT_STATUS } from '@/lib/crm/status'
import { DeleteProjectButton } from './DeleteProjectButton'

export const metadata = { title: 'Projekt' }

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null }

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const today = todayKey()
  const [{ data: project }, { data: invoices }] = await Promise.all([
    supabase.from('projects').select('*, customers(id, name, company_name, is_company)').eq('id', id).single(),
    supabase.from('invoices').select('id, number, status, total, currency, due_date, issue_date, payments(amount, status)').eq('project_id', id).order('issue_date', { ascending: false }),
  ])
  if (!project) notFound()

  const partner = (Array.isArray(project.customers) ? project.customers[0] : project.customers) as PartnerRef | null
  const name = partnerName(partner)
  const st = PROJECT_STATUS[project.status] ?? PROJECT_STATUS.active
  const list = invoices ?? []
  const billed = list.filter(i => i.status !== 'cancelled').reduce((s, i) => s + Number(i.total), 0)
  const paid = list.reduce((s, i) => s + invoicePaidAmount(i), 0)
  const budget = Number(project.budget ?? 0)

  return (
    <div className="crm-page" style={{ maxWidth: 1100 }}>
      <div className="crm-hero">
        <span className="crm-avatar is-lg" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}><FolderKanban size={24} /></span>
        <div className="crm-hero-main">
          <div className="flex flex-wrap items-center gap-2"><h1 className="crm-title">{project.name}</h1><StatusBadge label={st.label} tone={st.tone} /></div>
          <div className="crm-hero-meta">
            {partner && <Link href={`/partners/${partner.id}`}><Avatar name={name} size="sm" />{name}</Link>}
            <span><CalendarDays />{project.start_date ? formatDate(project.start_date) : 'Nincs kezdés'} – {project.due_date ? formatDate(project.due_date) : 'nincs határidő'}</span>
          </div>
        </div>
        <div className="crm-head-actions">
          <Link href={`/projects/${id}/edit`} className="crm-btn crm-btn-secondary"><Pencil /> Szerkesztés</Link>
          <Link href={`/invoices/new?customer_id=${project.customer_id}&project_id=${id}`} className="crm-btn crm-btn-primary"><Plus /> Számla</Link>
        </div>
      </div>

      <div className="crm-grid crm-grid-kpi">
        <div className="crm-kpi"><div className="crm-kpi-label">Keret</div><div className="crm-kpi-value">{budget ? formatMoney(budget, project.currency ?? 'HUF') : '—'}</div></div>
        <div className="crm-kpi"><div className="crm-kpi-label">Kiszámlázva</div><div className="crm-kpi-value">{formatMoney(billed, project.currency ?? 'HUF')}</div>{budget > 0 && <div className="crm-progress" style={{ marginTop: 12 }}><i style={{ width: `${Math.min(100, (billed / budget) * 100)}%` }} /></div>}</div>
        <div className="crm-kpi"><div className="crm-kpi-label">Befolyt</div><div className="crm-kpi-value">{formatMoney(paid, project.currency ?? 'HUF')}</div></div>
        <div className="crm-kpi"><div className="crm-kpi-label">Határidő</div><div className="crm-kpi-value" style={{ fontSize: 20, color: project.due_date && project.due_date < today && project.status !== 'completed' ? 'var(--danger)' : undefined }}>{project.due_date ? formatDate(project.due_date) : '—'}</div></div>
      </div>

      <div className="crm-grid crm-grid-main">
        <div className="crm-grid">
          {project.description && (
            <section className="crm-card crm-card-pad">
              <h2 className="crm-section-title mb-2">Leírás</h2>
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{project.description}</p>
            </section>
          )}
          <section className="crm-card">
            <CardHeader title="Feladatok" icon={CheckSquare} />
            <EmptyState icon={CheckSquare} title="A projektfeladatok a 2. fázisban érkeznek" text="Itt fogjátok a partnerrel közösen kezelni a feladatokat, kommentekkel és értesítésekkel." />
          </section>
        </div>
        <section className="crm-card">
          <CardHeader title="Számlák" icon={Receipt} />
          {list.length === 0 ? <EmptyState icon={Receipt} title="Nincs számla a projekthez" action={{ href: `/invoices/new?customer_id=${project.customer_id}&project_id=${id}`, label: 'Új számla' }} /> : (
            <div className="crm-list">
              {list.map(inv => {
                const s = INVOICE_STATUS[invoiceDisplayStatus(inv, today)] ?? INVOICE_STATUS.issued
                const open = invoiceOpenAmount(inv)
                return (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="crm-row">
                    <span className="crm-row-main"><strong>{inv.number || 'Sorszám nélkül'}</strong><span>{formatDate(inv.issue_date)}</span></span>
                    <span className="crm-row-end"><strong>{formatMoney(open || inv.total, inv.currency ?? 'HUF')}</strong><StatusBadge label={s.label} tone={s.tone} /></span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
      <div className="flex justify-end"><DeleteProjectButton id={id} /></div>
    </div>
  )
}
