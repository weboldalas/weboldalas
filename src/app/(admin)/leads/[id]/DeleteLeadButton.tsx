'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteLead } from '../actions'

export function DeleteLeadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Biztosan törölni szeretnéd ezt az érdeklődőt? A művelet nem vonható vissza.')) return
    setLoading(true)
    const res = await deleteLead(id)
    if (res?.error) {
      toast.error('Törlés sikertelen', { description: res.error })
      setLoading(false)
    } else {
      toast.success('Érdeklődő törölve')
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading} title="Érdeklődő törlése">
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
      Törlés
    </Button>
  )
}
