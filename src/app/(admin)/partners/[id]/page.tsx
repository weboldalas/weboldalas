import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Building2, FileSignature, FileText, FolderKanban, Globe, Mail, MapPin, Pencil, Phone, Plus, Receipt, Repeat, StickyNote,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, CardHeader, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatDate, formatMoney, partnerName, todayKey } from '@/lib/crm/format'
import { invoiceDisplayStatus, invoiceOpenAmount, isPaid, isRecurringPayment, paidOn, type PaymentRow } from '@/lib/crm/finance'
import {
  DOCUMENT_STATUS, INVOICE_KIND, INVOICE_STATUS, OFFER_STATUS, PARTNER_STATUS, PROJECT_STATUS, SUBSCRIPTION_STATUS,
} from '@/lib/crm/status'
import { ContactsManager, type Contact } from './ContactsManager'
import { DeletePartnerButton } from './DeletePartnerButton'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('customers').select('name, company_name, is_company').eq('id', id).single()
  return { title: data ? partnerName(data) : 'Partner' }
}

const TABS = [
  { id: 'overview', label: 'Áttekintés' },
  { id: 'contacts', label: 'Kapcsolattartók' },
  { id: 'fees', label: 'Havidíjak' },
  { id: 'invoices', label: 'Számlák' },
  { id: 'offers', label: 'Ajánlatok' },
  { id: 'projects', label: 'Projektek' },
  { id: 'documents', label: 'Szerződések' },
] as const
type TabId = typeof TABS[number]['id']

