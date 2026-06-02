'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteCustomer } from './actions'

export function DeleteCustomerIconButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Biztosan törölni szeretnéd ezt az ügyfelet? Az összes hozzá tartozó adat is törlődik!')) return
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
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-500/10" title="Törlés">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
