'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteCustomer } from '../actions'

export function DeleteCustomerButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Biztosan törölni szeretnéd ezt az ügyfelet? Ez törli az összes hozzá tartozó ajánlatot, befizetést és előfizetést is! A művelet nem vonható vissza.')) return
    setLoading(true)
    const res = await deleteCustomer(id)
    if (res?.error) {
      toast.error('Törlés sikertelen', { description: res.error })
      setLoading(false)
    } else {
      toast.success('Ügyfél törölve')
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading} title="Ügyfél törlése">
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
      Törlés
    </Button>
  )
}
