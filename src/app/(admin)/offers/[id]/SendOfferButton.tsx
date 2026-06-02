'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Send, CheckCircle } from 'lucide-react'
import { sendOfferEmail } from '../actions'

export function SendOfferButton({ offerId, status, disabled }: { offerId: string, status: string, disabled: boolean }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    const res = await sendOfferEmail(offerId)
    setLoading(false)
    if (res?.error) {
      toast.error('Email küldés sikertelen', { description: res.error })
    } else {
      setSent(true)
      toast.success('Ajánlat elküldve emailben')
    }
  }

  if (sent || status === 'sent') {
    return (
      <Button variant="outline" disabled className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
        <CheckCircle className="mr-2 h-4 w-4" /> Kiküldve
      </Button>
    )
  }

  return (
    <Button
      onClick={handleSend}
      disabled={disabled || loading}
      className="bg-violet-600 hover:bg-violet-700 text-white"
    >
      <Send className="mr-2 h-4 w-4" />
      {loading ? 'Küldés...' : 'Küldés emailben'}
    </Button>
  )
}
