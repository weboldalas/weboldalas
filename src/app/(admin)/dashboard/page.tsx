import Link from 'next/link'
import { AlertTriangle, CalendarClock, CheckCircle2, CheckSquare, FileText, Phone, Plus, Receipt, Trophy } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { RevenueChart } from './RevenueChart'
import { Avatar, CardHeader, Delta, EmptyState, PageHeader, StatusBadge } from '@/components/crm/ui'
import {
  addMonths, daysBetween, formatDate, formatMoney, formatMoneyShort, monthKey, partnerName, todayKey, TIME_ZONE,
} from '@/lib/crm/format'
import {
  invoiceDisplayStatus, invoiceOpenAmount, isPaid, isRecurringPayment, monthlyRevenue, paidOn, percentChange, type PaymentRow,
} from '@/lib/crm/finance'
import { INVOICE_STATUS, OPEN_PAYMENT_STATUSES } from '@/lib/crm/status'

export const metadata = { title: 'Áttekintés' }

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null }
function one<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = todayKey()
  const thisMonth = monthKey(new Date())
  const since = `${addMonths(thisMonth, -12)}-01`
  const yearStart = `${today.slice(0, 4)}-01-01`

  const [subsRes, paymentsRes, invoicesRes, legacyRes, offersRes, tasksRes, callsRes] = await Promise.all([
    supabase.from('subscriptions').select('id, monthly_fee, currency, customer_id').eq('status', 'active'),
    supabase.from('payments')
      .select('amount, currency, status, payment_date, due_date, payment_type, customer_id, invoice_id, invoices(kind), customers(id, name, company_name, is_company)')
      .in('status', ['completed', 'paid'])
      .or(`payment_date.gte.${since},and(payment_date.is.null,due_date.gte.${since})`),
    supabase.from('invoices')
      .select('id, number, total, currency, status, due_date, kind, customers(id, name, company_name, is_company), payments(amount, status)')
      .eq('status', 'issued')
      .order('due_date', { ascending: true, nullsFirst: false }),
    supabase.from('payments').select('amount, currency, due_date').is('invoice_id', null).in('status', OPEN_PAYMENT_STATUSES),
    supabase.from('offers').select('id, total_amount').eq('status', 'sent'),
    supabase.from('tasks').select('id, title, due_date, priority, customers(name, company_name, is_company)')
      .in('status', ['todo', 'in_progress', 'waiting']).not('due_date', 'is', null).lte('due_date', `${today}T23:59:59`)
      .order('due_date', { ascending: true }).limit(6),
    supabase.from('leads').select('id, name, phone, next_call_date')
      .not('status', 'in', '(elfogadott,elutasitott)').not('next_call_date', 'is', null).lte('next_call_date', `${today}T23:59:59`)
      .order('next_call_date', { ascending: true }).limit(5),
  ])

  const missingSchema = [invoicesRes.error, paymentsRes.error].some(e => e && /invoice|relationship|does not exist/i.test(e.message))
  const loadError = [subsRes, paymentsRes, invoicesRes, legacyRes, offersRes, tasksRes, callsRes].some(r => r.error)

  // Fixed monthly income
  const subs = (subsRes.data ?? []).filter(s => (s.currency ?? 'HUF') === 'HUF')
  const mrr = subs.reduce((sum, s) => sum + Number(s.monthly_fee), 0)

  // Received money
  const payments = (paymentsRes.data ?? []) as unknown as (PaymentRow & { customers: PartnerRef | PartnerRef[] | null })[]
  const series = monthlyRevenue(payments, 12, thisMonth)
  const current = series.at(-1)!
  const previous = series.at(-2)!
  const receivedThisMonth = current.recurring + current.oneOff
  const receivedLastMonth = previous.recurring + previous.oneOff
  const ytdPayments = payments.filter(p => isPaid(p) && (p.currency ?? 'HUF') === 'HUF' && (paidOn(p) ?? '') >= yearStart)
  const ytd = ytdPayments.reduce((sum, p) => sum + Number(p.amount), 0)
  const ytdRecurring = ytdPayments.filter(isRecurringPayment).reduce((sum, p) => sum + Number(p.amount), 0)

  // Receivables
  const invoices = (invoicesRes.data ?? []).map(inv => ({ ...inv, customer: one(inv.customers as PartnerRef | PartnerRef[] | null), open: invoiceOpenAmount(inv), display: invoiceDisplayStatus(inv, today) }))
    .filter(inv => inv.open > 0)
  const legacyOpen = (legacyRes.data ?? []).filter(p => (p.currency ?? 'HUF') === 'HUF').reduce((sum, p) => sum + Number(p.amount), 0)
  const outstanding = invoices.filter(i => (i.currency ?? 'HUF') === 'HUF').reduce((sum, i) => sum + i.open, 0) + legacyOpen
  const overdue = invoices.filter(i => i.display === 'overdue')
  const overdueSum = overdue.reduce((sum, i) => sum + i.open, 0)
  const openOffers = offersRes.data ?? []
  const openOffersSum = openOffers.reduce((sum, o) => sum + Number(o.total_amount), 0)

  // Top partners this year
  const byPartner = new Map<string, { partner: PartnerRef; total: number; recurring: number }>()
  for (const p of ytdPayments) {
    const partner = one(p.customers)
    if (!partner) continue
    const entry = byPartner.get(partner.id) ?? { partner, total: 0, recurring: 0 }
    entry.total += Number(p.amount)
    if (isRecurringPayment(p)) entry.recurring += Number(p.amount)
    byPartner.set(partner.id, entry)
  }
  const topPartners = [...byPartner.values()].sort((a, b) => b.total - a.total).slice(0, 5)
  const topMax = topPartners[0]?.total ?? 0

  const tasks = tasksRes.data ?? []
  const calls = callsRes.data ?? []
  const dateLabel = new Date().toLocaleDateString('hu-HU', { timeZone: TIME_ZONE, weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="crm-page">
      <PageHeader
        eyebrow={dateLabel}
        title="Áttekintés"
        subtitle="A vállalkozásod pénzügyei és a mai teendők egy helyen."
        actions={<>
          <Link href="/invoices/new" className="crm-btn crm-btn-secondary"><Receipt /> Új számla</Link>
          <Link href="/partners/new" className="crm-btn crm-btn-primary"><Plus /> Új partner</Link>
        </>}
      />

      {missingSchema ? (
        <div className="crm-alert" role="alert"><AlertTriangle /><span>Az adatbázis még a régi szerkezetű. Futtasd le a <code>20261127000000_crm_phase1.sql</code> migrációt, és frissítsd az oldalt.</span></div>
      ) : loadError ? (
        <div className="crm-alert" role="alert"><AlertTriangle /><span>Néhány adatot nem sikerült betölteni. Frissítsd az oldalt az újrapróbáláshoz.</span></div>
      ) : null}

      <div className="crm-grid crm-grid-kpi">
        <Link href="/subscriptions" className="crm-kpi is-featured">
          <div className="crm-kpi-label"><i style={{ background: 'var(--chart-recurring)' }} />Fix havi bevétel</div>
          <div className="crm-kpi-value">{formatMoneyShort(mrr)}</div>
          <div className="crm-kpi-foot">{subs.length} aktív havidíj · évente {formatMoneyShort(mrr * 12)}</div>
        </Link>
        <div className="crm-kpi">
          <div className="crm-kpi-label">Befolyt ebben a hónapban</div>
          <div className="crm-kpi-value">{formatMoneyShort(receivedThisMonth)}</div>
          <div className="crm-kpi-foot">
            <Delta value={percentChange(receivedThisMonth, receivedLastMonth)} />
            <span>fix {formatMoneyShort(current.recurring)} · eseti {formatMoneyShort(current.oneOff)}</span>
          </div>
        </div>
        <Link href="/invoices?status=open" className="crm-kpi">
          <div className="crm-kpi-label">Kintlévőség</div>
          <div className="crm-kpi-value">{formatMoneyShort(outstanding)}</div>
          <div className="crm-kpi-foot">
            {overdue.length > 0
              ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{overdue.length} lejárt · {formatMoneyShort(overdueSum)}</span>
              : <span>Nincs lejárt számla</span>}
          </div>
        </Link>
        <div className="crm-kpi">
          <div className="crm-kpi-label"><i style={{ background: 'var(--chart-oneoff)' }} />Idén befolyt</div>
          <div className="crm-kpi-value">{formatMoneyShort(ytd)}</div>
          <div className="crm-kpi-foot">ebből fix {ytd ? Math.round((ytdRecurring / ytd) * 100) : 0}% · {openOffers.length} nyitott ajánlat ({formatMoneyShort(openOffersSum)})</div>
        </div>
      </div>

      <div className="crm-grid crm-grid-main">
        <RevenueChart data={series} />

        <section className="crm-card" aria-labelledby="today-title">
          <CardHeader title="Mai teendők" icon={CalendarClock} description="Határidős feladatok és visszahívások" link={{ href: '/tasks', label: 'Feladatok' }} />
          {tasks.length === 0 && calls.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Mára minden kész" text="Nincs lejárt vagy mai határidős teendő." />
          ) : (
            <div className="crm-list">
              {calls.map(lead => {
                const late = lead.next_call_date!.slice(0, 10) < today
                return (
                  <div key={`c-${lead.id}`} className="crm-row">
                    <span className="crm-avatar is-sm" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}><Phone size={14} /></span>
                    <Link href={`/leads/${lead.id}`} className="crm-row-main">
                      <strong>{lead.name}</strong>
                      <span>{late ? `Elmaradt visszahívás · ${formatDate(lead.next_call_date)}` : 'Visszahívás ma'}</span>
                    </Link>
                    {lead.phone && <a href={`tel:${lead.phone}`} className="crm-btn crm-btn-secondary crm-btn-sm">Hívás</a>}
                  </div>
                )
              })}
              {tasks.map(task => {
                const late = task.due_date!.slice(0, 10) < today
                const partner = one(task.customers as PartnerRef | PartnerRef[] | null)
                return (
                  <Link key={`t-${task.id}`} href={`/tasks/${task.id}`} className="crm-row">
                    <span className="crm-avatar is-sm" style={{ background: late ? 'var(--danger-soft)' : 'var(--brand-soft)', color: late ? 'var(--danger)' : 'var(--brand)' }}><CheckSquare size={14} /></span>
                    <span className="crm-row-main">
                      <strong>{task.title}</strong>
                      <span>{partner ? `${partnerName(partner)} · ` : ''}{late ? `Lejárt: ${formatDate(task.due_date)}` : 'Ma esedékes'}</span>
                    </span>
                    {task.priority === 'urgent' && <StatusBadge label="Sürgős" tone="danger" />}
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <div className="crm-grid crm-grid-2">
        <section className="crm-card" aria-labelledby="receivables-title">
          <CardHeader title="Esedékes számlák" icon={Receipt} description="Lejárt és hamarosan esedékes kintlévőségek" link={{ href: '/invoices?status=open', label: 'Összes' }} />
          {invoices.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Nincs nyitott számla" text="Minden kiállított számla ki van fizetve." action={{ href: '/invoices/new', label: 'Új számla' }} />
          ) : (
            <div className="crm-list">
              {invoices.slice(0, 6).map(inv => {
                const name = partnerName(inv.customer)
                const days = inv.due_date ? daysBetween(today, inv.due_date) : null
                const status = INVOICE_STATUS[inv.display] ?? INVOICE_STATUS.issued
                return (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="crm-row">
                    <Avatar name={name} size="sm" />
                    <span className="crm-row-main">
                      <strong>{name}</strong>
                      <span>{inv.number ? `${inv.number} · ` : ''}{inv.kind === 'recurring' ? 'Havidíj' : 'Eseti'}</span>
                    </span>
                    <span className="crm-row-end">
                      <strong>{formatMoney(inv.open, inv.currency ?? 'HUF')}</strong>
                      {days === null ? <span>Nincs határidő</span>
                        : days < 0 ? <StatusBadge label={`${-days} napja lejárt`} tone="danger" />
                        : <span>{days === 0 ? 'Ma esedékes' : `${days} nap múlva`}</span>}
                    </span>
                    <span className="sr-only">{status.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <section className="crm-card" aria-labelledby="top-title">
          <CardHeader title="Top partnerek idén" icon={Trophy} description="Befolyt bevétel szerint" link={{ href: '/partners', label: 'Partnerek' }} />
          {topPartners.length === 0 ? (
            <EmptyState icon={FileText} title="Még nincs idei befizetés" text="A rögzített befizetések alapján itt rangsoroljuk a partnereidet." />
          ) : (
            <div className="crm-list">
              {topPartners.map(entry => {
                const name = partnerName(entry.partner)
                return (
                  <Link key={entry.partner.id} href={`/partners/${entry.partner.id}`} className="crm-row">
                    <Avatar name={name} size="sm" />
                    <span className="crm-row-main">
                      <strong>{name}</strong>
                      <span className="crm-progress" style={{ marginTop: 8 }}><i style={{ width: `${topMax ? (entry.total / topMax) * 100 : 0}%` }} /></span>
                    </span>
                    <span className="crm-row-end">
                      <strong>{formatMoneyShort(entry.total)}</strong>
                      <span>fix {entry.total ? Math.round((entry.recurring / entry.total) * 100) : 0}%</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
