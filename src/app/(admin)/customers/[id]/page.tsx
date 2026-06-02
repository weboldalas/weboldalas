import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Phone, Mail, ArrowLeft, Plus, RefreshCw, CreditCard, FileText, CheckSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '../CustomerForm'
import { DeleteCustomerButton } from './DeleteCustomerButton'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('customers').select('name').eq('id', id).single()
  return { title: `${data?.name ?? 'Ügyfél'} | Weboldalas Admin` }
}

const OFFER_STATUS: Record<string, { label: string; color: string }> = {
  draft:    { label: 'Tervezet',   color: 'oklch(0.60 0.05 270)' },
  sent:     { label: 'Kiküldve',   color: 'oklch(0.65 0.18 280)' },
  accepted: { label: 'Elfogadva',  color: 'oklch(0.68 0.18 145)' },
  rejected: { label: 'Elutasítva', color: 'oklch(0.62 0.22 25)'  },
}

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Függőben',   color: 'oklch(0.65 0.18 280)' },
  completed: { label: 'Teljesítve', color: 'oklch(0.68 0.18 145)' },
  overdue:   { label: 'Lejárt',     color: 'oklch(0.62 0.22 25)'  },
  failed:    { label: 'Sikertelen', color: 'oklch(0.62 0.22 25)'  },
  canceled:  { label: 'Törölve',    color: 'oklch(0.55 0.05 270)' },
}

const SUB_STATUS: Record<string, { label: string; color: string }> = {
  active:   { label: 'Aktív',         color: 'oklch(0.68 0.18 145)' },
  trial:    { label: 'Próbaidőszak',  color: 'oklch(0.70 0.18 60)'  },
  past_due: { label: 'Hátralékos',    color: 'oklch(0.62 0.22 25)'  },
  canceled: { label: 'Lemondva',      color: 'oklch(0.55 0.05 270)' },
  expired:  { label: 'Lejárt',        color: 'oklch(0.55 0.05 270)' },
}

