'use client'

import { useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteDocument } from './actions'

export function DeleteContractButton({ id, isLocked }: { id: string; isLocked: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    const msg = isLocked
      ? 'Ez a szerződés ALÁÍRT és ZÁROLT. Biztosan törlöd? Ez nem visszavonható.'
      : 'Biztosan törlöd ezt a szerződést? Ez nem visszavonható.'
    if (!confirm(msg)) return
    startTransition(async () => { await deleteDocument(id) })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="Törlés"
      className="flex items-center justify-center h-7 w-7 rounded-lg transition-all text-red-400/50 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40"
    >
      {isPending
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : <Trash2 className="h-3.5 w-3.5" />
      }
    </button>
  )
}
