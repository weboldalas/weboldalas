'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createProject, updateProject, type ProjectFormState } from './actions'

type Project = { id: string; customer_id: string; name: string; description: string | null; status: string; start_date: string | null; due_date: string | null; budget: number | string | null; currency: string | null }

export function ProjectForm({ partners, project, defaultCustomerId }: { partners: { id: string; label: string }[]; project?: Project; defaultCustomerId?: string }) {
  const action = project ? updateProject.bind(null, project.id) : createProject
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(action, null)
  const errors = state?.fieldErrors ?? {}
  const err = (key: string) => errors[key] ? <span className="crm-hint" style={{ color: 'var(--danger)' }}>{errors[key]}</span> : null

  return (
    <form action={formAction} className="crm-card crm-form" style={{ gap: 0 }} noValidate>
      <div className="crm-form-section">
        <div><h3>Projekt</h3><p>A 2. fázisban a projekten belül feladatokat is adhattok egymásnak a partnerrel.</p></div>
        <div className="crm-fields">
          <div className="crm-field is-wide">
            <label htmlFor="customer_id">Partner</label>
            <select id="customer_id" name="customer_id" defaultValue={project?.customer_id ?? defaultCustomerId ?? ''} required aria-invalid={!!errors.customer_id}>
              <option value="" disabled>Válassz partnert…</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            {err('customer_id')}
          </div>
          <div className="crm-field is-wide">
            <label htmlFor="name">Projekt neve</label>
            <input id="name" name="name" className="crm-input" defaultValue={project?.name ?? ''} placeholder="Pl. Új webshop fejlesztése" required autoFocus={!project} aria-invalid={!!errors.name} />
            {err('name')}
          </div>
          <div className="crm-field is-wide">
            <label htmlFor="description">Leírás</label>
            <textarea id="description" name="description" defaultValue={project?.description ?? ''} placeholder="Cél, scope, fontos tudnivalók…" />
          </div>
          <div className="crm-field">
            <label htmlFor="status">Státusz</label>
            <select id="status" name="status" defaultValue={project?.status ?? 'active'}>
              <option value="planned">Tervezett</option>
              <option value="active">Folyamatban</option>
              <option value="on_hold">Szünetel</option>
              <option value="completed">Kész</option>
              <option value="cancelled">Leállítva</option>
            </select>
          </div>
          <div className="crm-field">
            <label htmlFor="budget">Keretösszeg <small>(nettó)</small></label>
            <div className="flex gap-2">
              <input id="budget" name="budget" className="crm-input" inputMode="decimal" defaultValue={project?.budget ?? ''} placeholder="0" aria-invalid={!!errors.budget} />
              <select name="currency" defaultValue={project?.currency ?? 'HUF'} aria-label="Pénznem" style={{ width: 90, height: 40, borderRadius: 10, border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '0 10px' }}><option>HUF</option><option>EUR</option></select>
            </div>
            {err('budget')}
          </div>
          <div className="crm-field"><label htmlFor="start_date">Kezdés</label><input id="start_date" name="start_date" type="date" className="crm-input" defaultValue={project?.start_date ?? ''} /></div>
          <div className="crm-field"><label htmlFor="due_date">Határidő</label><input id="due_date" name="due_date" type="date" className="crm-input" defaultValue={project?.due_date ?? ''} /></div>
        </div>
      </div>
      {state?.error && <div className="crm-alert is-danger crm-form-error" role="alert"><AlertTriangle />{state.error}</div>}
      <div className="crm-form-actions" style={{ marginTop: state?.error ? 16 : 0 }}>
        <Link href={project ? `/projects/${project.id}` : '/projects'} className="crm-btn crm-btn-ghost">Mégse</Link>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={pending}>{pending && <Loader2 className="animate-spin" />}{project ? 'Mentés' : 'Projekt létrehozása'}</button>
      </div>
    </form>
  )
}
