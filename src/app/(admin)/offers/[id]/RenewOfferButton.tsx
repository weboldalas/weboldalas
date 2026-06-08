'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import { renewOffer } from '../actions'

export function RenewOfferButton({ offerId, currentExpiresAt }: { offerId: string; currentExpiresAt?: string }) {
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const defaultDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })()
  const [date, setDate] = useState(currentExpiresAt?.split('T')[0] || defaultDate)

  const handleRenew = async () => {
    setLoading(true)
    const res = await renewOffer(offerId, date)
    setLoading(false)
    if (res?.error) {
      toast.error('Megújítás sikertelen', { description: res.error })
    } else {
      toast.success('Ajánlat megújítva', { description: `Új lejárat: ${new Date(date).toLocaleDateString('hu-HU')}` })
      setShowPicker(false)
    }
  }

  if (!showPicker) {
    return (
      <Button onClick={() => setShowPicker(true)} variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
        <RefreshCw className="mr-2 h-4 w-4" /> Megújítás
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date}
        min={new Date().toISOString().split('T')[0]}
        onChange={e => setDate(e.target.value)}
        className="rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
      />
      <Button onClick={handleRenew} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Megújítás
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)} className="text-white/40">
        Mégse
      </Button>
    </div>
  )
}
