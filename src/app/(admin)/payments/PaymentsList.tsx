import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const paymentStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:   { label: 'Függőben',          variant: 'outline'      },
  completed: { label: 'Teljesítve',        variant: 'default'      },
  overdue:   { label: 'Lejárt / hátralék', variant: 'destructive'  },
  failed:    { label: 'Sikertelen',        variant: 'destructive'  },
  canceled:  { label: 'Törölve',           variant: 'secondary'    },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PaymentsList({ payments }: { payments: any[] }) {
  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
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
                <TableCell className="font-medium">{payment.customers?.name || 'Ismeretlen'}</TableCell>
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
                    <Button variant="ghost" size="sm">Szerkesztés</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!payments || payments.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Nincs megjeleníthető befizetés.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile + Tablet: Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {payments?.map((payment) => (
          <Link key={payment.id} href={`/payments/${payment.id}`} className="block">
            <Card className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer border-white/10" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate mb-1.5">
                      {payment.customers?.name || 'Ismeretlen'}
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={paymentStatusMap[payment.status]?.variant || 'default'} className="text-xs">
                        {paymentStatusMap[payment.status]?.label || payment.status}
                      </Badge>
                      <span className="text-xs text-white/40 capitalize">{payment.payment_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: 'oklch(0.70 0.22 290)' }}>
                        {Number(payment.amount).toLocaleString('hu-HU')} {payment.currency}
                      </span>
                      <span className="text-xs text-white/30">
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString('hu-HU')
                          : payment.due_date
                            ? new Date(payment.due_date).toLocaleDateString('hu-HU')
                            : '-'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!payments || payments.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p>Nincs megjeleníthető befizetés.</p>
          </div>
        )}
      </div>
    </>
  )
}
