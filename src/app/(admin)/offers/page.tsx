import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteOfferIconButton } from './DeleteOfferIconButton'

export const metadata = {
  title: 'Ajánlatok | Weboldalas Admin',
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Tervezet', variant: 'secondary' },
  sent: { label: 'Elküldve', variant: 'outline' },
  accepted: { label: 'Elfogadva', variant: 'default' },
  rejected: { label: 'Elutasítva', variant: 'destructive' },
}

const paymentTypeMap: Record<string, string> = {
  one_time: 'Egyösszegű',
  installments: 'Részletfizetés',
  subscription: 'Előfizetés',
}

export default async function OffersPage() {
  const supabase = await createClient()

  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      *,
      customers (
        name,
        email
      ),
      leads (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching offers:', error)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ajánlatok</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Kezeld az ügyfeleknek adott árajánlatokat.
          </p>
        </div>
        <Link href="/offers/new">
          <Button size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Ajánlat</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ügyfél / Érdeklődő</TableHead>
              <TableHead>Dátum</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead>Fizetési mód</TableHead>
              <TableHead className="text-right">Összeg</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers?.map((offer) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const targetName = (offer as any).customers?.name || (offer as any).leads?.name || 'Ismeretlen'
              const isLead = !!(offer as any).leads?.name && !(offer as any).customers?.name
              return (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {targetName}
                      {isLead && <Badge variant="outline" className="text-xs">Lead</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[offer.status]?.variant || 'default'}>
                      {statusMap[offer.status]?.label || offer.status}
                    </Badge>
                    {offer.is_realized && (
                      <Badge variant="outline" className="ml-1 text-xs text-blue-400 border-blue-400/30">Realizálva</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-white/60">
                    {paymentTypeMap[offer.payment_type] || offer.payment_type}
                    {offer.payment_type === 'installments' && ` (${offer.installment_months} hó)`}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(offer.total_amount).toLocaleString('hu-HU')} Ft
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/offers/${offer.id}`}>
                        <Button variant="ghost" size="sm">Szerkesztés</Button>
                      </Link>
                      <DeleteOfferIconButton id={offer.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!offers || offers.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nincs megjeleníthető ajánlat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobil + Tablet: Kártyák */}
      <div className="lg:hidden flex flex-col gap-3">
        {offers?.map((offer) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const targetName = (offer as any).customers?.name || (offer as any).leads?.name || 'Ismeretlen'
          const isLead = !!(offer as any).leads?.name && !(offer as any).customers?.name
          return (
            <Link key={offer.id} href={`/offers/${offer.id}`} className="block">
              <Card className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer border-white/10" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white truncate">{targetName}</span>
                        {isLead && <Badge variant="outline" className="text-xs">Lead</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={statusMap[offer.status]?.variant || 'default'} className="text-xs">
                          {statusMap[offer.status]?.label || offer.status}
                        </Badge>
                        {offer.is_realized && (
                          <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">Realizálva</Badge>
                        )}
                        <span className="text-xs text-white/30">
                          {paymentTypeMap[offer.payment_type] || offer.payment_type}
                          {offer.payment_type === 'installments' && ` (${offer.installment_months} hó)`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: 'oklch(0.70 0.22 290)' }}>
                          {Number(offer.total_amount).toLocaleString('hu-HU')} Ft
                        </span>
                        <span className="text-xs text-white/30">
                          {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <DeleteOfferIconButton id={offer.id} />
                      <ArrowRight className="h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {(!offers || offers.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p className="text-lg mb-2">Nincs megjeleníthető ajánlat.</p>
            <Link href="/offers/new">
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Új Ajánlat létrehozása
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
