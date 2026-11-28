'use client'

import { useActionState, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2, Plus, Trash2 } from 'lucide-react'
import { createInvoice, updateInvoice, type InvoiceFormState } from './actions'
import { formatMoney } from '@/lib/crm/format'

type Option = { id: string; label: string }
type SubOption = { id: string; customer_id: string; plan_name: string; monthly_fee: number | string; currency: string | null }
type ProjectOption = { id: string; customer_id: string; name: string }
type Item = { key: number; description: string; quantity: string; unit_price: string }

export type InvoiceInitial = {
  id: string
  customer_id: string
  kind: string
  status: string
  number: string | null
  issue_date: string
  due_date: string | null
  currency: string | null
  subscription_id: string | null
  project_id: string | null
  notes: string | null
  items: { description: string; quantity: number | string; unit_price: number | string }[]
}

let nextKey = 1
const newItem = (partial: Partial<Item> = {}): Item => ({ key: nextKey++, description: '', quantity: '1', unit_price: '', ...partial })

export function InvoiceForm({ partners, subscriptions, projects, initial, defaults }: {
  partners: Option[]
  subscriptions: SubOption[]
  projects: ProjectOption[]
  initial?: InvoiceInitial
  defaults: { customerId?: string; issueDate: string; dueDate: string; subscriptionId?: string; projectId?: string }
}) {
  const action = initial ? updateInvoice.bind(null, initial.id) : createInvoice
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(action, null)
  const presetSub = subscriptions.find(s => s.id === (initial?.subscription_id ?? defaults.subscriptionId))
  const [customerId, setCustomerId] = useState(initial?.customer_id ?? presetSub?.customer_id ?? defaults.customerId ?? '')
  const [kind, setKind] = useState(initial?.kind ?? (presetSub ? 'recurring' : 'one_off'))
  const [subscriptionId, setSubscriptionId] = useState(initial?.subscription_id ?? presetSub?.id ?? '')
  const [currency, setCurrency] = useState(initial?.currency ?? presetSub?.currency ?? 'HUF')
  const [items, setItems] = useState<Item[]>(() =>
    initial?.items.length
      ? initial.items.map(i => newItem({ description: i.description, quantity: String(i.quantity), unit_price: String(i.unit_price) }))
      : presetSub ? [newItem({ description: presetSub.plan_name, unit_price: String(presetSub.monthly_fee) })] : [newItem()],
  )

  const partnerSubs = useMemo(() => subscriptions.filter(s => s.customer_id === customerId), [subscriptions, customerId])
  const partnerProjects = useMemo(() => projects.filter(p => p.customer_id === customerId), [projects, customerId])
  const total = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0)
  const errors = state?.fieldErrors ?? {}

  function update(key: number, patch: Partial<Item>) {
    setItems(list => list.map(i => (i.key === key ? { ...i, ...patch } : i)))
  }

  function pickSubscription(id: string) {
    setSubscriptionId(id)
    const sub = subscriptions.find(s => s.id === id)
    if (sub && items.length === 1 && !items[0].description && !items[0].unit_price) {
      setItems([newItem({ description: sub.plan_name, unit_price: String(sub.monthly_fee) })])
      setCurrency(sub.currency ?? 'HUF')
    }
  }

  return (
    <form action={formAction} className="crm-card crm-form" style={{ gap: 0 }} noValidate>
      <input type="hidden" name="items" value={JSON.stringify(items.map(({ description, quantity, unit_price }) => ({ description, quantity, unit_price })))} />
      <input type="hidden" name="kind" value={kind} />

      <div className="crm-form-section">
        <div><h3>Partner és típus</h3><p>A havidíjas számlák a fix, a többi az eseti bevételbe számít.</p></div>
        <div className="crm-fields">
          <div className="crm-field is-wide">
            <label htmlFor="customer_id">Partner</label>
            <select id="customer_id" name="customer_id" value={customerId} onChange={e => { setCustomerId(e.target.value); setSubscriptionId('') }} aria-invalid={!!errors.customer_id} required>
              <option value="" disabled>Válassz partnert…</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            {errors.customer_id && <span className="crm-hint" style={{ color: 'var(--danger)' }}>{errors.customer_id}</span>}
          </div>
          <div className="crm-field is-wide">
            <span className="text-[13px] font-[550]">Típus</span>
            <div className="crm-segmented" role="group" aria-label="Számla típusa" style={{ alignSelf: 'flex-start' }}>
              <button type="button" className={kind === 'one_off' ? 'is-active' : ''} aria-pressed={kind === 'one_off'} onClick={() => setKind('one_off')}>Eseti</button>
              <button type="button" className={kind === 'recurring' ? 'is-active' : ''} aria-pressed={kind === 'recurring'} onClick={() => setKind('recurring')}>Havidíj</button>
            </div>
          </div>
          {kind === 'recurring' ? (
            <div className="crm-field is-wide">
              <label htmlFor="subscription_id">Havidíj csomag</label>
              <select id="subscription_id" name="subscription_id" value={subscriptionId} onChange={e => pickSubscription(e.target.value)}>
                <option value="">{partnerSubs.length ? 'Válassz csomagot…' : 'Ennek a partnernek nincs havidíja'}</option>
                {partnerSubs.map(s => <option key={s.id} value={s.id}>{s.plan_name} · {formatMoney(s.monthly_fee, s.currency ?? 'HUF')}/hó</option>)}
              </select>
            </div>
          ) : <input type="hidden" name="subscription_id" value="" />}
          <div className="crm-field is-wide">
            <label htmlFor="project_id">Projekt <small>(nem kötelező)</small></label>
            <select id="project_id" name="project_id" defaultValue={initial?.project_id ?? defaults.projectId ?? ''}>
              <option value="">Nincs projekthez kötve</option>
              {partnerProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="crm-form-section">
        <div><h3>Tételek</h3><p>Nettó összegek. A hivatalos számlát továbbra is a számlázóprogramod állítja ki.</p></div>
        <div className="crm-items">
          <div className="crm-item-row crm-items-head" aria-hidden="true"><span>Megnevezés</span><span>Menny.</span><span>Egységár</span><span /></div>
          {items.map((item, index) => (
            <div key={item.key} className="crm-item-row">
              <input className="crm-input" value={item.description} onChange={e => update(item.key, { description: e.target.value })} placeholder="Pl. Weboldal karbantartás" aria-label={`${index + 1}. tétel megnevezése`} />
              <input className="crm-input" value={item.quantity} onChange={e => update(item.key, { quantity: e.target.value })} inputMode="decimal" aria-label={`${index + 1}. tétel mennyisége`} />
              <input className="crm-input" value={item.unit_price} onChange={e => update(item.key, { unit_price: e.target.value.replace(/\s/g, '') })} inputMode="decimal" placeholder="0" aria-label={`${index + 1}. tétel egységára`} />
              <button type="button" className="crm-btn crm-btn-ghost crm-btn-icon" onClick={() => setItems(list => list.length > 1 ? list.filter(i => i.key !== item.key) : [newItem()])} aria-label={`${index + 1}. tétel törlése`}><Trash2 /></button>
            </div>
          ))}
          <div><button type="button" className="crm-btn crm-btn-ghost crm-btn-sm" onClick={() => setItems(list => [...list, newItem()])}><Plus /> Tétel hozzáadása</button></div>
          <div className="crm-items-total"><span>Összesen</span><strong>{formatMoney(total, currency)}</strong></div>
        </div>
      </div>

      <div className="crm-form-section">
        <div><h3>Számla adatai</h3><p>A sorszámot a számlázóprogramból másold be, így később könnyen visszakereshető.</p></div>
        <div className="crm-fields">
          <div className="crm-field"><label htmlFor="number">Sorszám <small>(nem kötelező)</small></label><input id="number" name="number" className="crm-input" defaultValue={initial?.number ?? ''} placeholder="Pl. WEB-2026-0042" /></div>
          <div className="crm-field">
            <label htmlFor="currency">Pénznem</label>
            <select id="currency" name="currency" value={currency} onChange={e => setCurrency(e.target.value)}><option value="HUF">HUF</option><option value="EUR">EUR</option></select>
          </div>
          <div className="crm-field"><label htmlFor="issue_date">Kiállítás</label><input id="issue_date" name="issue_date" type="date" className="crm-input" defaultValue={initial?.issue_date ?? defaults.issueDate} required /></div>
          <div className="crm-field"><label htmlFor="due_date">Fizetési határidő</label><input id="due_date" name="due_date" type="date" className="crm-input" defaultValue={initial?.due_date ?? defaults.dueDate} /></div>
          <div className="crm-field is-wide">
            <label htmlFor="status">Állapot</label>
            <select id="status" name="status" defaultValue={initial?.status === 'draft' ? 'draft' : 'issued'}>
              <option value="issued">Kiállítva (beszámít a kintlévőségbe)</option>
              <option value="draft">Piszkozat</option>
            </select>
          </div>
          <div className="crm-field is-wide"><label htmlFor="notes">Megjegyzés</label><textarea id="notes" name="notes" defaultValue={initial?.notes ?? ''} style={{ minHeight: 72 }} /></div>
        </div>
      </div>

      {state?.error && <div className="crm-alert is-danger crm-form-error" role="alert"><AlertTriangle />{state.error}</div>}
      <div className="crm-form-actions" style={{ marginTop: state?.error ? 16 : 0 }}>
        <Link href={initial ? `/invoices/${initial.id}` : '/invoices'} className="crm-btn crm-btn-ghost">Mégse</Link>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={pending}>{pending && <Loader2 className="animate-spin" />}{initial ? 'Mentés' : 'Számla rögzítése'}</button>
      </div>
    </form>
  )
}
