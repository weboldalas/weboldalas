'use client'

import { useActionState, useEffect, useRef, useTransition } from 'react'
import { Ban, CheckCircle2, Loader2, RotateCcw, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { deleteInvoice, deletePayment, recordPayment, setInvoiceStatus, type ActionResult } from '../actions'

export function InvoiceActions({ invoiceId, status, open, currency, today }: { invoiceId: string; status: string; open: number; currency: string; today: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(recordPayment.bind(null, invoiceId), null)
  const [busy, startTransition] = useTransition()
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) { toast.success('Befizetés rögzítve'); form.current?.reset() }
    if (state?.error) toast.error(state.error)
  }, [state])

  const run = (fn: () => Promise<ActionResult>, message: string) => startTransition(async () => {
    const result = await fn()
    if (result?.error) toast.error(result.error)
    else toast.success(message)
  })

  if (status === 'cancelled') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>Ez a számla sztornózva van, nem számít bele a kintlévőségbe.</p>
        <button type="button" className="crm-btn crm-btn-secondary" disabled={busy} onClick={() => run(() => setInvoiceStatus(invoiceId, 'issued'), 'Számla visszaállítva')}><RotateCcw /> Visszaállítás</button>
        <button type="button" className="crm-btn crm-btn-ghost" disabled={busy} onClick={() => { if (window.confirm('Biztosan törlöd a számlát?')) run(() => deleteInvoice(invoiceId), 'Számla törölve') }}><Trash2 /> Törlés</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {open > 0 && (
        <>
          <form action={action} className="flex flex-col gap-2">
            <input type="hidden" name="amount" value={open} />
            <input type="hidden" name="payment_date" value={today} />
            <button type="submit" className="crm-btn crm-btn-primary" disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Fizetve (teljes összeg, ma)</button>
          </form>
          <details className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
            <summary className="cursor-pointer text-[13px] font-[550]" style={{ color: 'var(--text-2)' }}>Részfizetés vagy más dátum</summary>
            <form ref={form} action={action} className="mt-3 flex flex-col gap-2">
              <div className="crm-field"><label htmlFor="pay-amount">Összeg ({currency})</label><input id="pay-amount" name="amount" inputMode="decimal" className="crm-input" defaultValue={open} required /></div>
              <div className="crm-field"><label htmlFor="pay-date">Befizetés napja</label><input id="pay-date" name="payment_date" type="date" className="crm-input" defaultValue={today} required /></div>
              <div className="crm-field"><label htmlFor="pay-note">Megjegyzés</label><input id="pay-note" name="note" className="crm-input" placeholder="Pl. átutalás" /></div>
              <button type="submit" className="crm-btn crm-btn-secondary" disabled={pending}>Befizetés rögzítése</button>
            </form>
          </details>
        </>
      )}
      {status !== 'paid' && (
        <button type="button" className="crm-btn crm-btn-ghost" disabled={busy} onClick={() => { if (window.confirm('Sztornózod a számlát? Nem számít bele a kintlévőségbe.')) run(() => setInvoiceStatus(invoiceId, 'cancelled'), 'Számla sztornózva') }}>
          <Ban /> Sztornó
        </button>
      )}
    </div>
  )
}

export function PaymentRowActions({ invoiceId, paymentId }: { invoiceId: string; paymentId: string }) {
  const [busy, startTransition] = useTransition()
  return (
    <button
      type="button"
      className="crm-btn crm-btn-ghost crm-btn-sm crm-btn-icon"
      aria-label="Befizetés törlése"
      disabled={busy}
      onClick={() => {
        if (!window.confirm('Törlöd ezt a befizetést?')) return
        startTransition(async () => {
          const result = await deletePayment(invoiceId, paymentId)
          if (result.error) toast.error(result.error)
          else toast.success('Befizetés törölve')
        })
      }}
    >
      <X />
    </button>
  )
}
