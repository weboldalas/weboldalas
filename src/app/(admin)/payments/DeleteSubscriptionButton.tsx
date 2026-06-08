'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteSubscription } from '../subscriptions/actions'

export function DeleteSubscriptionButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Biztosan törlöd ezt az előfizetést?')) return
    setLoading(true)
    const res = await deleteSubscription(id)
    setLoading(false)
    if (res?.error) {
      toast.error('Törlés sikertelen', { description: res.error })
    } else {
      toast.success('Előfizetés törölve')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors hover:bg-red-500/10 text-white/30 hover:text-red-400 disabled:opacity-50"
      title="Törlés"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  )
}