export default async function PartnerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params
  const { tab: rawTab } = await searchParams
  const tab: TabId = TABS.some(t => t.id === rawTab) ? rawTab as TabId : 'overview'
  const supabase = await createClient()
  const today = todayKey()

  const [partnerRes, contactsRes, subsRes, offersRes, invoicesRes, projectsRes, docsRes, paymentsRes] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase.from('partner_contacts').select('id, name, email, phone, position, notes, is_primary, portal_access').eq('customer_id', id).order('is_primary', { ascending: false }).order('created_at'),
    supabase.from('subscriptions').select('id, plan_name, monthly_fee, currency, status, start_date, next_billing_date, billing_day').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('offers').select('id, status, total_amount, payment_type, created_at, expires_at, sent_at').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('id, number, kind, status, issue_date, due_date, total, currency, payments(amount, status)').eq('customer_id', id).order('issue_date', { ascending: false }),
    supabase.from('projects').select('id, name, status, start_date, due_date, budget, currency').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('documents').select('id, title, status, created_at').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('payments').select('amount, currency, status, payment_date, due_date, payment_type, customer_id, invoice_id, invoices(kind)').eq('customer_id', id),
  ])

  const partner = partnerRes.data
  if (!partner) notFound()

  const name = partnerName(partner)
  const contacts = (contactsRes.data ?? []) as Contact[]
  const subs = subsRes.data ?? []
  const offers = offersRes.data ?? []
  const invoices = (invoicesRes.data ?? []).map(inv => ({ ...inv, open: invoiceOpenAmount(inv), display: invoiceDisplayStatus(inv, today) }))
  const projects = projectsRes.data ?? []
  const docs = docsRes.data ?? []
  const payments = (paymentsRes.data ?? []) as unknown as PaymentRow[]

  const mrr = subs.filter(s => s.status === 'active' && (s.currency ?? 'HUF') === 'HUF').reduce((sum, s) => sum + Number(s.monthly_fee), 0)
  const yearStart = `${today.slice(0, 4)}-01-01`
  const paid = payments.filter(p => isPaid(p) && (p.currency ?? 'HUF') === 'HUF')
  const ytd = paid.filter(p => (paidOn(p) ?? '') >= yearStart).reduce((sum, p) => sum + Number(p.amount), 0)
  const lifetime = paid.reduce((sum, p) => sum + Number(p.amount), 0)
  const lifetimeRecurring = paid.filter(isRecurringPayment).reduce((sum, p) => sum + Number(p.amount), 0)
  const open = invoices.reduce((sum, inv) => sum + inv.open, 0)
  const overdueCount = invoices.filter(inv => inv.display === 'overdue' && inv.open > 0).length
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planned').length
  const status = PARTNER_STATUS[partner.status ?? 'active'] ?? PARTNER_STATUS.active
  const primary = contacts.find(c => c.is_primary) ?? contacts[0]

  const counts: Partial<Record<TabId, number>> = {
    contacts: contacts.length, fees: subs.length, invoices: invoices.length, offers: offers.length, projects: projects.length, documents: docs.length,
  }

  return (
    <div className="crm-page">
      <div className="crm-hero">
        <Avatar name={name} size="lg" />
        <div className="crm-hero-main">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="crm-title">{name}</h1>
            <StatusBadge label={status.label} tone={status.tone} />
          </div>
          <div className="crm-hero-meta">
            {primary && <span><Building2 />{primary.name}{primary.position ? `, ${primary.position}` : ''}</span>}
            {partner.email && <a href={`mailto:${partner.email}`}><Mail />{partner.email}</a>}
            {partner.phone && <a href={`tel:${partner.phone}`}><Phone />{partner.phone}</a>}
            {partner.website && <a href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`} target="_blank" rel="noreferrer"><Globe />{partner.website.replace(/^https?:\/\//, '')}</a>}
          </div>
        </div>
        <div className="crm-head-actions">
          <Link href={`/partners/${id}/edit`} className="crm-btn crm-btn-secondary"><Pencil /> Szerkesztés</Link>
          <Link href={`/invoices/new?customer_id=${id}`} className="crm-btn crm-btn-primary"><Plus /> Számla</Link>
        </div>
      </div>

      <div className="crm-grid crm-grid-kpi">
        <div className="crm-kpi is-featured"><div className="crm-kpi-label">Havidíj</div><div className="crm-kpi-value">{formatMoney(mrr)}<small>/hó</small></div><div className="crm-kpi-foot">{subs.filter(s => s.status === 'active').length} aktív csomag</div></div>
        <div className="crm-kpi"><div className="crm-kpi-label">Idén befolyt</div><div className="crm-kpi-value">{formatMoney(ytd)}</div><div className="crm-kpi-foot">Összesen {formatMoney(lifetime)}, fix {lifetime ? Math.round((lifetimeRecurring / lifetime) * 100) : 0}%</div></div>
        <div className="crm-kpi"><div className="crm-kpi-label">Kintlévőség</div><div className="crm-kpi-value" style={{ color: overdueCount ? 'var(--danger)' : undefined }}>{formatMoney(open)}</div><div className="crm-kpi-foot">{overdueCount ? `${overdueCount} lejárt számla` : 'Nincs lejárt számla'}</div></div>
        <div className="crm-kpi"><div className="crm-kpi-label">Projektek</div><div className="crm-kpi-value">{activeProjects}</div><div className="crm-kpi-foot">aktív, {projects.length} összesen</div></div>
      </div>

      <nav className="crm-tabs" aria-label="Partner adatai">
        {TABS.map(t => (
          <Link key={t.id} href={t.id === 'overview' ? `/partners/${id}` : `/partners/${id}?tab=${t.id}`} scroll={false} className={`crm-tab ${tab === t.id ? 'is-active' : ''}`} aria-current={tab === t.id ? 'page' : undefined}>
            {t.label}{counts[t.id] ? <small>{counts[t.id]}</small> : null}
          </Link>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="crm-grid crm-grid-main">
          <div className="crm-grid">
            <section className="crm-card">
              <CardHeader title="Nyitott számlák" icon={Receipt} link={{ href: `/partners/${id}?tab=invoices`, label: 'Összes' }} />
              <InvoiceList invoices={invoices.filter(i => i.open > 0)} partnerId={id} empty="Nincs nyitott számla." />
            </section>
            <section className="crm-card">
              <CardHeader title="Projektek" icon={FolderKanban} link={{ href: `/partners/${id}?tab=projects`, label: 'Összes' }} />
              <ProjectList projects={projects.slice(0, 4)} partnerId={id} />
            </section>
          </div>
          <div className="crm-grid">
            <section className="crm-card">
              <CardHeader title="Adatok" icon={Building2} />
              <dl className="crm-dl crm-card-pad">
                {partner.is_company !== false && <><dt>Adószám</dt><dd>{partner.tax_number || '—'}</dd></>}
                {partner.registration_number && <><dt>Cégjegyzékszám</dt><dd>{partner.registration_number}</dd></>}
                <dt><MapPin size={13} className="inline" /> Cím</dt><dd>{partner.address || '—'}</dd>
                {partner.billing_address && <><dt>Számlázási cím</dt><dd>{partner.billing_address}</dd></>}
                <dt>Számlázási e-mail</dt><dd>{partner.billing_email || partner.email || '—'}</dd>
                <dt>Partner óta</dt><dd>{formatDate(partner.created_at)}</dd>
                {(partner.tags ?? []).length > 0 && <><dt>Címkék</dt><dd className="flex flex-wrap gap-1">{(partner.tags as string[]).map(t => <span key={t} className="crm-badge no-dot">{t}</span>)}</dd></>}
              </dl>
            </section>
            {partner.notes && (
              <section className="crm-card">
                <CardHeader title="Belső megjegyzés" icon={StickyNote} />
                <p className="crm-card-pad whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{partner.notes}</p>
              </section>
            )}
            <ContactsManager customerId={id} contacts={contacts.slice(0, 3)} />
          </div>
        </div>
      )}

      {tab === 'contacts' && <ContactsManager customerId={id} contacts={contacts} />}

      {tab === 'fees' && (
        <section className="crm-card">
          <CardHeader title="Havidíjak" icon={Repeat} description="Ezekből számoljuk a fix havi bevételt." />
          {subs.length === 0 ? <EmptyState icon={Repeat} title="Nincs havidíj" text="Karbantartás, üzemeltetés, marketing csomag: rögzítsd, és megjelenik a fix bevételben." action={{ href: `/subscriptions/new?customer_id=${id}`, label: 'Új havidíj' }} /> : (
            <div className="crm-list">
              {subs.map(s => {
                const st = SUBSCRIPTION_STATUS[s.status] ?? SUBSCRIPTION_STATUS.active
                return (
                  <Link key={s.id} href={`/subscriptions/${s.id}`} className="crm-row">
                    <span className="crm-row-main"><strong>{s.plan_name}</strong><span>{s.start_date ? `Indult: ${formatDate(s.start_date)}` : 'Kezdés nincs megadva'}{s.next_billing_date ? ` · Következő számlázás: ${formatDate(s.next_billing_date)}` : ''}</span></span>
                    <span className="crm-row-end"><strong>{formatMoney(s.monthly_fee, s.currency ?? 'HUF')}<span className="crm-muted" style={{ fontSize: 12 }}>/hó</span></strong><StatusBadge label={st.label} tone={st.tone} /></span>
                  </Link>
                )
              })}
              <div className="crm-row"><Link href={`/subscriptions/new?customer_id=${id}`} className="crm-card-link"><Plus size={14} /> Új havidíj</Link></div>
            </div>
          )}
        </section>
      )}

      {tab === 'invoices' && (
        <section className="crm-card">
          <CardHeader title="Számlák" icon={Receipt} description="A befizetések számlánként, a kintlévőséggel együtt." />
          <InvoiceList invoices={invoices} partnerId={id} empty="Még nincs számla ennél a partnernél." />
        </section>
      )}

      {tab === 'offers' && (
        <section className="crm-card">
          <CardHeader title="Ajánlatok" icon={FileText} />
          {offers.length === 0 ? <EmptyState icon={FileText} title="Nincs ajánlat" action={{ href: `/offers/new?customer_id=${id}`, label: 'Új ajánlat' }} /> : (
            <div className="crm-list">
              {offers.map(o => {
                const st = OFFER_STATUS[o.status] ?? OFFER_STATUS.draft
                return (
                  <Link key={o.id} href={`/offers/${o.id}`} className="crm-row">
                    <span className="crm-row-main"><strong>Ajánlat · {formatDate(o.created_at)}</strong><span>{o.payment_type === 'subscription' ? 'Havidíjas' : o.payment_type === 'installments' ? 'Részletfizetés' : 'Egyösszegű'}{o.expires_at ? ` · Érvényes: ${formatDate(o.expires_at)}` : ''}</span></span>
                    <span className="crm-row-end"><strong>{formatMoney(o.total_amount)}</strong><StatusBadge label={st.label} tone={st.tone} /></span>
                  </Link>
                )
              })}
              <div className="crm-row"><Link href={`/offers/new?customer_id=${id}`} className="crm-card-link"><Plus size={14} /> Új ajánlat</Link></div>
            </div>
          )}
        </section>
      )}

      {tab === 'projects' && (
        <section className="crm-card">
          <CardHeader title="Projektek" icon={FolderKanban} />
          <ProjectList projects={projects} partnerId={id} />
        </section>
      )}

      {tab === 'documents' && (
        <section className="crm-card">
          <CardHeader title="Szerződések és dokumentumok" icon={FileSignature} />
          {docs.length === 0 ? <EmptyState icon={FileSignature} title="Nincs szerződés" action={{ href: `/contracts/new?customer_id=${id}`, label: 'Új szerződés' }} /> : (
            <div className="crm-list">
              {docs.map(d => {
                const st = DOCUMENT_STATUS[d.status] ?? DOCUMENT_STATUS.draft
                return (
                  <Link key={d.id} href={`/contracts/${d.id}`} className="crm-row">
                    <span className="crm-row-main"><strong>{d.title}</strong><span>{formatDate(d.created_at)}</span></span>
                    <StatusBadge label={st.label} tone={st.tone} />
                  </Link>
                )
              })}
              <div className="crm-row"><Link href={`/contracts/new?customer_id=${id}`} className="crm-card-link"><Plus size={14} /> Új szerződés</Link></div>
            </div>
          )}
        </section>
      )}

      {tab === 'overview' && (
        <div className="flex justify-end">
          <DeletePartnerButton id={id} name={name} />
        </div>
      )}
    </div>
  )
}

type InvoiceItem = { id: string; number: string | null; kind: string; issue_date: string; due_date: string | null; total: number | string; currency: string | null; open: number; display: string }
function InvoiceList({ invoices, partnerId, empty }: { invoices: InvoiceItem[]; partnerId: string; empty: string }) {
  if (invoices.length === 0) return <EmptyState icon={Receipt} title={empty} action={{ href: `/invoices/new?customer_id=${partnerId}`, label: 'Új számla' }} />
  return (
    <div className="crm-list">
      {invoices.map(inv => {
        const st = INVOICE_STATUS[inv.display] ?? INVOICE_STATUS.issued
        return (
          <Link key={inv.id} href={`/invoices/${inv.id}`} className="crm-row">
            <span className="crm-row-main"><strong>{inv.number || 'Sorszám nélkül'} · {INVOICE_KIND[inv.kind] ?? inv.kind}</strong><span>Kiállítva {formatDate(inv.issue_date)}{inv.due_date ? ` · Határidő ${formatDate(inv.due_date)}` : ''}</span></span>
            <span className="crm-row-end"><strong>{formatMoney(inv.open > 0 ? inv.open : inv.total, inv.currency ?? 'HUF')}</strong><StatusBadge label={st.label} tone={st.tone} /></span>
          </Link>
        )
      })}
    </div>
  )
}

type ProjectItem = { id: string; name: string; status: string; start_date: string | null; due_date: string | null; budget: number | string | null; currency: string | null }
function ProjectList({ projects, partnerId }: { projects: ProjectItem[]; partnerId: string }) {
  if (projects.length === 0) return <EmptyState icon={FolderKanban} title="Nincs projekt" text="A 2. fázisban a projekteken belül feladatokat is adhatsz." action={{ href: `/projects/new?customer_id=${partnerId}`, label: 'Új projekt' }} />
  return (
    <div className="crm-list">
      {projects.map(p => {
        const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.active
        return (
          <Link key={p.id} href={`/projects/${p.id}`} className="crm-row">
            <span className="crm-row-main"><strong>{p.name}</strong><span>{p.due_date ? `Határidő: ${formatDate(p.due_date)}` : 'Nincs határidő'}{p.budget ? ` · Keret: ${formatMoney(p.budget, p.currency ?? 'HUF')}` : ''}</span></span>
            <StatusBadge label={st.label} tone={st.tone} />
          </Link>
        )
      })}
    </div>
  )
}
