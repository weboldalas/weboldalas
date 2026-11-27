'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Building2, Search } from 'lucide-react'
import { Avatar, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatMoney } from '@/lib/crm/format'
import { PARTNER_STATUS } from '@/lib/crm/status'

export type PartnerListItem = {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  tags: string[]
  contact: string | null
  contactCount: number
  mrr: number
  open: number
  overdue: boolean
}

type Filter = 'all' | 'active' | 'retainer' | 'overdue' | 'former'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Összes' },
  { id: 'active', label: 'Aktív' },
  { id: 'retainer', label: 'Havidíjas' },
  { id: 'overdue', label: 'Lejárt számla' },
  { id: 'former', label: 'Korábbi' },
]

function normalize(value: string) {
  return value.toLocaleLowerCase('hu').normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function matches(p: PartnerListItem, filter: Filter) {
  if (filter === 'active') return p.status === 'active'
  if (filter === 'retainer') return p.mrr > 0
  if (filter === 'overdue') return p.overdue
  if (filter === 'former') return p.status === 'former'
  return true
}

export function PartnersTable({ partners }: { partners: PartnerListItem[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    return partners.filter(p => matches(p, filter) && (!q || normalize(`${p.name} ${p.contact ?? ''} ${p.email ?? ''} ${p.tags.join(' ')}`).includes(q)))
  }, [partners, query, filter])

  if (partners.length === 0) {
    return (
      <div className="crm-card">
        <EmptyState icon={Building2} title="Még nincs partnered" text="Vedd fel az első partnert, és kösd hozzá a kapcsolattartókat, havidíjakat és számlákat." action={{ href: '/partners/new', label: 'Új partner' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="crm-toolbar">
        <label className="crm-search">
          <Search aria-hidden="true" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Keresés név, kapcsolattartó, címke…" aria-label="Partner keresése" />
        </label>
        <div className="crm-chips" role="group" aria-label="Szűrés">
          {FILTERS.map(f => {
            const count = partners.filter(p => matches(p, f.id)).length
            return (
              <button key={f.id} type="button" className={`crm-chip ${filter === f.id ? 'is-active' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}<span className="crm-chip-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="crm-card overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState icon={Search} title="Nincs találat" text="Próbálj másik kifejezést vagy szűrőt." />
        ) : (
          <>
            <div className="crm-table-wrap has-cards">
              <table className="crm-table">
                <thead>
                  <tr><th>Partner</th><th>Kapcsolattartó</th><th className="num">Havidíj</th><th className="num">Kintlévőség</th><th>Státusz</th></tr>
                </thead>
                <tbody>
                  {visible.map(p => {
                    const status = PARTNER_STATUS[p.status] ?? PARTNER_STATUS.active
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={p.name} size="sm" />
                            <div className="min-w-0">
                              <Link href={`/partners/${p.id}`} className="crm-cell-link block truncate">{p.name}</Link>
                              {p.tags.length > 0 && <div className="mt-1 flex flex-wrap gap-1">{p.tags.slice(0, 3).map(t => <span key={t} className="crm-badge no-dot" style={{ height: 19, fontSize: 11 }}>{t}</span>)}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{p.contact ? <>{p.contact}{p.contactCount > 1 && <span className="muted"> +{p.contactCount - 1}</span>}</> : <span className="muted">—</span>}</td>
                        <td className="num">{p.mrr ? formatMoney(p.mrr) : <span className="muted">—</span>}</td>
                        <td className="num">{p.open ? <span style={{ color: p.overdue ? 'var(--danger)' : undefined, fontWeight: p.overdue ? 600 : undefined }}>{formatMoney(p.open)}</span> : <span className="muted">—</span>}</td>
                        <td><StatusBadge label={status.label} tone={status.tone} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="crm-table-cards crm-list">
              {visible.map(p => (
                <Link key={p.id} href={`/partners/${p.id}`} className="crm-row">
                  <Avatar name={p.name} />
                  <span className="crm-row-main">
                    <strong>{p.name}</strong>
                    <span>{p.contact ?? p.email ?? 'Nincs kapcsolattartó'}</span>
                  </span>
                  <span className="crm-row-end">
                    {p.mrr > 0 && <strong>{formatMoney(p.mrr)}<span className="crm-muted" style={{ fontSize: 11, fontWeight: 500 }}>/hó</span></strong>}
                    {p.open > 0 ? <span className={p.overdue ? 'is-danger' : ''}>{formatMoney(p.open)} nyitott</span> : p.status !== 'active' ? <span>{PARTNER_STATUS[p.status]?.label}</span> : null}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
