'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Play } from 'lucide-react'
import { realizeOffer } from '../actions'

export function RealizeOfferButton({ offerId, status, isRealized }: { offerId: string, status: string, isRealized: boolean }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleRealize = async () => {
    if (!confirm('Biztosan realizálod ezt az ajánlatot? Ez létrehozza a pénzügyi tételeket és az ügyfelet (ha szükséges).')) return
    setLoading(true)
    const res = await realizeOffer(offerId)
    setLoading(false)
    if (res?.error) {
      toast.error('Realizálás sikertelen', { description: res.error })
    } else {
      setDone(true)
      toast.success('Ajánlat realizálva', { description: 'Pénzügyi tételek létrehozva.' })
    }
  }

  if (isRealized || done) {
    return (
      <Button variant="outline" disabled className="text-blue-500 border-blue-500/20 bg-blue-500/10">
        <CheckCircle2 className="mr-2 h-4 w-4" /> Ez az ajánlat már realizálva lett
      </Button>
    )
  }

  if (status !== 'accepted') return null

  return (
    <Button onClick={handleRealize} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-current" />}
      Realizálás / Ügyfél & Pénzügy generálása
    </Button>
  )
}
