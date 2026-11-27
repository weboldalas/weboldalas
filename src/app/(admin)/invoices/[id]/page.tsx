import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FolderKanban, Pencil, Receipt, Repeat, Wallet } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, CardHeader, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatDate, formatMoney, partnerName, todayKey } from '@/lib/crm/format'
import { invoiceDisplayStatus, invoiceOpenAmount, invoicePaidAmount } from '@/lib/crm/finance'
import { INVOICE_KIND, INVOICE_STATUS } from '@/lib/crm/status'
import { InvoiceActions, PaymentRowActions } from './InvoiceActions'

export const metadata = { title: 'Számla' }

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null; billing_email: string | null; email: string | null }

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(id, name, company_name, is_company, billing_email, email), invoice_items(id, description, quantity, unit_price, position), payments(id, amount, status, payment_date, note), subscriptions(id, plan_name), projects(id, name)')
    .eq('id', id)
    .single()
  if (!invoice) notFound()

  const today = todayKey()
  const partner = (Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers) as PartnerRef | null
  const name = partnerName(partner)
  const items = [...(invoice.invoice_items ?? [])].sort((a, b) => a.position - b.position)
  const payments = [...(invoice.payments ?? [])].sort((a, b) => (b.payment_date ?? '').localeCompare(a.payment_date ?? ''))
  const paid = invoicePaidAmount(invoice)
  const open = invoiceOpenAmount(invoice)
  const display = invoiceDisplayStatus(invoice, today)
  const st = INVOICE_STATUS[display] ?? INVOICE_STATUS.issued
  const currency = invoice.currency ?? 'HUF'
  const sub = Array.isArray(invoice.subscriptions) ? invoice.subscriptions[0] : invoice.subscriptions
  const project = Array.isArray(invoice.projects) ? invoice.projects[0] : invoice.projects
  const progress = Number(invoice.total) > 0 ? Math.min(100, (paid / Number(invoice.total)) * 100) : 0

  return (
    <div className="crm-page" style={{ maxWidth: 1040 }}>
      <div className="crm-hero">
        <span className="crm-avatar is-lg" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}><Receipt size={24} /></span>
        <div className="crm-hero-main">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="crm-title">{invoice.number || 'Sorszám nélküli számla'}</h1>
            <StatusBadge label={st.label} tone={st.tone} />
          </div>
          <div className="crm-hero-meta">
            {partner && <Link href={`/partners/${partner.id}`}><Avatar name={name} size="sm" />{name}</Link>}
            <span>{INVOICE_KIND[invoice.kind] ?? invoice.kind}</span>
            <span>Kiállítva {formatDate(invoice.issue_date)}</span>
            {invoice.due_date && <span style={{ color: display === 'overdue' ? 'var(--danger)' : undefined }}>Határidő {formatDate(invoice.due_date)}</span>}
          </div>
        </div>
        <div className="crm-head-actions">
          <Link href={`/invoices/${id}/edit`} className="crm-btn crm-btn-secondary"><Pencil /> Szerkesztés</Link>
        </div>
      </div>

      <div className="crm-grid crm-grid-main">
        <div className="crm-grid">
          <section className="crm-card overflow-hidden">
            <CardHeader title="Tételek" icon={Receipt} />
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr><th>Megnevezés</th><th className="num">Menny.</th><th className="num">Egységár</th><th className="num">Összesen</th></tr></thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td className="num">{Number(item.quantity).toLocaleString('hu-HU')}</td>
                      <td className="num">{formatMoney(item.unit_price, currency)}</td>
                      <td className="num">{formatMoney(Number(item.quantity) * Number(item.unit_price), currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="crm-items-total" style={{ padding: '14px 20px', borderTop: '1px solid var(--line)' }}><span>Végösszeg</span><strong>{formatMoney(invoice.total, currency)}</strong></div>
          </section>

          <section className="crm-card">
            <CardHeader title="Befizetések" icon={Wallet} />
            {payments.length === 0 ? <EmptyState icon={Wallet} title="Még nincs befizetés" text="Ha megérkezett az összeg, rögzítsd a jobb oldalon." /> : (
              <div className="crm-list">
                {payments.map(p => (
                  <div key={p.id} className="crm-row">
                    <span className="crm-avatar is-sm" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}><Wallet size={14} /></span>
                    <span className="crm-row-main"><strong>{formatMoney(p.amount, currency)}</strong><span>{formatDate(p.payment_date)}{p.note ? ` · ${p.note}` : ''}{p.status !== 'completed' && p.status !== 'paid' ? ` · ${p.status}` : ''}</span></span>
                    <PaymentRowActions invoiceId={id} paymentId={p.id} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {invoice.notes && (
            <section className="crm-card crm-card-pad">
              <h2 className="crm-section-title mb-2">Megjegyzés</h2>
              <p className="whitespace-pre-wrap text-[14px]" style={{ color: 'var(--text-2)' }}>{invoice.notes}</p>
            </section>
          )}
        </div>

        <div className="crm-grid">
          <section className="crm-card crm-card-pad">
            <div className="crm-kpi-label">Nyitott összeg</div>
            <div className="crm-kpi-value" style={{ color: display === 'overdue' ? 'var(--danger)' : undefined }}>{formatMoney(open, currency)}</div>
            <div className="crm-progress" style={{ marginTop: 14 }} aria-label={`${Math.round(progress)}% kifizetve`}><i style={{ width: `${progress}%`, background: 'var(--success)' }} /></div>
            <div className="crm-kpi-foot">{formatMoney(paid, currency)} befizetve a {formatMoney(invoice.total, currency)}-ból</div>
            <div className="mt-5">
              <InvoiceActions invoiceId={id} status={invoice.status} open={open} currency={currency} today={today} />
            </div>
          </section>

          {(sub || project) && (
            <section className="crm-card">
              <CardHeader title="Kapcsolódik" />
              <div className="crm-list">
                {sub && <Link href={`/subscriptions/${sub.id}`} className="crm-row"><Repeat size={16} style={{ color: 'var(--text-3)' }} /><span className="crm-row-main"><strong>{sub.plan_name}</strong><span>Havidíj</span></span></Link>}
                {project && <Link href={`/projects/${project.id}`} className="crm-row"><FolderKanban size={16} style={{ color: 'var(--text-3)' }} /><span className="crm-row-main"><strong>{project.name}</strong><span>Projekt</span></span></Link>}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
