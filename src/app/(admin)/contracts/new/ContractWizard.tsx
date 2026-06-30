'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, UserPlus, User, FileSignature, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CONTRACT_TEMPLATES } from '@/lib/contract-templates'
import { generateContractContent, quickCreateCustomer, createContract } from '../actions'

type Customer = { id: string; name: string; email: string | null; phone: string | null }
type Offer = { id: string; total_amount: number; label: string }

const STEPS = ['Ügyfél', 'Sablon', 'Szerkesztés'] as const

export function ContractWizard({ customers, offers }: { customers: Customer[]; offers: Offer[] }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()

  // Step 1 – Customer
  const [customerMode, setCustomerMode] = useState<'select' | 'new'>('select')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')

  // Step 1 – Offer (optional)
  const [selectedOfferId, setSelectedOfferId] = useState<string>('')

  // Step 2 – Template
  const [templateId, setTemplateId] = useState<string>('')

  // Step 3 – Content
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState<string | null>(null)

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  )

  async function handleStep1Next() {
    setError(null)
    if (customerMode === 'select' && !selectedCustomer) {
      setError('Válassz ügyfelet vagy hozz létre újat.')
      return
    }
    if (customerMode === 'new') {
      if (!newCustomerName.trim()) {
        setError('Az ügyfél neve kötelező.')
        return
      }
      startTransition(async () => {
        const fd = new FormData()
        fd.set('name', newCustomerName)
        fd.set('email', newCustomerEmail)
        fd.set('phone', newCustomerPhone)
        const result = await quickCreateCustomer(fd)
        if ('error' in result) {
          setError(result.error ?? null)
        } else {
          setSelectedCustomer(result.customer)
          setStep(1)
        }
      })
      return
    }
    setStep(1)
  }

  async function handleStep2Next() {
    setError(null)
    if (!templateId) {
      setError('Válassz egy sablont.')
      return
    }
    const offer = offers.find(o => o.id === selectedOfferId)
    const data = {
      customerName: selectedCustomer?.name || '',
      customerEmail: selectedCustomer?.email || '',
      customerPhone: selectedCustomer?.phone || '',
      customerAddress: '',
      offerTitle: offer ? `${offer.label} ajánlat` : '',
      offerAmount: offer ? offer.total_amount.toLocaleString('hu-HU') : '',
      offerItems: '',
      date: new Date().toISOString(),
      companyName: 'Weboldalas.hu Kft.',
    }
    startTransition(async () => {
      const result = await generateContractContent(templateId, data)
      if ('error' in result) {
        setError(result.error)
      } else {
        const template = CONTRACT_TEMPLATES.find(t => t.id === templateId)
        setTitle(
          template
            ? `${template.label} – ${selectedCustomer?.name || 'Névtelen'}`
            : `Szerződés – ${selectedCustomer?.name || 'Névtelen'}`
        )
        setContent(result.content)
        setStep(2)
      }
    })
  }

  function handleSave() {
    setError(null)
    if (!title.trim() || !content.trim()) {
      setError('Cím és tartalom megadása kötelező.')
      return
    }
    startTransition(async () => {
      const fd = new FormData()
      fd.set('template_id', templateId)
      fd.set('customer_id', selectedCustomer?.id || '')
      fd.set('offer_id', selectedOfferId)
      fd.set('title', title)
      fd.set('content', content)
      fd.set('notes', notes)
      const result = await createContract(null, fd)
      if (result && 'error' in result) {
        setError(result.error)
      }
      // On success, server action redirects automatically
    })
  }

  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
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
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: i === step ? 'white' : i < step ? 'oklch(0.68 0.18 145)' : 'oklch(1 0 0 / 0.35)' }}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'oklch(1 0 0 / 0.25)' }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.75 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
          {error}
        </div>
      )}

      {/* STEP 0 — Customer & Offer */}
      {step === 0 && (
        <div className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <h2 className="text-lg font-bold text-white">Ügyfél kiválasztása</h2>

          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCustomerMode('select')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={customerMode === 'select'
                ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                : { background: 'oklch(1 0 0 / 0.06)', color: 'oklch(1 0 0 / 0.5)' }}
            >
              <User className="h-4 w-4" /> Meglévő ügyfél
            </button>
            <button
              type="button"
              onClick={() => setCustomerMode('new')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={customerMode === 'new'
                ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                : { background: 'oklch(1 0 0 / 0.06)', color: 'oklch(1 0 0 / 0.5)' }}
            >
              <UserPlus className="h-4 w-4" /> Új ügyfél
            </button>
          </div>

          {customerMode === 'select' && (
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Ügyfél keresése..."
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
              />
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {filteredCustomers.length === 0 && (
                  <p className="text-sm text-white/30 py-2">Nincs találat.</p>
                )}
                {filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCustomer(c)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                    style={selectedCustomer?.id === c.id
                      ? { background: 'oklch(0.68 0.22 290 / 0.15)', border: '1px solid oklch(0.68 0.22 290 / 0.4)', color: 'white' }
                      : { background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)', color: 'oklch(1 0 0 / 0.7)' }}
                  >
                    <User className="h-4 w-4 shrink-0 opacity-50" />
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      {c.email && <div className="text-xs opacity-50">{c.email}</div>}
                    </div>
                    {selectedCustomer?.id === c.id && (
                      <span className="ml-auto text-xs font-bold" style={{ color: 'oklch(0.68 0.22 290)' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {customerMode === 'new' && (
            <div className="flex flex-col gap-3">
              <div>
                <Label htmlFor="new-name">Név *</Label>
                <Input
                  id="new-name"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  placeholder="Kovács János"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-email">E-mail</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newCustomerEmail}
                  onChange={e => setNewCustomerEmail(e.target.value)}
                  placeholder="kovacs@example.hu"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Telefon</Label>
                <Input
                  id="new-phone"
                  value={newCustomerPhone}
                  onChange={e => setNewCustomerPhone(e.target.value)}
                  placeholder="+36 30 123 4567"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Optional offer */}
          {offers.length > 0 && (
            <div>
              <Label htmlFor="offer-select">Kapcsolódó ajánlat (opcionális)</Label>
              <select
                id="offer-select"
                value={selectedOfferId}
                onChange={e => setSelectedOfferId(e.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  background: 'oklch(1 0 0 / 0.07)',
                  border: '1px solid oklch(1 0 0 / 0.15)',
                  color: 'white',
                }}
              >
                <option value="">— Nincs kapcsolódó ajánlat —</option>
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.label} · {o.total_amount.toLocaleString('hu-HU')} Ft
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleStep1Next} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tovább <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1 — Template selection */}
      {step === 1 && (
        <div className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <h2 className="text-lg font-bold text-white">Sablon kiválasztása</h2>
          {selectedCustomer && (
            <div className="text-sm text-white/50">
              Ügyfél: <span className="text-white/80 font-semibold">{selectedCustomer.name}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {CONTRACT_TEMPLATES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className="flex items-start gap-4 rounded-xl p-4 text-left transition-all"
                style={templateId === t.id
                  ? { background: 'oklch(0.68 0.22 290 / 0.15)', border: '1px solid oklch(0.68 0.22 290 / 0.4)' }
                  : { background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)' }}
              >
                <FileSignature
                  className="h-5 w-5 mt-0.5 shrink-0"
                  style={{ color: templateId === t.id ? 'oklch(0.68 0.22 290)' : 'oklch(1 0 0 / 0.35)' }}
                />
                <div>
                  <div className="font-semibold text-white text-sm">{t.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{t.description}</div>
                </div>
                {templateId === t.id && (
                  <span className="ml-auto text-sm font-bold" style={{ color: 'oklch(0.68 0.22 290)' }}>✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(0)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Vissza
            </Button>
            <Button onClick={handleStep2Next} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Kitöltés és szerkesztés <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2 — Edit content */}
      {step === 2 && (
        <div className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <h2 className="text-lg font-bold text-white">Szerződés szerkesztése</h2>

          <div>
            <Label htmlFor="contract-title">Szerződés neve *</Label>
            <Input
              id="contract-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contract-content">Szerződés szövege *</Label>
            <textarea
              id="contract-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={24}
              className="mt-1 w-full rounded-xl px-3 py-3 text-sm font-mono leading-relaxed resize-y"
              style={{
                background: 'oklch(1 0 0 / 0.05)',
                border: '1px solid oklch(1 0 0 / 0.12)',
                color: 'oklch(0.92 0.005 264)',
                minHeight: '400px',
              }}
            />
          </div>

          <div>
            <Label htmlFor="contract-notes">Belső megjegyzés (opcionális)</Label>
            <Input
              id="contract-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Pl. ügyfél módosítást kért..."
              className="mt-1"
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Vissza
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Szerződés mentése
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
