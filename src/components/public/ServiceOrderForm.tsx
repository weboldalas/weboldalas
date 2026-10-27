'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'

export function ServiceOrderForm({ serviceName, locale = 'hu' }: { serviceName: string; locale?: Locale }) {
  const t = ui(locale).form
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
        <h3 className="mt-6 text-heading-2xs">{t.successInterest}</h3>
        <p className="text-body font-extralight mt-2 text-silver-mist">{t.successText}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">{t.name} *</span>
          <input type="text" value={form.name} onChange={set('name')} placeholder={t.namePh} required autoComplete="name" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">{t.phone}</span>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder={t.phonePh} autoComplete="tel" className="void-input" />
        </label>
      </div>
      <label className="block">
        <span className="void-field-label">{t.email} *</span>
        <input type="email" value={form.email} onChange={set('email')} placeholder={t.emailPh} required autoComplete="email" className="void-input" />
      </label>
      <label className="block">
        <span className="void-field-label">{t.note}</span>
        <textarea value={form.message} onChange={set('message')} rows={3} placeholder={t.messagePh} className="void-input resize-none" />
      </label>

      {status === 'error' && (
        <p className="text-sm text-[#fca5a5]">{t.error}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button type="submit" disabled={status === 'loading'} className="void-button disabled:opacity-60">
          {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.sending}</> : t.interestSend}
        </button>
        <span className="text-caption text-ash-gray">{t.noObligation}</span>
      </div>
    </form>
  )
}
