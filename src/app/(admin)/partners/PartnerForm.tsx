'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createPartner, updatePartner, type FormState } from './actions'

type Partner = {
  id: string
  is_company: boolean | null
  name: string
  company_name: string | null
  tax_number: string | null
  registration_number: string | null
  address: string | null
  billing_address: string | null
  website: string | null
  email: string | null
  billing_email: string | null
  phone: string | null
  status: string | null
  tags: string[] | null
  notes: string | null
}

function Field({ label, name, error, hint, wide, ...props }: { label: React.ReactNode; name: string; error?: string; hint?: string; wide?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`crm-field ${wide ? 'is-wide' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className="crm-input" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} {...props} />
      {error ? <span id={`${name}-error`} className="crm-hint" style={{ color: 'var(--danger)' }}>{error}</span> : hint ? <span className="crm-hint">{hint}</span> : null}
    </div>
  )
}

export function PartnerForm({ partner }: { partner?: Partner }) {
  const action = partner ? updatePartner.bind(null, partner.id) : createPartner
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null)
  const [isCompany, setIsCompany] = useState(partner?.is_company ?? true)
  const errors = state?.fieldErrors ?? {}

  return (
    <form action={formAction} className="crm-card crm-form" style={{ gap: 0 }} noValidate>
      <input type="hidden" name="is_company" value={String(isCompany)} />

      <div className="crm-form-section">
        <div><h3>Partner</h3><p>Cég vagy magánszemély. A név jelenik meg az ajánlatokon és a szerződésekben.</p></div>
        <div className="crm-fields">
          <div className="crm-field is-wide">
            <div className="crm-segmented" role="group" aria-label="Partner típusa" style={{ alignSelf: 'flex-start' }}>
              <button type="button" className={isCompany ? 'is-active' : ''} aria-pressed={isCompany} onClick={() => setIsCompany(true)}>Cég</button>
              <button type="button" className={!isCompany ? 'is-active' : ''} aria-pressed={!isCompany} onClick={() => setIsCompany(false)}>Magánszemély</button>
            </div>
          </div>
          {isCompany ? (
            <>
              <Field label="Cégnév" name="company_name" defaultValue={partner?.company_name ?? ''} error={errors.company_name} required autoFocus={!partner} placeholder="Pl. Helkem Kft." wide />
              <input type="hidden" name="name" value={partner?.name ?? ''} />
              <Field label="Adószám" name="tax_number" defaultValue={partner?.tax_number ?? ''} placeholder="12345678-1-12" />
              <Field label="Cégjegyzékszám" name="registration_number" defaultValue={partner?.registration_number ?? ''} placeholder="01-09-123456" />
            </>
          ) : (
            <>
              <Field label="Név" name="name" defaultValue={partner?.name ?? ''} error={errors.name} required autoFocus={!partner} placeholder="Pl. Kiss Anna" wide />
              <input type="hidden" name="company_name" value="" />
              <input type="hidden" name="tax_number" value={partner?.tax_number ?? ''} />
              <input type="hidden" name="registration_number" value="" />
            </>
          )}
          <div className="crm-field">
            <label htmlFor="status">Státusz</label>
            <select id="status" name="status" defaultValue={partner?.status ?? 'active'}>
              <option value="active">Aktív</option>
              <option value="paused">Szünetel</option>
              <option value="former">Korábbi</option>
            </select>
          </div>
          <Field label={<>Címkék <small>(vesszővel)</small></>} name="tags" defaultValue={(partner?.tags ?? []).join(', ')} placeholder="webshop, karbantartás" />
        </div>
      </div>

      <div className="crm-form-section">
        <div><h3>Elérhetőség és számlázás</h3><p>Az általános e-mail címre mennek az ajánlatok, a számlázásira a számlaértesítők.</p></div>
        <div className="crm-fields">
          <Field label="E-mail" name="email" type="email" inputMode="email" defaultValue={partner?.email ?? ''} error={errors.email} placeholder="info@ceg.hu" />
          <Field label="Telefon" name="phone" type="tel" inputMode="tel" defaultValue={partner?.phone ?? ''} placeholder="+36 30 123 4567" />
          <Field label="Számlázási e-mail" name="billing_email" type="email" inputMode="email" defaultValue={partner?.billing_email ?? ''} error={errors.billing_email} hint="Ha üres, az általános e-mailt használjuk." />
          <Field label="Weboldal" name="website" defaultValue={partner?.website ?? ''} placeholder="https://" />
          <Field label="Cím" name="address" defaultValue={partner?.address ?? ''} placeholder="Irányítószám, város, utca" wide />
          <Field label="Számlázási cím" name="billing_address" defaultValue={partner?.billing_address ?? ''} hint="Ha eltér a címtől." wide />
        </div>
      </div>

      {!partner && (
        <div className="crm-form-section">
          <div><h3>Elsődleges kapcsolattartó</h3><p>Később bármennyi kapcsolattartót hozzáadhatsz az adatlapon.</p></div>
          <div className="crm-fields">
            <Field label="Név" name="contact_name" error={errors.contact_name} placeholder="Kapcsolattartó neve" />
            <Field label="Beosztás" name="contact_position" placeholder="Pl. ügyvezető" />
            <Field label="E-mail" name="contact_email" type="email" inputMode="email" error={errors.contact_email} />
            <Field label="Telefon" name="contact_phone" type="tel" inputMode="tel" />
          </div>
        </div>
      )}

      <div className="crm-form-section">
        <div><h3>Belső megjegyzés</h3><p>Csak te látod, a partner soha.</p></div>
        <div className="crm-fields">
          <div className="crm-field is-wide">
            <label htmlFor="notes" className="sr-only">Megjegyzés</label>
            <textarea id="notes" name="notes" defaultValue={partner?.notes ?? ''} placeholder="Hozzáférések, preferenciák, fontos tudnivalók…" />
          </div>
        </div>
      </div>

      {state?.error && <div className="crm-alert is-danger crm-form-error" role="alert"><AlertTriangle />{state.error}</div>}

      <div className="crm-form-actions" style={{ marginTop: state?.error ? 16 : 0 }}>
        <Link href={partner ? `/partners/${partner.id}` : '/partners'} className="crm-btn crm-btn-ghost">Mégse</Link>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />} {partner ? 'Mentés' : 'Partner létrehozása'}
        </button>
      </div>
    </form>
  )
}
