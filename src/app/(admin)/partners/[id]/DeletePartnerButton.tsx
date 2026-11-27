'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deletePartner } from '../actions'

export function DeletePartnerButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      className="crm-btn crm-btn-ghost crm-btn-sm"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Biztosan törlöd: ${name}? Az ajánlatai, havidíjai és projektjei is törlődnek.`)) return
        startTransition(async () => {
          const result = await deletePartner(id)
          if (result?.error) toast.error(result.error)
        })
      }}
    >
      <Trash2 /> Partner törlése
    </button>
  )
}
