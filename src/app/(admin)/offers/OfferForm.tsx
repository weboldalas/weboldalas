'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ControlledSelect } from '@/components/ui/controlled-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createOffer, updateOffer } from './actions'

type OfferItem = {
  id?: string
  description: string
  price: number
}

const STATUS_OPTIONS = [
  { value: 'draft',    label: 'Tervezet' },
  { value: 'sent',     label: 'Elküldve' },
  { value: 'accepted', label: 'Elfogadva' },
  { value: 'rejected', label: 'Elutasítva' },
]

const PAYMENT_OPTIONS = [
  { value: 'one_time',      label: 'Egyösszegű fizetés' },
  { value: 'installments',  label: 'Részletfizetés' },
  { value: 'subscription',  label: 'Előfizetés (Havidíj)' },
]

export function OfferForm({ offer, customers, leads, defaultCustomerId, defaultLeadId, defaultItems }: {
  offer?: any
  customers: any[]
  leads: any[]
  defaultCustomerId?: string
  defaultLeadId?: string
  defaultItems?: OfferItem[]
}) {
  const isEditing = !!offer

  const initialItems = offer?.offer_items?.length > 0
    ? offer.offer_items
    : defaultItems?.length
      ? defaultItems
      : [{ description: '', price: 0 }]

  const [items, setItems] = useState<OfferItem[]>(initialItems)
  const [status, setStatus] = useState(offer?.status || 'draft')
  const [targetType, setTargetType] = useState<'customer' | 'lead' | 'new'>(
    offer?.lead_id ? 'lead' : defaultLeadId ? 'lead' : 'customer'
  )
  const [paymentType, setPaymentType] = useState(offer?.payment_type || 'one_time')

  const action = isEditing ? updateOffer.bind(null, offer.id) : createOffer
  const [state, formAction, pending] = useActionState(action, null)

  const addItem = () => setItems([...items, { description: '', price: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof OfferItem, value: string | number) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }

  const totalAmount = items.reduce((sum, item) => sum + Number(item.price || 0), 0)

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))
  const leadOptions = leads.map(l => ({ value: l.id, label: l.name }))

  const statusLabel = STATUS_OPTIONS.find(o => o.value === status)?.label ?? status
  const paymentLabel = PAYMENT_OPTIONS.find(o => o.value === paymentType)?.label ?? paymentType

  return (
    <Card className="max-w-3xl mx-auto w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Ajánlat szerkesztése' : 'Új Ajánlat'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction as (formData: FormData) => void} className="grid gap-8">
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="target_type" value={targetType} />

          {/* Alapadatok */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-white/10 pb-2">Alapadatok</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Kinek szól az ajánlat?</Label>
                <RadioGroup
                  value={targetType}
                  onValueChange={(val: 'customer' | 'lead' | 'new') => setTargetType(val)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="t_customer" />
                    <Label htmlFor="t_customer" className="cursor-pointer">Meglévő Ügyfél</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lead" id="t_lead" />
                    <Label htmlFor="t_lead" className="cursor-pointer">Meglévő Érdeklődő</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="t_new" />
                    <Label htmlFor="t_new" className="cursor-pointer">Új Érdeklődő rögzítése</Label>
                  </div>
                </RadioGroup>

                {targetType === 'customer' && (
                  <ControlledSelect
                    name="customer_id"
                    options={customerOptions}
                    defaultValue={offer?.customer_id || defaultCustomerId || ''}
                    placeholder="Válassz ügyfelet"
                    required
                  />
                )}

                {targetType === 'lead' && (
                  <ControlledSelect
                    name="lead_id"
                    options={leadOptions}
                    defaultValue={offer?.lead_id || defaultLeadId || ''}
                    placeholder="Válassz érdeklődőt"
                    required
                  />
                )}

                {targetType === 'new' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="new_name">Név *</Label>
                      <Input id="new_name" name="new_name" placeholder="pl. Kovács János" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_email">Email *</Label>
                      <Input id="new_email" name="new_email" type="email" placeholder="pl. janos@pelda.hu" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_phone">Telefonszám</Label>
                      <Input id="new_phone" name="new_phone" placeholder="pl. +36 30 123 4567" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Státusz *</Label>
                <Select value={status} onValueChange={v => setStatus(v || 'draft')}>
                  <SelectTrigger>
                    <SelectValue>{statusLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fizetési mód */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-white/10 pb-2">Fizetési konstrukció</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Konstrukció típusa *</Label>
                <input type="hidden" name="payment_type" value={paymentType} />
                <Select value={paymentType} onValueChange={v => setPaymentType(v || 'one_time')}>
                  <SelectTrigger>
                    <SelectValue>{paymentLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {paymentType === 'installments' && (
                <div className="space-y-2">
                  <Label htmlFor="installment_months">Részletek száma (hónap) *</Label>
                  <Input
                    id="installment_months"
                    name="installment_months"
                    type="number"
                    min="1"
                    max="24"
                    defaultValue={offer?.installment_months || 12}
                    required
                  />
                </div>
              )}

              {paymentType === 'subscription' && (
                <div className="space-y-2">
                  <Label htmlFor="subscription_plan_name">Előfizetési csomag neve *</Label>
                  <Input
                    id="subscription_plan_name"
                    name="subscription_plan_name"
                    defaultValue={offer?.subscription_plan_name || ''}
                    placeholder="pl. Karbantartás Alap"
                    required
                  />
                </div>
              )}
            </div>
            {paymentType === 'subscription' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Előfizetésnél a lenti összeg lesz a havi díj.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="subscription_note">Megjegyzés az emailben (opcionális)</Label>
                  <textarea
                    id="subscription_note"
                    name="subscription_note"
                    rows={3}
                    defaultValue={offer?.subscription_note ?? 'Az előfizetés minimum 12 hónapra szól. Tartalmaz 1 óra/hó fejlesztési keretet.'}
                    placeholder="pl. Az előfizetés minimum 12 hónapra szól."
                    className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                  />
                </div>
              </div>
            )}
            {paymentType === 'installments' && (
              <p className="text-sm text-muted-foreground">
                A végösszeg egyenlő arányban kerül elosztásra a megadott hónapokra.
              </p>
            )}
          </div>

          {/* Tételek */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 flex-1">Tételek</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="ml-4">
                <Plus className="h-4 w-4 mr-2" /> Új tétel
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    className="flex-1"
                    placeholder="Tétel megnevezése"
                    value={item.description}
                    onChange={e => updateItem(index, 'description', e.target.value)}
                    required
                  />
                  <div className="relative w-36">
                    <Input
                      type="number"
                      placeholder="Ár"
                      value={item.price}
                      onChange={e => updateItem(index, 'price', e.target.value)}
                      className="pr-8"
                      required
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">Ft</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-500/10 shrink-0"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <div className="text-xl font-bold">
                {paymentType === 'subscription' ? 'Havi díj' : 'Fizetendő'}:{' '}
                <span style={{ color: 'oklch(0.70 0.22 290)' }}>{totalAmount.toLocaleString('hu-HU')} Ft</span>
              </div>
            </div>
          </div>

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end pt-4">
            <Link href="/offers">
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
