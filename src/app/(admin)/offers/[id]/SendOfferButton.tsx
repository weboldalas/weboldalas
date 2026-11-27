'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2, RotateCw, Send } from 'lucide-react'
import { sendOfferEmail } from '../actions'

export function SendOfferButton({ offerId, status, disabled }: { offerId: string; status: string; disabled: boolean }) {
  const [pending, startTransition] = useTransition()
  if (status === 'accepted' || status === 'rejected') return null
  const resend = status === 'sent'

  return (
    <button
      type="button"
      className={`crm-btn ${resend ? 'crm-btn-secondary' : 'crm-btn-primary'}`}
      disabled={disabled || pending}
      onClick={() => {
        if (resend && !window.confirm('Újra elküldöd az ajánlatot ugyanarra a címre?')) return
        startTransition(async () => {
          const res = await sendOfferEmail(offerId)
          if (res?.error) toast.error('Az ajánlat nem ment el', { description: res.error })
          else toast.success('Ajánlat elküldve', { description: res?.to ? `Címzett: ${res.to}` : undefined })
        })
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : resend ? <RotateCw /> : <Send />}
      {pending ? 'Küldés…' : resend ? 'Újraküldés' : 'Küldés emailben'}
    </button>
  )
}
