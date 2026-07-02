'use client'

import { useState, useTransition } from 'react'
import { ChevronRight, ChevronLeft, UserPlus, User, FileSignature, Loader2, AlertCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildDocumentFromTemplate, quickCreateCustomer, createDocument } from '../actions'
import { findUnresolvedVariables } from '@/lib/document-variables'
import { getTemplateFields, type TemplateField } from '@/lib/template-fields'

type Customer = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  is_company: boolean
  company_name: string | null
  contact_name: string | null
  address: string | null
  tax_number: string | null
  registration_number: string | null
}

type Template = { id: string; name: string; description: string | null; type: string }

const STEP_LABELS = ['Ügyfél', 'Sablon', 'Adatok', 'Áttekintés'] as const

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField
  value: string
  onChange: (v: string) => void
}) {
  const inputStyle = {
    background: 'oklch(1 0 0 / 0.07)',
    border: '1px solid oklch(1 0 0 / 0.15)',
    color: 'white',
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={field.rows ?? 2}
        placeholder={field.placeholder || ''}
        className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm resize-none"
        style={inputStyle}
      />
    )
  }

  if (field.type === 'select' && field.options) {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
        style={inputStyle}
      >
        {field.options.map(opt => (
          <option key={opt} value={opt} style={{ background: '#1a1a2e' }}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <Input
      className="mt-1"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder || ''}
    />
  )
}

export function ContractWizard({
  customers,
  templates,
  preOfferId,
  preCustomerId,
  preOfferAmount,
  preOfferPaymentType,
  preOfferMonths,
}: {
  customers: Customer[]
  templates: Template[]
  preOfferId: string | null
  preCustomerId: string | null
  preOfferAmount: number | null
  preOfferPaymentType: string | null
  preOfferMonths: number | null
}) {
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Step 0: customer
  const [customerMode, setCustomerMode] = useState<'select' | 'new'>('select')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    preCustomerId ? customers.find(c => c.id === preCustomerId) ?? null : null
  )
  const [customerSearch, setCustomerSearch] = useState('')
  const [newCustomer, setNewCustomer] = useState({
    is_company: false,
    name: '',
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    tax_number: '',
    registration_number: '',
  })

  // Step 1: template
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Step 2: dynamic variables
  const [manualVars, setManualVars] = useState<Record<string, string>>(() => {
    const formatPayment = () => {
      if (!preOfferPaymentType || preOfferPaymentType === 'one_time') return 'Egyösszegű fizetés, banki átutalással, 8 napon belül'
      if (preOfferPaymentType === 'installments') return `Részletfizetés ${preOfferMonths ?? ''} részletben`
      return 'Havi előfizetés'
    }
    return {
      offer_price: preOfferAmount ? preOfferAmount.toLocaleString('hu-HU') : '',
      payment_terms: formatPayment(),
    }
  })

  // Step 3: preview
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [unresolvedVars, setUnresolvedVars] = useState<string[]>([])

  const filteredCustomers = customers.filter(c => {
    const search = customerSearch.toLowerCase()
    return (
      (c.name || '').toLowerCase().includes(search) ||
      (c.company_name || '').toLowerCase().includes(search) ||
      (c.email || '').toLowerCase().includes(search)
    )
  })

  async function handleCustomerNext() {
    setError(null)
    if (customerMode === 'new') {
      const needsName = newCustomer.is_company ? !newCustomer.company_name : !newCustomer.name
      if (needsName) {
        setError(newCustomer.is_company ? 'Cégnév megadása kötelező.' : 'Név megadása kötelező.')
        return
      }
      startTransition(async () => {
        const fd = new FormData()
        Object.entries(newCustomer).forEach(([k, v]) => fd.set(k, String(v)))
        const result = await quickCreateCustomer(fd)
        if ('error' in result) { setError(result.error ?? null); return }
        setSelectedCustomer(result.customer as Customer)
        setStep(1)
      })
    } else {
      if (!selectedCustomer) { setError('Válassz ügyfelet vagy hozz létre újat.'); return }
      setStep(1)
    }
  }

  function handleTemplateNext() {
    setError(null)
    if (!selectedTemplate) { setError('Válassz egy sablont.'); return }
    // Pre-fill defaults for the selected template
    const fields = getTemplateFields(selectedTemplate.name)
    setManualVars(prev => {
      const updated = { ...prev }
      for (const f of fields) {
        if (!updated[f.key] && f.defaultValue) updated[f.key] = f.defaultValue
        if (!updated[f.key] && f.options?.[0]) updated[f.key] = f.options[0]
      }
      return updated
    })
    setStep(2)
  }

  function handleVarsNext() {
    setError(null)
    if (!selectedTemplate || !selectedCustomer) return
    const fields = getTemplateFields(selectedTemplate.name)
    const missingRequired = fields.filter(f => f.required && !manualVars[f.key]?.trim())
    if (missingRequired.length > 0) {
      setError(`Kötelező mező hiányzik: ${missingRequired.map(f => f.label).join(', ')}`)
      return
    }
    startTransition(async () => {
      const result = await buildDocumentFromTemplate(
        selectedTemplate.id,
        selectedCustomer.id,
        preOfferId,
        manualVars,
      )
      if ('error' in result) { setError(result.error); return }
      setGeneratedContent(result.content)
      setGeneratedTitle(result.title)
      setUnresolvedVars(findUnresolvedVariables(result.content))
      setStep(3)
    })
  }

  function handleCreate() {
    setError(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('template_id', selectedTemplate?.id || '')
      fd.set('customer_id', selectedCustomer?.id || '')
      fd.set('offer_id', preOfferId || '')
      fd.set('title', generatedTitle)
      fd.set('content', generatedContent)
      fd.set('variables', JSON.stringify(manualVars))
      const result = await createDocument(null, fd)
      if (result && 'error' in result) setError(result.error ?? null)
    })
  }

  const clientDisplayName = selectedCustomer?.is_company
    ? (selectedCustomer.company_name || selectedCustomer.name || '—')
    : (selectedCustomer?.name || '—')

  const templateFields = selectedTemplate ? getTemplateFields(selectedTemplate.name) : []

  return (
    <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0"
              style={
                i === step
                  ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                  : i < step
                  ? { background: 'oklch(0.68 0.18 145 / 0.8)', color: 'white' }
                  : { background: 'oklch(1 0 0 / 0.08)', color: 'oklch(1 0 0 / 0.35)' }
              }
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block"
              style={{ color: i === step ? 'white' : i < step ? 'oklch(0.68 0.18 145)' : 'oklch(1 0 0 / 0.30)' }}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 mx-0.5" style={{ color: 'oklch(1 0 0 / 0.20)' }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.78 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── STEP 0: Customer ── */}
      {step === 0 && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <h2 className="text-lg font-bold text-white">Ügyfél kiválasztása</h2>

          <div className="flex gap-2">
            {(['select', 'new'] as const).map(mode => (
              <button key={mode} type="button" onClick={() => setCustomerMode(mode)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={customerMode === mode
                  ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                  : { background: 'oklch(1 0 0 / 0.06)', color: 'oklch(1 0 0 / 0.5)' }}>
                {mode === 'select' ? <User className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {mode === 'select' ? 'Meglévő ügyfél' : 'Új ügyfél'}
              </button>
            ))}
          </div>

          {customerMode === 'select' && (
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Keresés név, cégnév, email alapján..."
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
              />
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                {filteredCustomers.length === 0 && <p className="text-sm text-white/30 py-3 text-center">Nincs találat</p>}
                {filteredCustomers.map(c => {
                  const display = c.is_company ? (c.company_name || c.name || '—') : (c.name || '—')
                  const sub = c.is_company ? (c.contact_name || c.email || '') : (c.email || '')
                  return (
                    <button key={c.id} type="button" onClick={() => setSelectedCustomer(c)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={selectedCustomer?.id === c.id
                        ? { background: 'oklch(0.68 0.22 290 / 0.15)', border: '1px solid oklch(0.68 0.22 290 / 0.4)', color: 'white' }
                        : { background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)', color: 'oklch(1 0 0 / 0.7)' }}>
                      {c.is_company
                        ? <Building2 className="h-4 w-4 shrink-0 opacity-50" />
                        : <User className="h-4 w-4 shrink-0 opacity-50" />}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{display}</div>
                        {sub && <div className="text-xs opacity-50 truncate">{sub}</div>}
                        {c.is_company && <div className="text-xs" style={{ color: 'oklch(0.68 0.18 145 / 0.7)' }}>Cég</div>}
                      </div>
                      {selectedCustomer?.id === c.id && <span className="ml-auto text-xs font-bold shrink-0" style={{ color: 'oklch(0.68 0.22 290)' }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {customerMode === 'new' && (
            <div className="flex flex-col gap-3">
              {/* Company/Individual toggle */}
              <div className="flex gap-2">
                {[false, true].map(isCompany => (
                  <button key={String(isCompany)} type="button"
                    onClick={() => setNewCustomer(p => ({ ...p, is_company: isCompany }))}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={newCustomer.is_company === isCompany
                      ? { background: 'oklch(0.68 0.22 290 / 0.25)', color: 'white', border: '1px solid oklch(0.68 0.22 290 / 0.5)' }
                      : { background: 'oklch(1 0 0 / 0.05)', color: 'oklch(1 0 0 / 0.4)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                    {isCompany ? '🏢 Céges ügyfél' : '👤 Magánszemély'}
                  </button>
                ))}
              </div>

              {newCustomer.is_company ? (
                <>
                  <div><Label>Cégnév *</Label><Input className="mt-1" value={newCustomer.company_name} onChange={e => setNewCustomer(p => ({ ...p, company_name: e.target.value }))} placeholder="Példa Kft." /></div>
                  <div><Label>Kapcsolattartó neve</Label><Input className="mt-1" value={newCustomer.contact_name} onChange={e => setNewCustomer(p => ({ ...p, contact_name: e.target.value }))} placeholder="Kovács János" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>E-mail</Label><Input className="mt-1" type="email" value={newCustomer.email} onChange={e => setNewCustomer(p => ({ ...p, email: e.target.value }))} /></div>
                    <div><Label>Telefon</Label><Input className="mt-1" value={newCustomer.phone} onChange={e => setNewCustomer(p => ({ ...p, phone: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Adószám</Label><Input className="mt-1" value={newCustomer.tax_number} onChange={e => setNewCustomer(p => ({ ...p, tax_number: e.target.value }))} placeholder="12345678-2-41" /></div>
                    <div><Label>Cégjegyzékszám</Label><Input className="mt-1" value={newCustomer.registration_number} onChange={e => setNewCustomer(p => ({ ...p, registration_number: e.target.value }))} placeholder="01-09-123456" /></div>
                  </div>
                  <div><Label>Székhely</Label><Input className="mt-1" value={newCustomer.address} onChange={e => setNewCustomer(p => ({ ...p, address: e.target.value }))} placeholder="1234 Budapest, Példa utca 1." /></div>
                </>
              ) : (
                <>
                  <div><Label>Név *</Label><Input className="mt-1" value={newCustomer.name} onChange={e => setNewCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Kovács János" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>E-mail</Label><Input className="mt-1" type="email" value={newCustomer.email} onChange={e => setNewCustomer(p => ({ ...p, email: e.target.value }))} /></div>
                    <div><Label>Telefon</Label><Input className="mt-1" value={newCustomer.phone} onChange={e => setNewCustomer(p => ({ ...p, phone: e.target.value }))} /></div>
                  </div>
                  <div><Label>Cím</Label><Input className="mt-1" value={newCustomer.address} onChange={e => setNewCustomer(p => ({ ...p, address: e.target.value }))} placeholder="1234 Budapest, Példa utca 1." /></div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleCustomerNext} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tovább <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Template ── */}
      {step === 1 && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Szerződés típusa</h2>
            <p className="text-sm text-white/40 mt-0.5">Ügyfél: <span className="text-white/70 font-semibold">{clientDisplayName}</span></p>
          </div>
          <div className="flex flex-col gap-2">
            {templates.map(t => (
              <button key={t.id} type="button" onClick={() => setSelectedTemplate(t)}
                className="flex items-start gap-4 rounded-xl p-4 text-left transition-all"
                style={selectedTemplate?.id === t.id
                  ? { background: 'oklch(0.68 0.22 290 / 0.12)', border: '1px solid oklch(0.68 0.22 290 / 0.4)' }
                  : { background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                <FileSignature className="h-5 w-5 mt-0.5 shrink-0"
                  style={{ color: selectedTemplate?.id === t.id ? 'oklch(0.68 0.22 290)' : 'oklch(1 0 0 / 0.30)' }} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  {t.description && <div className="text-xs text-white/40 mt-0.5">{t.description}</div>}
                </div>
                {selectedTemplate?.id === t.id && <span className="ml-auto text-sm font-bold shrink-0" style={{ color: 'oklch(0.68 0.22 290)' }}>✓</span>}
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(0)}><ChevronLeft className="mr-2 h-4 w-4" /> Vissza</Button>
            <Button onClick={handleTemplateNext}>Tovább <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Dynamic fields per template ── */}
      {step === 2 && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Szerződés adatai</h2>
            <p className="text-sm text-white/40 mt-0.5">{selectedTemplate?.name}</p>
          </div>
          <div className="flex flex-col gap-3">
            {templateFields.map(field => (
              <div key={field.key}>
                <Label>
                  {field.label}
                  {field.required && <span className="ml-1 text-red-400/70">*</span>}
                </Label>
                <FieldInput
                  field={field}
                  value={manualVars[field.key] || ''}
                  onChange={v => setManualVars(p => ({ ...p, [field.key]: v }))}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft className="mr-2 h-4 w-4" /> Vissza</Button>
            <Button onClick={handleVarsNext} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generálás <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview & create ── */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          {unresolvedVars.length > 0 && (
            <div className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
              style={{ background: 'oklch(0.65 0.12 55 / 0.12)', color: 'oklch(0.80 0.12 55)', border: '1px solid oklch(0.65 0.12 55 / 0.30)' }}>
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">Kitöltetlen mezők a sablonban:</div>
                <div className="text-xs mt-0.5 opacity-80">
                  {unresolvedVars.map(v => `{{${v}}}`).join(', ')} — a szerkesztőben még javítható
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
            <div>
              <h2 className="text-lg font-bold text-white">Áttekintés</h2>
              <p className="text-sm text-white/40 mt-0.5">Cím: <span className="text-white/70 font-semibold">{generatedTitle}</span></p>
            </div>
            <pre className="text-xs text-white/60 font-mono leading-relaxed max-h-72 overflow-y-auto rounded-xl p-3"
              style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
              {generatedContent.slice(0, 1500)}{generatedContent.length > 1500 ? '\n…' : ''}
            </pre>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)}><ChevronLeft className="mr-2 h-4 w-4" /> Vissza</Button>
              <Button onClick={handleCreate} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Megnyitás szerkesztőben →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