const TASK_STATUS: Record<string, string> = {
  todo: 'Teendő', in_progress: 'Folyamatban', waiting: 'Várakozik', done: 'Kész', canceled: 'Törölve',
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: customer, error },
    { data: offers },
    { data: subscriptions },
    { data: payments },
    { data: tasks },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase.from('offers').select('*, offer_items(*)').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    supabase.from('payments').select('*').eq('customer_id', id).order('due_date', { ascending: false }),
    supabase.from('tasks').select('*').eq('customer_id', id).order('due_date', { ascending: true, nullsFirst: false }),
  ])

  if (error || !customer) notFound()

  const activeSubs = subscriptions?.filter(s => s.status === 'active') ?? []
  const mrr = activeSubs.reduce((sum, s) => sum + Number(s.monthly_fee), 0)
  const overduePayments = payments?.filter(p => p.status === 'overdue') ?? []
  const openTasks = tasks?.filter(t => !['done', 'canceled'].includes(t.status)) ?? []

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="icon" className="mt-1 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{customer.name}</h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </a>
              )}
            </div>
            {/* Quick stats */}
            <div className="flex gap-3 mt-3 flex-wrap">
              {mrr > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'oklch(0.68 0.18 145 / 0.12)', color: 'oklch(0.75 0.18 145)', border: '1px solid oklch(0.68 0.18 145 / 0.25)' }}>
                  MRR: {mrr.toLocaleString('hu-HU')} Ft/hó
                </span>
              )}
              {overduePayments.length > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.75 0.20 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
                  ⚠️ {overduePayments.reduce((s, p) => s + Number(p.amount), 0).toLocaleString('hu-HU')} Ft lejárt
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/offers/new?customer_id=${id}`}>
            <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Ajánlat</Button>
          </Link>
          <DeleteCustomerButton id={customer.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: business data */}
        <div className="flex flex-col gap-5">

          {/* Előfizetések */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-400" /> Előfizetések
              </CardTitle>
              <Link href={`/subscriptions/new?customer_id=${id}`}>
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Új</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {subscriptions && subscriptions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {subscriptions.map(sub => {
                    const st = SUB_STATUS[sub.status] ?? { label: sub.status, color: 'oklch(0.60 0.05 270)' }
                    return (
                      <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
                        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                          <div>
                            <div className="text-sm font-medium text-white/80">{sub.plan_name}</div>
                            <div className="text-xs text-white/40 mt-0.5">
                              {Number(sub.monthly_fee).toLocaleString('hu-HU')} {sub.currency}/hó
                              {sub.next_billing_date && ` · Köv. fizetés: ${new Date(sub.next_billing_date).toLocaleDateString('hu-HU')}`}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                            style={{ background: `${st.color}20`, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-5">Nincs előfizetés</p>
              )}
            </CardContent>
          </Card>

          {/* Befizetések */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-violet-400" /> Befizetések
              </CardTitle>
              <Link href={`/payments/new?customer_id=${id}`}>
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Új</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {payments && payments.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {payments.map(p => {
                    const ps = PAYMENT_STATUS[p.status] ?? { label: p.status, color: 'oklch(0.60 0.05 270)' }
                    const isOverdue = p.status === 'overdue'
                    return (
                      <Link key={p.id} href={`/payments/${p.id}`}>
                        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity"
                          style={isOverdue ? { background: 'oklch(0.62 0.22 25 / 0.06)', borderRadius: '8px', padding: '8px' } : {}}>
                          <div>
                            <div className="text-sm font-medium text-white/80">
                              {Number(p.amount).toLocaleString('hu-HU')} {p.currency ?? 'Ft'}
                            </div>
                            <div className="text-xs text-white/40 mt-0.5">
                              {p.due_date ? `Esedékes: ${new Date(p.due_date).toLocaleDateString('hu-HU')}` : '—'}
                              {p.payment_date && ` · Fizetve: ${new Date(p.payment_date).toLocaleDateString('hu-HU')}`}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                            style={{ background: `${ps.color}20`, color: ps.color }}>
                            {isOverdue ? '⚠️ ' : ''}{ps.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-5">Nincs befizetés</p>
              )}
            </CardContent>
          </Card>

          {/* Ajánlatok */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" /> Ajánlatok
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offers && offers.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {offers.map(offer => {
                    const os = OFFER_STATUS[offer.status] ?? { label: offer.status, color: 'oklch(0.60 0.05 270)' }
                    return (
                      <Link key={offer.id} href={`/offers/${offer.id}`}>
                        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                          <div>
                            <div className="text-sm font-medium text-white/80">
                              {Number(offer.total_amount).toLocaleString('hu-HU')} Ft
                            </div>
                            <div className="text-xs text-white/40 mt-0.5">
                              {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                              {offer.offer_items?.length ? ` · ${offer.offer_items.length} tétel` : ''}
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                            style={{ background: `${os.color}20`, color: os.color }}>
                            {os.label}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-5">Nincs ajánlat</p>
              )}
            </CardContent>
          </Card>

          {/* Feladatok */}
          {tasks && tasks.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-400" /> Feladatok ({openTasks.length} nyitott)
                </CardTitle>
                <Link href={`/tasks/new?customer_id=${id}`}>
                  <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Új</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  {tasks.map(task => {
                    const isDone = ['done', 'canceled'].includes(task.status)
                    const isOverdue = task.due_date && !isDone && new Date(task.due_date) < new Date()
                    return (
                      <Link key={task.id} href={`/tasks/${task.id}`}>
                        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                          <div className="min-w-0">
                            <div className={`text-sm ${isDone ? 'line-through text-white/30' : 'text-white/80'} truncate`}>
                              {task.title}
                            </div>
                            {task.due_date && (
                              <div className="text-xs mt-0.5"
                                style={{ color: isOverdue ? 'oklch(0.72 0.20 25)' : 'oklch(1 0 0 / 0.35)' }}>
                                {isOverdue ? '⚠️ ' : ''}{new Date(task.due_date).toLocaleDateString('hu-HU')}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-white/40 shrink-0">{TASK_STATUS[task.status] ?? task.status}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: edit form */}
        <div>
          <CustomerForm customer={customer} />
        </div>
      </div>
    </div>
  )
}
