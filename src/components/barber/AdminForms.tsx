'use client'

import { useActionState, useEffect, useRef } from 'react'
import { adminCreate, adminLogin } from '@/barber/actions'
import { services } from '@/barber/config'

export function AdminLogin({ demoPin }: { demoPin: boolean }) {
  const [state, action, pending] = useActionState(adminLogin, undefined)
  return (
    <form action={action} className="mx-auto max-w-sm">
      <p className="eyebrow eyebrow-brass mb-6">Admin</p>
      <h1 className="text-[56px] font-extralight leading-none tracking-[-0.05em]">
        Napi <span className="serif italic">naptár.</span>
      </h1>
      <label className="mt-12 block">
        <span className="eyebrow">PIN</span>
        <input name="pin" type="password" inputMode="numeric" autoComplete="current-password" autoFocus className="field text-[28px] tracking-[0.4em]" aria-invalid={!!state?.error} />
      </label>
      {state?.error && <p className="mt-3 text-[14px] text-[var(--danger)]">{state.error}</p>}
      {demoPin && <p className="mt-4 text-[13px] text-[var(--muted)]">Demó mód — a PIN: 0000</p>}
      <button className="btn btn-solid mt-10 w-full" disabled={pending}>
        {pending ? 'Belépés…' : 'Belépés'}
      </button>
    </form>
  )
}

export function AdminNewBooking({ date }: { date: string }) {
  const [state, action, pending] = useActionState(adminCreate, undefined)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="grid gap-6 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="eyebrow">Szolgáltatás</span>
        <select name="serviceId" className="field" defaultValue={services[0].id}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.durationMin} perc
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow">Nap</span>
        <input key={date} name="date" type="date" defaultValue={date} className="field [color-scheme:dark]" required />
      </label>
      <label className="block">
        <span className="eyebrow">Kezdés</span>
        <input name="time" type="time" step={300} defaultValue="10:00" className="field [color-scheme:dark]" required />
      </label>
      <label className="block">
        <span className="eyebrow">Név</span>
        <input name="name" className="field" placeholder="Vendég neve" required />
      </label>
      <label className="block">
        <span className="eyebrow">Telefon</span>
        <input name="phone" type="tel" className="field" placeholder="Nem kötelező" />
      </label>
      <div className="flex items-center gap-4 sm:col-span-2">
        <button className="btn btn-solid" disabled={pending}>
          {pending ? 'Mentés…' : 'Rögzítés'}
        </button>
        {state?.error && <p className="text-[14px] text-[var(--danger)]">{state.error}</p>}
        {state?.ok && <p className="text-[14px] text-emerald-400">Rögzítve.</p>}
      </div>
    </form>
  )
}
