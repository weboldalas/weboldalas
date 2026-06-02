'use client'

import { useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'

const INTEREST_OPTIONS = [
  'Bemutatkozó weboldal',
  'Webshop',
  'Landing Page',
  'Foglalási rendszer',
  'CRM rendszer',
  'Üzemeltetés',
  'Egyéb',
]

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '0.75rem',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s',
}

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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
          <Check className="h-8 w-8" style={{ color: '#34d399' }} strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Köszönjük!</h3>
        <p className="max-w-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Megkaptuk az üzenetét. Munkatársaink hamarosan felveszik Önnel a kapcsolatot.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Név *</label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Kovács Péter"
            required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Telefon</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+36 30 123 4567"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="pelda@valalkozas.hu"
          required
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Vállalkozás neve</label>
        <input
          type="text"
          value={form.business}
          onChange={set('business')}
          placeholder="pl. Kovács Fodrászat"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Miben érdeklődsz?</label>
        <select
          value={form.interest}
          onChange={set('interest')}
          style={{ ...inputStyle, appearance: 'none' as any }}
          onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          <option value="" style={{ background: '#0f0f1a' }}>Válassz...</option>
          {INTEREST_OPTIONS.map(o => (
            <option key={o} value={o} style={{ background: '#0f0f1a' }}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Megjegyzés</label>
        <textarea
          value={form.message}
          onChange={set('message')}
          placeholder="Írj pár szót a vállalkozásodról, igényeidről..."
          rows={4}
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm rounded-xl px-4 py-3"
          style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          Hiba történt a küldés során. Kérjük próbálja újra, vagy hívjon minket.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)' }}
      >
        {status === 'loading' ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Küldés...</>
        ) : (
          <><Send className="h-5 w-5" /> Üzenet küldése</>
        )}
      </button>

      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Általában 1 munkanapon belül visszajelzünk.
      </p>
    </form>
  )
}
