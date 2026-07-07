import Link from 'next/link'
import { Plus, Mail, Phone, ArrowRight } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteCustomerIconButton } from './DeleteCustomerIconButton'

export const metadata = {
  title: 'Ügyfelek | Weboldalas Admin',
}

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ügyfelek</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Kezeld a meglévő ügyfeleket és kapcsolataikat.
          </p>
        </div>
        <Link href="/customers/new">
          <Button size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Ügyfél</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Regisztrálva</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email || '-'}</TableCell>
                <TableCell>{customer.phone || '-'}</TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString('hu-HU')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">Megtekintés</Button>
                    </Link>
                    <DeleteCustomerIconButton id={customer.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!customers || customers.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nincs megjeleníthető ügyfél.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobil + Tablet: Kártyák */}
      <div className="lg:hidden flex flex-col gap-3">
        {customers?.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`} className="block">
            <Card className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer border-white/10" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate mb-2">{customer.name}</div>
                    <div className="flex flex-col gap-1 text-sm text-white/50">
                      {customer.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 shrink-0" /> {customer.phone}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-white/30 mt-2">
                      Regisztrálva: {new Date(customer.created_at).toLocaleDateString('hu-HU')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <DeleteCustomerIconButton id={customer.id} />
                    <ArrowRight className="h-4 w-4 text-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!customers || customers.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p className="text-lg mb-2">Nincs megjeleníthető ügyfél.</p>
            <Link href="/customers/new">
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Új Ügyfél létrehozása
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
