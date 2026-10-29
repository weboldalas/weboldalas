'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cancelBookingByToken } from '@/barber/actions'

export function CancelBooking({ token }: { token: string }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (!confirming) {
    return (
      <button type="button" className="btn btn-ghost hover:!border-[var(--danger)] hover:!text-[var(--danger)]" onClick={() => setConfirming(true)}>
        Lemondom
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[15px] text-[var(--bone-dim)]">Biztosan lemondod?</span>
      <button
        type="button"
        disabled={pending}
        className="btn bg-[var(--danger)] text-[var(--ink)]"
        onClick={() =>
          startTransition(async () => {
            const result = await cancelBookingByToken(token)
            if (!result.ok) setError(result.error ?? 'Nem sikerült lemondani.')
            router.refresh()
          })
        }
      >
        {pending ? 'Lemondás…' : 'Igen, lemondom'}
      </button>
      <button type="button" className="eyebrow hover:!text-[var(--bone)]" onClick={() => setConfirming(false)}>
        Mégsem
      </button>
      {error && <p className="w-full text-[14px] text-[var(--danger)]">{error}</p>}
    </div>
  )
}
