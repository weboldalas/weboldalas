import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteSubscriptionButton } from './DeleteSubscriptionButton'

const subStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Aktív', variant: 'default' },
  trial: { label: 'Próbaidőszak', variant: 'outline' },
  past_due: { label: 'Hátralékos', variant: 'destructive' },
  canceled: { label: 'Lemondva', variant: 'secondary' },
  expired: { label: 'Lejárt', variant: 'secondary' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SubscriptionsList({ subscriptions }: { subscriptions: any[] }) {
  return (
    <div className="rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
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
              <TableCell className="font-medium">
                {sub.customers?.name || 'Ismeretlen'}
              </TableCell>
              <TableCell>{sub.plan_name}</TableCell>
              <TableCell>
                {sub.next_billing_date 
                  ? new Date(sub.next_billing_date).toLocaleDateString('hu-HU') 
                  : '-'}
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
                    <Button variant="ghost" size="sm">
                      Szerkesztés
                    </Button>
                  </Link>
                  <DeleteSubscriptionButton id={sub.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!subscriptions || subscriptions.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nincs megjeleníthető előfizetés.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
