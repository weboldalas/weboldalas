import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { DeleteSubscriptionButton } from './DeleteSubscriptionButton'

const subStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active:   { label: 'Aktív',          variant: 'default'     },
  trial:    { label: 'Próbaidőszak',   variant: 'outline'     },
  past_due: { label: 'Hátralékos',     variant: 'destructive' },
  canceled: { label: 'Lemondva',       variant: 'secondary'   },
  expired:  { label: 'Lejárt',         variant: 'secondary'   },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SubscriptionsList({ subscriptions }: { subscriptions: any[] }) {
  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ügyfél</TableHead>
              <TableHead>Csomag</TableHead>
              <TableHead>Következő Fizetés</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead className="text-right">Havi díj</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions?.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.customers?.name || 'Ismeretlen'}</TableCell>
                <TableCell>{sub.plan_name}</TableCell>
                <TableCell>
                  {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString('hu-HU') : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={subStatusMap[sub.status]?.variant || 'default'}>
                    {subStatusMap[sub.status]?.label || sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {Number(sub.monthly_fee).toLocaleString('hu-HU')} {sub.currency}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/subscriptions/${sub.id}`}>
                      <Button variant="ghost" size="sm">Szerkesztés</Button>
                    </Link>
                    <DeleteSubscriptionButton id={sub.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!subscriptions || subscriptions.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Nincs megjeleníthető előfizetés.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile + Tablet: Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {subscriptions?.map((sub) => (
          <div key={sub.id} className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{sub.customers?.name || 'Ismeretlen'}</div>
                <div className="text-xs text-white/40 mt-0.5 truncate">{sub.plan_name}</div>
              </div>
              <Badge variant={subStatusMap[sub.status]?.variant || 'default'} className="text-xs shrink-0">
                {subStatusMap[sub.status]?.label || sub.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="text-lg font-bold" style={{ color: 'oklch(0.70 0.22 290)' }}>
                  {Number(sub.monthly_fee).toLocaleString('hu-HU')} {sub.currency}
                </span>
                <span className="text-xs text-white/30 ml-1">/hó</span>
                {sub.next_billing_date && (
                  <div className="text-xs text-white/30 mt-0.5">
                    Köv. fizetés: {new Date(sub.next_billing_date).toLocaleDateString('hu-HU')}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/subscriptions/${sub.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2">Szerkesztés</Button>
                </Link>
                <DeleteSubscriptionButton id={sub.id} />
                <ArrowRight className="h-4 w-4 text-white/20" />
              </div>
            </div>
          </div>
        ))}
        {(!subscriptions || subscriptions.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p>Nincs megjeleníthető előfizetés.</p>
          </div>
        )}
      </div>
    </>
  )
}
