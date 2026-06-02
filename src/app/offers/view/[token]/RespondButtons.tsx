'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'

export function RespondButtons({ token }: { token: string }) {
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const router = useRouter()

  const handleResponse = async (action: 'accept' | 'reject') => {
    if (!confirm(action === 'accept' ? 'Biztosan elfogadja az ajánlatot?' : 'Biztosan elutasítja az ajánlatot?')) {
      return
    }

    setLoading(action)
    try {
      const res = await fetch(`/offers/view/${token}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Hiba történt.')
      }

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <Button 
        onClick={() => handleResponse('accept')} 
        disabled={loading !== null}
        size="lg"
        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20"
      >
        {loading === 'accept' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
        Ajánlat Elfogadása
      </Button>
      
      <Button 
        onClick={() => handleResponse('reject')} 
        disabled={loading !== null}
        size="lg"
        variant="outline"
        className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
      >
        {loading === 'reject' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <X className="mr-2 h-5 w-5" />}
        Elutasítás
      </Button>
    </>
  )
}
