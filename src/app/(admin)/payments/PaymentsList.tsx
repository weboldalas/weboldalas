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

const paymentStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Függőben', variant: 'outline' },
  completed: { label: 'Teljesítve', variant: 'default' },
  overdue: { label: 'Lejárt / hátralékos', variant: 'destructive' },
  failed: { label: 'Sikertelen', variant: 'destructive' },
  canceled: { label: 'Törölve', variant: 'secondary' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PaymentsList({ payments }: { payments: any[] }) {
  return (
    <div className="rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ügyfél</TableHead>
            <TableHead>Típus</TableHead>
            <TableHead>Dátum / Esedékesség</TableHead>
            <TableHead>Státusz</TableHead>
            <TableHead className="text-right">Összeg</TableHead>
            <TableHead className="text-right">Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {payment.customers?.name || 'Ismeretlen'}
              </TableCell>
              <TableCell className="capitalize">{payment.payment_type}</TableCell>
              <TableCell>
                {payment.payment_date 
                  ? new Date(payment.payment_date).toLocaleDateString('hu-HU') 
                  : payment.due_date 
                    ? `Esedékes: ${new Date(payment.due_date).toLocaleDateString('hu-HU')}`
                    : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={paymentStatusMap[payment.status]?.variant || 'default'}>
                  {paymentStatusMap[payment.status]?.label || payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {Number(payment.amount).toLocaleString('hu-HU')} {payment.currency}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/payments/${payment.id}`}>
                  <Button variant="ghost" size="sm">
                    Szerkesztés
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {(!payments || payments.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nincs megjeleníthető befizetés.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
