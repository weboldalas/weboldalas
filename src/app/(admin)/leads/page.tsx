import Link from 'next/link'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { Plus, Phone, Mail, Calendar, ArrowRight } from 'lucide-react'

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
import { convertLeadToCustomer } from '../customers/actions'
import { DeleteLeadIconButton } from './DeleteLeadIconButton'

export const metadata = {
  title: 'Érdeklődők | Weboldalas Admin',
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Új', variant: 'default' },
  contacted: { label: 'Kapcsolatfelvétel', variant: 'secondary' },
  meeting: { label: 'Tárgyalás', variant: 'outline' },
  won: { label: 'Nyert', variant: 'default' },
  lost: { label: 'Elvesztett', variant: 'destructive' },
}

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Érdeklődők</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Kezeld a potenciális ügyfeleket és érdeklődéseket.
          </p>
        </div>
        <Link href="/leads/new">
          <Button size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Érdeklődő</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      {/* Desktop: Table nézet */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Elérhetőség</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead>Érdeklődés</TableHead>
              <TableHead>Következő lépés</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{lead.email}</div>
                  <div className="text-sm text-muted-foreground">{lead.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[lead.status]?.variant || 'default'}>
                    {statusMap[lead.status]?.label || lead.status}
                  </Badge>
                </TableCell>
                <TableCell>{lead.interest_type || '-'}</TableCell>
                <TableCell>
                  {lead.next_call_date
                    ? format(new Date(lead.next_call_date), 'PPP', { locale: hu })
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {lead.status !== 'won' && lead.status !== 'lost' && (
                      <form action={convertLeadToCustomer.bind(null, lead.id)}>
                        <Button variant="outline" size="sm" type="submit" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 text-xs">
                          Ügyféllé
                        </Button>
                      </form>
                    )}
                    <Link href={`/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm">Szerkesztés</Button>
                    </Link>
                    <DeleteLeadIconButton id={lead.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!leads || leads.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nincs megjeleníthető érdeklődő.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobil + Tablet: Kártyás nézet */}
      <div className="lg:hidden flex flex-col gap-3">
        {leads?.map((lead) => (
          <Link key={lead.id} href={`/leads/${lead.id}`} className="block">
            <Card className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer border-white/10" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white truncate">{lead.name}</span>
                      <Badge variant={statusMap[lead.status]?.variant || 'default'} className="text-xs shrink-0">
                        {statusMap[lead.status]?.label || lead.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-white/50">
                      {lead.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 shrink-0" /> {lead.phone}
                        </div>
                      )}
                      {lead.next_call_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 shrink-0" />
                          {format(new Date(lead.next_call_date), 'PPP', { locale: hu })}
                        </div>
                      )}
                    </div>
                    {lead.interest_type && (
                      <div className="mt-2 text-xs text-white/30">{lead.interest_type}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <DeleteLeadIconButton id={lead.id} />
                    <ArrowRight className="h-4 w-4 text-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!leads || leads.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p className="text-lg mb-2">Nincs megjeleníthető érdeklődő.</p>
            <Link href="/leads/new">
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Új Érdeklődő létrehozása
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
