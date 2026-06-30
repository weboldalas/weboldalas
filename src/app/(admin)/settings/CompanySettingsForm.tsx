'use client'

import { useState, useTransition } from 'react'
import { Loader2, Building2, Save, CheckCircle } from 'lucide-react'
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
}

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

  const [form, setForm] = useState({
    company_name:         settings.company_name || '',
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

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
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
          <CardTitle className="text-base text-white">Cégadatok</CardTitle>
          <CardDescription className="text-white/40">
            Ezek az adatok automatikusan kerülnek be minden szerződésbe
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.75 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cégnév *" field="company_name" placeholder="Weboldalas.hu Kft." />
          <Field label="Képviselő neve" field="representative_name" placeholder="Balda László" />
        </div>

        <Field label="Székhely" field="address" placeholder="1234 Budapest, Példa utca 1." />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adószám" field="tax_number" placeholder="12345678-2-41" />
          <Field label="Cégjegyzékszám" field="registration_number" placeholder="01-09-123456" />
        </div>

        <Field label="Bankszámlaszám" field="bank_account" placeholder="12345678-12345678-12345678" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" field="email" type="email" placeholder="info@weboldalas.hu" />
          <Field label="Telefon" field="phone" placeholder="+36 30 123 4567" />
        </div>

        <Field label="Weboldal" field="website" placeholder="weboldalas.hu" />

        <div className="pt-1">
          <Label htmlFor="logo_url">Logó URL</Label>
          <Input
            id="logo_url"
            value={form.logo_url}
            onChange={e => set('logo_url', e.target.value)}
            placeholder="https://example.com/logo.png"
            className="mt-1.5"
          />
          {form.logo_url && (
            <div className="mt-2 rounded-lg p-3 flex items-center gap-3"
              style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Logo előnézet" className="h-8 object-contain" />
              <span className="text-xs text-white/40">Logó előnézet</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={isPending}>
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
