'use client'

import { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import type { Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'

export function ContactForm({ initialInterest = '', initialMessage = '', locale = 'hu' }: { initialInterest?: string; initialMessage?: string; locale?: Locale }) {
  const t = ui(locale).form
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', business: '',
    interest: t.interestOptions.includes(initialInterest) ? initialInterest : '',
    message: initialMessage,
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
          message: `${locale === 'en' ? '[EN] ' : ''}${t.msgCompany}: ${form.business}\n${t.msgInterest}: ${form.interest}\n\n${form.message}`,
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
        <h3 className="mt-6 text-heading-sm">{t.thanks}</h3>
        <p className="text-body font-extralight mt-3 max-w-sm text-silver-mist">{t.contactSuccess}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">{t.name} *</span>
          <input type="text" value={form.name} onChange={set('name')} placeholder={t.namePh} required autoComplete="name" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">{t.phone}</span>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder={t.phonePh} autoComplete="tel" className="void-input" />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="void-field-label">{t.email} *</span>
          <input type="email" value={form.email} onChange={set('email')} placeholder={t.emailPh} required autoComplete="email" className="void-input" />
        </label>
        <label className="block">
          <span className="void-field-label">{t.company}</span>
          <input type="text" value={form.business} onChange={set('business')} placeholder={t.companyPh} autoComplete="organization" className="void-input" />
        </label>
      </div>

      <label className="block">
        <span className="void-field-label">{t.interest}</span>
        <span className="relative block">
          <select value={form.interest} onChange={set('interest')} className="void-input pr-8">
            <option value="">{t.choose}</option>
            {t.interestOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-gray" />
        </span>
      </label>

      <label className="block">
        <span className="void-field-label">{t.message}</span>
        <textarea value={form.message} onChange={set('message')} placeholder={t.messagePh} rows={4} className="void-input resize-none" />
      </label>

      {status === 'error' && <p className="text-sm text-[#fca5a5]">{t.contactError}</p>}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button type="submit" disabled={status === 'loading'} className="void-button disabled:opacity-60">
          {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.sending}</> : t.send}
        </button>
        <span className="text-caption text-ash-gray">{t.successText}</span>
      </div>
    </form>
  )
}
