'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteOffer } from '../actions'

export function DeleteOfferButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Biztosan törölni szeretnéd ezt az ajánlatot? A művelet nem vonható vissza.')) return
    setLoading(true)
    const res = await deleteOffer(id)
    if (res?.error) {
      toast.error('Törlés sikertelen', { description: res.error })
      setLoading(false)
    } else {
      toast.success('Ajánlat törölve')
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading} title="Ajánlat törlése">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
