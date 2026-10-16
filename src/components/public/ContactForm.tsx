'use client'

import { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'

const INTEREST_OPTIONS = [
  'Bemutatkozó weboldal',
  'Webshop',
  'Landing Page',
  'Foglalási rendszer',
  'CRM rendszer',
  'Üzemeltetés',
  'Egyéb',
]

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', business: '', interest: '', message: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: `Vállalkozás: ${form.business}\nÉrdeklődés: ${form.interest}\n\n${form.message}`,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="void-fade py-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-electric-iris">
          <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
        </span>
        <h3 className="mt-6 text-heading-sm">Köszönjük!</h3>
        <p className="text-body font-extralight mt-3 max-w-sm text-silver-mist">
          Megkaptuk az üzenetedet. Általában 1 munkanapon belül jelentkezünk.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">Név *</span>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Kovács Péter" required autoComplete="name" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">Telefon</span>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+36 30 123 4567" autoComplete="tel" className="void-input" />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">Email *</span>
          <input type="email" value={form.email} onChange={set('email')} placeholder="pelda@vallalkozas.hu" required autoComplete="email" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">Vállalkozás neve</span>
          <input type="text" value={form.business} onChange={set('business')} placeholder="pl. Kovács Fodrászat" autoComplete="organization" className="void-input" />
        </label>
      </div>

      <label className="block">
        <span className="void-field-label">Miben érdeklődsz?</span>
        <span className="relative block">
          <select value={form.interest} onChange={set('interest')} className="void-input pr-8">
            <option value="">Válassz…</option>
            {INTEREST_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-gray" />
        </span>
      </label>

      <label className="block">
        <span className="void-field-label">Üzenet</span>
        <textarea value={form.message} onChange={set('message')} placeholder="Írj pár szót a vállalkozásodról, igényeidről…" rows={4} className="void-input resize-none" />
      </label>

      {status === 'error' && (
        <p className="text-sm text-[#fca5a5]">Hiba történt a küldés során. Kérjük, próbáld újra, vagy hívj minket.</p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button type="submit" disabled={status === 'loading'} className="void-button disabled:opacity-60">
          {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Küldés…</> : 'Üzenet küldése'}
        </button>
        <span className="text-caption text-ash-gray">Általában 1 munkanapon belül visszajelzünk.</span>
      </div>
    </form>
  )
}
