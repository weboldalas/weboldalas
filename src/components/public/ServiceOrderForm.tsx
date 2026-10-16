'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

export function ServiceOrderForm({ serviceName }: { serviceName: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
          message: form.message,
          interest_type: serviceName,
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
        <h3 className="mt-6 text-heading-2xs">Megkaptuk az érdeklődésedet!</h3>
        <p className="text-body font-extralight mt-2 text-silver-mist">Általában 1 munkanapon belül visszajelzünk.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">Név *</span>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Kovács Péter" required autoComplete="name" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">Telefon</span>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+36 30 123 4567" autoComplete="tel" className="void-input" />
        </label>
      </div>
      <label className="block">
        <span className="void-field-label">Email *</span>
        <input type="email" value={form.email} onChange={set('email')} placeholder="pelda@vallalkozas.hu" required autoComplete="email" className="void-input" />
      </label>
      <label className="block">
        <span className="void-field-label">Megjegyzés</span>
        <textarea value={form.message} onChange={set('message')} rows={3} placeholder="Írj pár szót a vállalkozásodról, igényeidről…" className="void-input resize-none" />
      </label>

      {status === 'error' && (
        <p className="text-sm text-[#fca5a5]">Hiba történt a küldés során. Kérjük, próbáld újra.</p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button type="submit" disabled={status === 'loading'} className="void-button disabled:opacity-60">
          {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Küldés…</> : 'Érdeklődöm'}
        </button>
        <span className="text-caption text-ash-gray">Nincs kötelezettség.</span>
      </div>
    </form>
  )
}
