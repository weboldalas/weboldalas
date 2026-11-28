'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { realizeOffer } from '../actions'

export function RealizeOfferButton({ offerId, status, isRealized }: { offerId: string; status: string; isRealized: boolean }) {
  const [pending, startTransition] = useTransition()

  if (isRealized) {
    return <span className="crm-badge is-success"><CheckCircle2 size={14} /> Realizálva: számlák és havidíj létrehozva</span>
  }
  if (status !== 'accepted') return null

  return (
    <button
      type="button"
      className="crm-btn crm-btn-primary"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('Realizálod az ajánlatot? Létrejön a partner (ha még nincs), a számla vagy a havidíj.')) return
        startTransition(async () => {
          const res = await realizeOffer(offerId)
          if (res?.error) toast.error('A realizálás nem sikerült', { description: res.error })
          else toast.success('Ajánlat realizálva', { description: 'A számlák a Számlák menüben, a havidíj a Havidíjaknál látható.' })
        })
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Sparkles />} Realizálás
    </button>
  )
}
