'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ControlledSelect } from '@/components/ui/controlled-select'
import { createSubscription, updateSubscription } from './actions'

const STATUS_OPTIONS = [
  { value: 'active',    label: 'Aktív' },
  { value: 'trial',     label: 'Próbaidőszak' },
  { value: 'past_due',  label: 'Hátralékos' },
  { value: 'canceled',  label: 'Lemondva' },
  { value: 'expired',   label: 'Lejárt' },
]

const CURRENCY_OPTIONS = [
  { value: 'HUF', label: 'HUF' },
  { value: 'EUR', label: 'EUR' },
]

export function SubscriptionForm({ subscription, customers, defaultCustomerId }: {
  subscription?: any
  customers: any[]
  defaultCustomerId?: string
}) {
  const isEditing = !!subscription
  const action = isEditing ? updateSubscription.bind(null, subscription.id) : createSubscription
  const [state, formAction, pending] = useActionState(action, null)

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))

  return (
    <Card className="max-w-3xl mx-auto w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Előfizetés szerkesztése' : 'Új Előfizetés'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ügyfél *</Label>
              <ControlledSelect
                name="customer_id"
                options={customerOptions}
                defaultValue={subscription?.customer_id || defaultCustomerId || ''}
                placeholder="Válassz ügyfelet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Státusz *</Label>
              <ControlledSelect name="status" options={STATUS_OPTIONS} defaultValue={subscription?.status || 'active'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan_name">Csomag neve *</Label>
              <Input id="plan_name" name="plan_name" defaultValue={subscription?.plan_name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_fee">Havi díj *</Label>
              <Input id="monthly_fee" name="monthly_fee" type="number" defaultValue={subscription?.monthly_fee} required />
            </div>

            <div className="space-y-2">
              <Label>Pénznem</Label>
              <ControlledSelect name="currency" options={CURRENCY_OPTIONS} defaultValue={subscription?.currency || 'HUF'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Indulás dátuma</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={subscription?.start_date ? new Date(subscription.start_date).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Szerződés vége</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={subscription?.end_date ? new Date(subscription.end_date).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_billing_date">Következő fizetés</Label>
              <Input
                id="next_billing_date"
                name="next_billing_date"
                type="date"
                defaultValue={subscription?.next_billing_date ? new Date(subscription.next_billing_date).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Megjegyzés</Label>
            <Textarea id="note" name="note" defaultValue={subscription?.note} rows={3} />
          </div>

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Link href="/subscriptions">
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
