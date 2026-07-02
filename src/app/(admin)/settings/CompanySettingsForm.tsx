'use client'

import { useState, useTransition, useRef } from 'react'
import { Loader2, Building2, Save, CheckCircle, Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type CompanySettings = {
  id: string
  company_name: string | null
  logo_url: string | null
  address: string | null
  tax_number: string | null
  registration_number: string | null
  bank_account: string | null
  representative_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  business_type?: string | null
  brand_name?: string | null
  tax_form?: string | null
}

const TAX_FORMS = [
  { value: 'aam',  label: 'Alanyi adómentes (AAM)' },
  { value: 'kata', label: 'KATA' },
  { value: 'vat',  label: 'Általános forgalmi adós (ÁFA körös)' },
]

const BUSINESS_TYPES = [
  'Egyéni vállalkozó',
  'Betéti társaság (Bt.)',
  'Korlátolt felelősségű társaság (Kft.)',
  'Részvénytársaság (Zrt./Nyrt.)',
  'Közkereseti társaság (Kkt.)',
  'Egyéni cég (Ec.)',
]

async function saveCompanySettings(id: string, data: Partial<CompanySettings>) {
  const res = await fetch('/api/company-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  return res.json()
}

export function CompanySettingsForm({ settings }: { settings: CompanySettings }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    company_name:         settings.company_name || '',
    brand_name:           settings.brand_name || '',
    business_type:        settings.business_type || 'Egyéni vállalkozó',
    tax_form:             settings.tax_form || 'aam',
    logo_url:             settings.logo_url || '',
    address:              settings.address || '',
    tax_number:           settings.tax_number || '',
    registration_number:  settings.registration_number || '',
    bank_account:         settings.bank_account || '',
    representative_name:  settings.representative_name || '',
    email:                settings.email || '',
    phone:                settings.phone || '',
    website:              settings.website || '',
  })

  function set<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleLogoUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('id', settings.id)
      const res = await fetch('/api/company-settings/logo', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.error) { setError(json.error); return }
      set('logo_url', json.url)
    } catch {
      setError('Logó feltöltés sikertelen.')
    } finally {
      setUploading(false)
    }
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveCompanySettings(settings.id, form)
      if (result.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string
    field: keyof typeof form
    type?: string
    placeholder?: string
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        type={type}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="rounded-xl p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <CardTitle className="text-base text-white">Saját vállalkozás adatai</CardTitle>
          <CardDescription className="text-white/40">
            Ezek az adatok automatikusan kerülnek be minden szerződésbe
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.75 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
            {error}
          </div>
        )}

        {/* Identity */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Azonosítás</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teljes név / Cégnév *" field="company_name" placeholder="Balda László Tamás" />
            <Field label="Képviselő neve" field="representative_name" placeholder="Balda László Tamás" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Field label="Márkanév (PDF fejlécben)" field="brand_name" placeholder="Weboldalas" />
            <div className="space-y-1.5">
              <Label>Vállalkozási forma</Label>
              <select
                value={form.business_type}
                onChange={e => set('business_type', e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  background: 'oklch(1 0 0 / 0.07)',
                  border: '1px solid oklch(1 0 0 / 0.15)',
                  color: 'white',
                }}
              >
                {BUSINESS_TYPES.map(bt => (
                  <option key={bt} value={bt} style={{ background: '#1a1a2e' }}>{bt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tax */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Adózás</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Adózási forma</Label>
              <select
                value={form.tax_form}
                onChange={e => set('tax_form', e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  background: 'oklch(1 0 0 / 0.07)',
                  border: '1px solid oklch(1 0 0 / 0.15)',
                  color: 'white',
                }}
              >
                {TAX_FORMS.map(tf => (
                  <option key={tf.value} value={tf.value} style={{ background: '#1a1a2e' }}>{tf.label}</option>
                ))}
              </select>
            </div>
            <Field label="Adószám" field="tax_number" placeholder="59664105-1-24" />
          </div>
          {form.tax_form === 'aam' && (
            <div className="mt-3 rounded-xl px-4 py-3 text-xs"
              style={{ background: 'oklch(0.68 0.18 145 / 0.10)', border: '1px solid oklch(0.68 0.18 145 / 0.25)', color: 'oklch(0.75 0.18 145)' }}>
              ✓ A szerződésekben nem jelenik meg „+ ÁFA". Automatikusan bekerül a következő szöveg:<br />
              <span className="opacity-70 italic mt-1 block">„A Megbízott alanyi adómentes egyéni vállalkozó, ezért a szolgáltatási díj ÁFA-t nem tartalmaz."</span>
            </div>
          )}
          <div className="mt-4">
            <Field label="Cégjegyzékszám (ha van)" field="registration_number" placeholder="—" />
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Elérhetőség</p>
          <Field label="Székhely" field="address" placeholder="5700 Gyula, Wesselényi utca 26/B." />
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Field label="E-mail" field="email" type="email" placeholder="info@weboldalas.hu" />
            <Field label="Telefon" field="phone" placeholder="+36 30 123 4567" />
          </div>
          <div className="mt-4">
            <Field label="Weboldal" field="website" placeholder="https://weboldalas.hu" />
          </div>
        </div>

        {/* Bank */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Pénzügy</p>
          <Field label="Bankszámlaszám" field="bank_account" placeholder="11600006-00000000-98016132" />
        </div>

        {/* Logo upload */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Logó</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleLogoUpload(file)
            }}
          />
          {form.logo_url ? (
            <div className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Logó" className="h-12 object-contain" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/60 truncate text-xs">{form.logo_url.split('/').pop()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: 'oklch(1 0 0 / 0.08)', color: 'oklch(1 0 0 / 0.6)', border: '1px solid oklch(1 0 0 / 0.12)' }}>
                  {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Csere
                </button>
                <button
                  type="button"
                  onClick={() => set('logo_url', '')}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-400/60 hover:text-red-400 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl py-8 transition-all"
              style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px dashed oklch(1 0 0 / 0.18)', color: 'oklch(1 0 0 / 0.35)' }}>
              {uploading
                ? <Loader2 className="h-6 w-6 animate-spin" />
                : <ImageIcon className="h-6 w-6" />}
              <span className="text-sm font-medium">
                {uploading ? 'Feltöltés...' : 'Kattints a logó feltöltéséhez'}
              </span>
              <span className="text-xs opacity-60">PNG, JPG, SVG – max. 2 MB</span>
            </button>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={isPending || uploading}>
            {isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mentés...</>
              : saved
              ? <><CheckCircle className="mr-2 h-4 w-4 text-emerald-400" /> Mentve!</>
              : <><Save className="mr-2 h-4 w-4" /> Mentés</>
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
