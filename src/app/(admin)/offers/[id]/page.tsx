import { createClient } from '@/utils/supabase/server'
import { OfferForm } from '../OfferForm'
import { notFound } from 'next/navigation'
import { SendOfferButton } from './SendOfferButton'
import { RealizeOfferButton } from './RealizeOfferButton'
import { DeleteOfferButton } from './DeleteOfferButton'
import { Badge } from '@/components/ui/badge'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Tervezet', variant: 'outline' },
  sent: { label: 'Kiküldve', variant: 'secondary' },
  accepted: { label: 'Elfogadva', variant: 'default' },
  rejected: { label: 'Elutasítva', variant: 'destructive' },
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Ajánlat Szerkesztése</h1>
          <Badge variant={statusMap[offer.status]?.variant || 'outline'}>
            {statusMap[offer.status]?.label || offer.status}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
