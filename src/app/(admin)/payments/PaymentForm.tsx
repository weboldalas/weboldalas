'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ControlledSelect } from '@/components/ui/controlled-select'
import { createPayment, updatePayment } from './actions'

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Függőben' },
  { value: 'completed', label: 'Teljesítve' },
  { value: 'overdue',   label: 'Lejárt / hátralékos' },
  { value: 'failed',    label: 'Sikertelen' },
  { value: 'canceled',  label: 'Törölve' },
]

const CURRENCY_OPTIONS = [
  { value: 'HUF', label: 'HUF' },
  { value: 'EUR', label: 'EUR' },
]

const TYPE_OPTIONS = [
  { value: 'egyszeri',    label: 'Egyszeri' },
  { value: 'részlet',     label: 'Részlet' },
  { value: 'előfizetés',  label: 'Előfizetés' },
  { value: 'egyéb',       label: 'Egyéb' },
]

export function PaymentForm({ payment, customers, defaultCustomerId }: {
  payment?: any
  customers: any[]
  defaultCustomerId?: string
}) {
  const isEditing = !!payment
  const action = isEditing ? updatePayment.bind(null, payment.id) : createPayment
  const [state, formAction, pending] = useActionState(action, null)

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))

  return (
    <Card className="max-w-3xl mx-auto w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Befizetés szerkesztése' : 'Új Befizetés'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ügyfél *</Label>
              <ControlledSelect
                name="customer_id"
                options={customerOptions}
                defaultValue={payment?.customer_id || defaultCustomerId || ''}
                placeholder="Válassz ügyfelet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Státusz *</Label>
              <ControlledSelect name="status" options={STATUS_OPTIONS} defaultValue={payment?.status || 'pending'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Összeg *</Label>
              <Input id="amount" name="amount" type="number" defaultValue={payment?.amount} required />
            </div>

            <div className="space-y-2">
              <Label>Pénznem</Label>
              <ControlledSelect name="currency" options={CURRENCY_OPTIONS} defaultValue={payment?.currency || 'HUF'} />
            </div>

            <div className="space-y-2">
              <Label>Típus</Label>
              <ControlledSelect name="payment_type" options={TYPE_OPTIONS} defaultValue={payment?.payment_type || 'egyéb'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Esedékesség</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={payment?.due_date ? new Date(payment.due_date).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Fizetés dátuma</Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                defaultValue={payment?.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Megjegyzés</Label>
            <Textarea id="note" name="note" defaultValue={payment?.note} rows={3} />
          </div>

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Link href="/payments">
              <Button variant="outline" type="button">Mégse</Button>
            </Link>
            <Button type="submit" disabled={pending}>
              {pending ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
