import Link from 'next/link'
import { AlertTriangle, Plus, Receipt } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, EmptyState, PageHeader, StatusBadge } from '@/components/crm/ui'
import { daysBetween, formatDate, formatMoney, partnerName, todayKey } from '@/lib/crm/format'
import { invoiceDisplayStatus, invoiceOpenAmount } from '@/lib/crm/finance'
import { INVOICE_KIND, INVOICE_STATUS } from '@/lib/crm/status'
import { GenerateRetainersButton } from './GenerateRetainersButton'

export const metadata = { title: 'Számlák' }

const FILTERS = [
  { id: 'open', label: 'Nyitott' },
  { id: 'overdue', label: 'Lejárt' },
  { id: 'paid', label: 'Fizetve' },
  { id: 'draft', label: 'Piszkozat' },
  { id: 'all', label: 'Összes' },
] as const
type Filter = typeof FILTERS[number]['id']

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null }

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string; kind?: string }> }) {
  const { status: rawStatus, kind } = await searchParams
  const filter: Filter = FILTERS.some(f => f.id === rawStatus) ? rawStatus as Filter : 'open'
  const supabase = await createClient()
  const today = todayKey()

  const { data, error } = await supabase
    .from('invoices')
    .select('id, number, kind, status, issue_date, due_date, total, currency, customers(id, name, company_name, is_company), payments(amount, status)')
    .order('issue_date', { ascending: false })
    .limit(500)

  const all = (data ?? []).map(inv => {
    const customer = (Array.isArray(inv.customers) ? inv.customers[0] : inv.customers) as PartnerRef | null
    return { ...inv, customer, open: invoiceOpenAmount(inv), display: invoiceDisplayStatus(inv, today) }
  })
  const byKind = kind === 'recurring' || kind === 'one_off' ? all.filter(i => i.kind === kind) : all
  const pick = (f: Filter) => byKind.filter(i =>
    f === 'all' ? true
    : f === 'open' ? i.open > 0
    : f === 'overdue' ? i.display === 'overdue' && i.open > 0
    : f === 'paid' ? i.status === 'paid'
    : i.status === 'draft')
  const visible = pick(filter)
  const openSum = byKind.reduce((s, i) => s + ((i.currency ?? 'HUF') === 'HUF' ? i.open : 0), 0)
  const overdueSum = byKind.filter(i => i.display === 'overdue').reduce((s, i) => s + ((i.currency ?? 'HUF') === 'HUF' ? i.open : 0), 0)
  const href = (params: { status?: string; kind?: string }) => {
    const q = new URLSearchParams()
    const s = params.status ?? filter
    const k = params.kind ?? kind
    if (s !== 'open') q.set('status', s)
    if (k) q.set('kind', k)
    const str = q.toString()
    return str ? `/invoices?${str}` : '/invoices'
  }

  return (
    <div className="crm-page">
      <PageHeader
        title="Számlák"
        subtitle={<>Nyitott: <strong style={{ color: 'var(--text)' }}>{formatMoney(openSum)}</strong>{overdueSum > 0 && <>, ebből lejárt: <strong style={{ color: 'var(--danger)' }}>{formatMoney(overdueSum)}</strong></>}</>}
        actions={<>
          <GenerateRetainersButton />
          <Link href="/invoices/new" className="crm-btn crm-btn-primary"><Plus /> Új számla</Link>
        </>}
      />
      {error && <div className="crm-alert is-danger" role="alert"><AlertTriangle />A számlák betöltése nem sikerült. Futtasd le a CRM migrációt. ({error.message})</div>}

      <div className="crm-toolbar">
        <div className="crm-chips" role="group" aria-label="Állapot">
          {FILTERS.map(f => (
            <Link key={f.id} href={href({ status: f.id })} className={`crm-chip ${filter === f.id ? 'is-active' : ''}`} aria-current={filter === f.id ? 'page' : undefined}>
              {f.label}<span className="crm-chip-count">{pick(f.id).length}</span>
            </Link>
          ))}
        </div>
        <div className="crm-segmented" role="group" aria-label="Típus" style={{ marginLeft: 'auto' }}>
          <Link href={href({ kind: '' })} className={!kind ? 'is-active' : ''} style={{ height: 28, padding: '0 10px', borderRadius: 7, fontSize: 12.5, display: 'inline-flex', alignItems: 'center' }}>Mind</Link>
          <Link href={href({ kind: 'recurring' })} className={kind === 'recurring' ? 'is-active' : ''} style={{ height: 28, padding: '0 10px', borderRadius: 7, fontSize: 12.5, display: 'inline-flex', alignItems: 'center' }}>Havidíj</Link>
          <Link href={href({ kind: 'one_off' })} className={kind === 'one_off' ? 'is-active' : ''} style={{ height: 28, padding: '0 10px', borderRadius: 7, fontSize: 12.5, display: 'inline-flex', alignItems: 'center' }}>Eseti</Link>
        </div>
      </div>

      <div className="crm-card overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState icon={Receipt} title={filter === 'open' ? 'Nincs nyitott számla' : 'Nincs ilyen számla'} text={filter === 'open' ? 'Minden kiállított számla ki van fizetve.' : undefined} action={{ href: '/invoices/new', label: 'Új számla' }} />
        ) : (
          <>
            <div className="crm-table-wrap has-cards">
              <table className="crm-table">
                <thead><tr><th>Partner</th><th>Sorszám</th><th>Típus</th><th>Kiállítva</th><th>Határidő</th><th className="num">Összeg</th><th className="num">Nyitott</th><th>Állapot</th></tr></thead>
                <tbody>
                  {visible.map(inv => {
                    const st = INVOICE_STATUS[inv.display] ?? INVOICE_STATUS.issued
                    const name = partnerName(inv.customer)
                    return (
                      <tr key={inv.id}>
                        <td><Link href={`/invoices/${inv.id}`} className="crm-cell-link">{name}</Link></td>
                        <td className="muted">{inv.number || '—'}</td>
                        <td>{INVOICE_KIND[inv.kind] ?? inv.kind}</td>
                        <td className="muted">{formatDate(inv.issue_date)}</td>
                        <td style={{ color: inv.display === 'overdue' ? 'var(--danger)' : undefined }}>{formatDate(inv.due_date)}</td>
                        <td className="num">{formatMoney(inv.total, inv.currency ?? 'HUF')}</td>
                        <td className="num" style={{ fontWeight: inv.open ? 600 : undefined }}>{inv.open ? formatMoney(inv.open, inv.currency ?? 'HUF') : <span className="muted">—</span>}</td>
                        <td><StatusBadge label={st.label} tone={st.tone} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="crm-table-cards crm-list">
              {visible.map(inv => {
                const st = INVOICE_STATUS[inv.display] ?? INVOICE_STATUS.issued
                const name = partnerName(inv.customer)
                const days = inv.due_date ? daysBetween(today, inv.due_date) : null
                return (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="crm-row">
                    <Avatar name={name} size="sm" />
                    <span className="crm-row-main"><strong>{name}</strong><span>{INVOICE_KIND[inv.kind]}{inv.number ? ` · ${inv.number}` : ''}{days !== null && inv.open ? ` · ${days < 0 ? `${-days} napja lejárt` : days === 0 ? 'ma esedékes' : `${days} nap`}` : ''}</span></span>
                    <span className="crm-row-end"><strong>{formatMoney(inv.open || inv.total, inv.currency ?? 'HUF')}</strong><StatusBadge label={st.label} tone={st.tone} /></span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
