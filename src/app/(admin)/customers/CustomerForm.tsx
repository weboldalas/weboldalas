'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCustomer, updateCustomer } from './actions'
import Link from 'next/link'

export function CustomerForm({ customer }: { customer?: any }) {
  const isEditing = !!customer
  const action = isEditing ? updateCustomer.bind(null, customer.id) : createCustomer
  const [state, formAction, pending] = useActionState(action, null)
  const [isCompany, setIsCompany] = useState(customer?.is_company ?? false)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Ügyfél szerkesztése' : 'Új Ügyfél'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCompany(false)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={!isCompany
                ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                : { background: 'oklch(1 0 0 / 0.06)', color: 'oklch(1 0 0 / 0.5)' }}
            >
              Magánszemély
            </button>
            <button
              type="button"
              onClick={() => setIsCompany(true)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={isCompany
                ? { background: 'oklch(0.68 0.22 290)', color: 'white' }
                : { background: 'oklch(1 0 0 / 0.06)', color: 'oklch(1 0 0 / 0.5)' }}
            >
              Céges ügyfél
            </button>
          </div>
          <input type="hidden" name="is_company" value={isCompany ? 'true' : 'false'} />

          {isCompany ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="company_name">Cégnév *</Label>
                <Input id="company_name" name="company_name" defaultValue={customer?.company_name} required={isCompany} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Kapcsolattartó neve</Label>
                  <Input id="name" name="name" defaultValue={customer?.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="position">Beosztás</Label>
                  <Input id="position" name="position" defaultValue={customer?.position} placeholder="Ügyvezető" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={customer?.email} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" defaultValue={customer?.phone} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tax_number">Adószám</Label>
                  <Input id="tax_number" name="tax_number" defaultValue={customer?.tax_number} placeholder="12345678-2-41" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="registration_number">Cégjegyzékszám</Label>
                  <Input id="registration_number" name="registration_number" defaultValue={customer?.registration_number} placeholder="01-09-123456" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Székhely</Label>
                <Input id="address" name="address" defaultValue={customer?.address} placeholder="1234 Budapest, Példa utca 1." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing_address">Számlázási cím (ha eltér)</Label>
                <Input id="billing_address" name="billing_address" defaultValue={customer?.billing_address} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Weboldal</Label>
                <Input id="website" name="website" defaultValue={customer?.website} placeholder="https://example.hu" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Megjegyzés</Label>
                <Input id="notes" name="notes" defaultValue={customer?.notes} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="name">Név *</Label>
                <Input id="name" name="name" defaultValue={customer?.name} required={!isCompany} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={customer?.email} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" defaultValue={customer?.phone} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Cím</Label>
                <Input id="address" name="address" defaultValue={customer?.address} placeholder="1234 Budapest, Példa utca 1." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Megjegyzés</Label>
                <Input id="notes" name="notes" defaultValue={customer?.notes} />
              </div>
            </>
          )}

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Link href="/customers">
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
