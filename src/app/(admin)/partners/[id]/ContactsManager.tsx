'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { AlertTriangle, Loader2, Mail, Pencil, Phone, Plus, Star, Trash2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Avatar, EmptyState } from '@/components/crm/ui'
import { deleteContact, saveContact, type FormState } from '../actions'

export type Contact = {
  id: string
  name: string
  email: string | null
  phone: string | null
  position: string | null
  notes: string | null
  is_primary: boolean
  portal_access: boolean
}

function ContactForm({ customerId, contact, onDone }: { customerId: string; contact: Contact | null; onDone: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveContact.bind(null, customerId, contact?.id ?? null), null)
  useEffect(() => {
    if (state?.ok) { toast.success(contact ? 'Kapcsolattartó frissítve' : 'Kapcsolattartó hozzáadva'); onDone() }
  }, [state, contact, onDone])
  const errors = state?.fieldErrors ?? {}

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <div className="crm-fields">
        <div className="crm-field is-wide">
          <label htmlFor="c-name">Név</label>
          <input id="c-name" name="name" className="crm-input" defaultValue={contact?.name ?? ''} required autoFocus aria-invalid={!!errors.name} />
          {errors.name && <span className="crm-hint" style={{ color: 'var(--danger)' }}>{errors.name}</span>}
        </div>
        <div className="crm-field">
          <label htmlFor="c-email">E-mail</label>
          <input id="c-email" name="email" type="email" inputMode="email" className="crm-input" defaultValue={contact?.email ?? ''} aria-invalid={!!errors.email} />
          {errors.email && <span className="crm-hint" style={{ color: 'var(--danger)' }}>{errors.email}</span>}
        </div>
        <div className="crm-field">
          <label htmlFor="c-phone">Telefon</label>
          <input id="c-phone" name="phone" type="tel" inputMode="tel" className="crm-input" defaultValue={contact?.phone ?? ''} />
        </div>
        <div className="crm-field is-wide">
          <label htmlFor="c-position">Beosztás <small>(pl. marketing, ügyvezető)</small></label>
          <input id="c-position" name="position" className="crm-input" defaultValue={contact?.position ?? ''} />
        </div>
        <div className="crm-field is-wide">
          <label htmlFor="c-notes">Megjegyzés</label>
          <textarea id="c-notes" name="notes" defaultValue={contact?.notes ?? ''} style={{ minHeight: 72 }} />
        </div>
        <label className="crm-check is-wide" style={{ gridColumn: '1 / -1' }}>
          <input type="checkbox" name="is_primary" defaultChecked={contact?.is_primary ?? false} />
          Elsődleges kapcsolattartó (az ajánlatok és szerződések rá szólnak)
        </label>
      </div>
      {state?.error && <div className="crm-alert is-danger" role="alert"><AlertTriangle />{state.error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="crm-btn crm-btn-ghost" onClick={onDone}>Mégse</button>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={pending}>{pending && <Loader2 className="animate-spin" />}Mentés</button>
      </div>
    </form>
  )
}

export function ContactsManager({ customerId, contacts }: { customerId: string; contacts: Contact[] }) {
  const [editing, setEditing] = useState<Contact | null | 'new'>(null)
  const [pending, startTransition] = useTransition()
  const close = () => setEditing(null)

  function remove(contact: Contact) {
    if (!window.confirm(`Biztosan törlöd: ${contact.name}?`)) return
    startTransition(async () => {
      const result = await deleteContact(customerId, contact.id)
      if (result?.error) toast.error(result.error)
      else toast.success('Kapcsolattartó törölve')
    })
  }

  return (
    <section className="crm-card">
      <div className="crm-card-head">
        <div><h2><UserRound />Kapcsolattartók</h2><p>A 2. fázisban ők léphetnek be a partner portálra, és adhatnak feladatot.</p></div>
        <button type="button" className="crm-btn crm-btn-secondary crm-btn-sm" onClick={() => setEditing('new')}><Plus /> Új</button>
      </div>
      {contacts.length === 0 ? (
        <EmptyState icon={UserRound} title="Még nincs kapcsolattartó" text="Adj hozzá egy vagy több kapcsolattartót a partnerhez." />
      ) : (
        <div className="crm-list" aria-busy={pending}>
          {contacts.map(contact => (
            <div key={contact.id} className="crm-row" style={{ alignItems: 'flex-start' }}>
              <Avatar name={contact.name} />
              <div className="crm-row-main">
                <strong className="flex items-center gap-2">
                  {contact.name}
                  {contact.is_primary && <span className="crm-badge is-brand no-dot" style={{ height: 20, fontSize: 11 }}><Star size={11} /> Elsődleges</span>}
                </strong>
                {contact.position && <span>{contact.position}</span>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" style={{ color: 'var(--text-2)' }}>
                  {contact.email && <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:text-[var(--brand-text)]"><Mail size={13} />{contact.email}</a>}
                  {contact.phone && <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 hover:text-[var(--brand-text)]"><Phone size={13} />{contact.phone}</a>}
                </div>
                {contact.notes && <p className="mt-2 text-[13px]" style={{ color: 'var(--text-3)' }}>{contact.notes}</p>}
              </div>
              <div className="flex gap-1">
                <button type="button" className="crm-btn crm-btn-ghost crm-btn-sm crm-btn-icon" aria-label={`${contact.name} szerkesztése`} onClick={() => setEditing(contact)}><Pencil /></button>
                <button type="button" className="crm-btn crm-btn-ghost crm-btn-sm crm-btn-icon" aria-label={`${contact.name} törlése`} onClick={() => remove(contact)}><Trash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={open => { if (!open) close() }}>
        <DialogContent className="crm-command sm:max-w-lg" style={{ padding: 20, gap: 16 }}>
          <div>
            <DialogTitle className="text-base font-semibold">{editing === 'new' ? 'Új kapcsolattartó' : 'Kapcsolattartó szerkesztése'}</DialogTitle>
            <DialogDescription className="text-[13px]" style={{ color: 'var(--text-3)' }}>Egy partnerhez bármennyi kapcsolattartó tartozhat.</DialogDescription>
          </div>
          {editing !== null && <ContactForm customerId={customerId} contact={editing === 'new' ? null : editing} onDone={close} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}
