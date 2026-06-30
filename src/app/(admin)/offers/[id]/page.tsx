import { createClient } from '@/utils/supabase/server'
import { OfferForm } from '../OfferForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SendOfferButton } from './SendOfferButton'
import { RealizeOfferButton } from './RealizeOfferButton'
import { DeleteOfferButton } from './DeleteOfferButton'
import { RenewOfferButton } from './RenewOfferButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarX, FileSignature } from 'lucide-react'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft:    { label: 'Tervezet',   variant: 'outline' },
  sent:     { label: 'Kiküldve',   variant: 'secondary' },
  accepted: { label: 'Elfogadva',  variant: 'default' },
  rejected: { label: 'Elutasítva', variant: 'destructive' },
  expired:  { label: 'Lejárt',     variant: 'destructive' },
}

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: offer, error: offerError },
    { data: customers },
    { data: leads }
  ] = await Promise.all([
    supabase
      .from('offers')
      .select('*, offer_items(*)')
      .eq('id', id)
      .single(),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('leads').select('id, name').order('name')
  ])

  if (offerError || !offer) {
    notFound()
  }

  const isCompleted = offer.status === 'accepted' || offer.status === 'rejected'
  const isExpired = offer.status === 'expired'
  const expiresAt = offer.expires_at ? new Date(offer.expires_at) : null
  const isExpiringSoon = expiresAt && offer.status === 'sent' && (expiresAt.getTime() - Date.now()) < 2 * 24 * 60 * 60 * 1000

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight text-white">Ajánlat Szerkesztése</h1>
          <Badge variant={statusMap[offer.status]?.variant || 'outline'}>
            {statusMap[offer.status]?.label || offer.status}
          </Badge>
          {expiresAt && (
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isExpiringSoon || isExpired ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-white/40 bg-white/5 border border-white/10'}`}>
              <CalendarX className="h-3.5 w-3.5" />
              Lejárat: {expiresAt.toLocaleDateString('hu-HU')}
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <Link href={`/contracts/new?offer_id=${offer.id}${offer.customer_id ? `&customer_id=${offer.customer_id}` : ''}`}>
            <Button variant="outline" size="sm" style={{ borderColor: 'oklch(0.68 0.22 290 / 0.4)', color: 'oklch(0.78 0.18 290)' }}>
              <FileSignature className="mr-1.5 h-4 w-4" /> Szerződés készítése
            </Button>
          </Link>
          {isExpired && <RenewOfferButton offerId={offer.id} currentExpiresAt={offer.expires_at} />}
          <RealizeOfferButton
            offerId={offer.id}
            status={offer.status}
            isRealized={offer.is_realized}
          />
          <SendOfferButton
            offerId={offer.id}
            status={offer.status}
            disabled={isCompleted}
          />
          <DeleteOfferButton id={offer.id} />
        </div>
      </div>
      <OfferForm
        offer={offer}
        customers={customers || []}
        leads={leads || []}
      />
    </div>
  )
}
