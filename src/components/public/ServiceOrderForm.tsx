'use client'

import { useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'

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

export function ServiceOrderForm({ serviceName, accentColor, accentGradient }: {
  serviceName: string
  accentColor: string
  accentGradient: string
}) {
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
          <Check className="h-8 w-8" style={{ color: accentColor }} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Megkaptuk az érdeklődésedet!</h3>
        <p style={{ color: 'rgba(255,255,255,0.45)' }}>
          Általában 1 munkanapon belül visszajelzünk.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Név *</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Kovács Péter" required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = `${accentColor}99`)}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Telefon</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+36 30 123 4567"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = `${accentColor}99`)}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Email *</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="pelda@vallalkozas.hu" required
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = `${accentColor}99`)}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Megjegyzés</label>
        <textarea value={form.message} onChange={set('message')} rows={3}
          placeholder="Írj pár szót a vállalkozásodról, igényeidről..."
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => (e.target.style.borderColor = `${accentColor}99`)}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>

      {status === 'error' && (
        <p className="text-sm rounded-xl px-4 py-3"
          style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          Hiba történt. Kérjük próbálja újra.
        </p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: accentGradient }}>
        {status === 'loading'
          ? <><Loader2 className="h-5 w-5 animate-spin" /> Küldés...</>
          : <><Send className="h-4 w-4" /> Érdeklődöm</>}
      </button>

      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Általában 1 munkanapon belül visszajelzünk. Nincs kötelezettség.
      </p>
    </form>
  )
}
