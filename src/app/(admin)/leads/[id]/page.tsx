import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, Mail, Building2, Tag, Calendar, ArrowLeft, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeadForm } from '../LeadForm'
import { DeleteLeadButton } from './DeleteLeadButton'
import { CallLogForm } from './CallLogForm'
import { PIPELINE_STAGES } from '../pipeline'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('leads').select('name').eq('id', id).single()
  return { title: `${data?.name ?? 'Lead'} | Weboldalas Admin` }
}

const TYPE_LABELS: Record<string, string> = {
  call: '📞 Telefonhívás',
  email: '✉️ Email',
  meeting: '🤝 Személyes',
  note: '📝 Megjegyzés',
}

const OUTCOME_LABELS: Record<string, { label: string, color: string }> = {
  elerte:        { label: 'Elértem',              color: 'oklch(0.68 0.18 145)' },
  nem_vette_fel: { label: 'Nem vette fel',        color: 'oklch(0.62 0.22 25)'  },
  visszahiv:     { label: 'Visszahív',            color: 'oklch(0.70 0.18 60)'  },
  nem_erdekli:   { label: 'Nem érdekli',          color: 'oklch(0.60 0.18 25)'  },
  kesobb:        { label: 'Később érdeklődik',    color: 'oklch(0.65 0.18 280)' },
  egyeb:         { label: 'Egyéb',                color: 'oklch(0.60 0.05 270)' },
}

const PRIORITY_LABELS: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  low:    { label: 'Alacsony', variant: 'secondary' },
  medium: { label: 'Normál',   variant: 'outline'   },
  high:   { label: 'Magas',    variant: 'default'   },
  urgent: { label: 'Sürgős',   variant: 'destructive'},
}


export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: lead, error },
    { data: notes },
    { data: tasks },
    { data: offers },
  ] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('lead_notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').eq('lead_id', id).order('due_date', { ascending: true, nullsFirst: false }),
    supabase.from('offers').select('*, offer_items(*)').eq('lead_id', id).order('created_at', { ascending: false }),
  ])

  if (error || !lead) notFound()

  const stage = PIPELINE_STAGES.find(s => s.id === lead.status)
  const openTasks = tasks?.filter(t => !['done', 'canceled'].includes(t.status)) ?? []
  const isOverdue = lead.next_call_date && new Date(lead.next_call_date) < new Date()
    && !['elfogadott', 'elutasitott'].includes(lead.status)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="icon" className="mt-1 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-white">{lead.name}</h1>
              {stage && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40` }}>
                  {stage.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {lead.industry && (
                <span className="flex items-center gap-1 text-sm text-white/50">
                  <Building2 className="h-3.5 w-3.5" /> {lead.industry}
                </span>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                  <Phone className="h-3.5 w-3.5" /> {lead.phone}
                </a>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5" /> {lead.email}
                </a>
              )}
              {lead.interest_type && (
                <span className="flex items-center gap-1 text-sm text-white/50">
                  <Tag className="h-3.5 w-3.5" /> {lead.interest_type}
                </span>
              )}
            </div>
            {lead.next_call_date && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                style={{
                  background: isOverdue ? 'oklch(0.62 0.22 25 / 0.15)' : 'oklch(1 0 0 / 0.06)',
                  color: isOverdue ? 'oklch(0.75 0.20 25)' : 'oklch(1 0 0 / 0.50)',
                  border: `1px solid ${isOverdue ? 'oklch(0.62 0.22 25 / 0.30)' : 'oklch(1 0 0 / 0.08)'}`,
                }}>
                <Calendar className="h-3 w-3" />
                {isOverdue ? '⚠️ Lejárt: ' : 'Visszahívás: '}
                {new Date(lead.next_call_date).toLocaleString('hu-HU', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/offers/new?lead_id=${id}${lead.interest_type ? `&interest_type=${encodeURIComponent(lead.interest_type)}` : ''}`}>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Ajánlat
            </Button>
          </Link>
          <DeleteLeadButton id={lead.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column: call log + tasks */}
        <div className="flex flex-col gap-6">

          {/* Call log input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hívásnapló bejegyzés</CardTitle>
            </CardHeader>
            <CardContent>
              <CallLogForm leadId={lead.id} />
            </CardContent>
          </Card>

          {/* Call log timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Előzmények ({notes?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {notes && notes.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {notes.map((note, i) => {
                    const outcome = note.outcome ? OUTCOME_LABELS[note.outcome] : null
                    return (
                      <div key={note.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                            style={{ background: 'oklch(1 0 0 / 0.06)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
                            {TYPE_LABELS[note.type]?.charAt(0) ?? '📝'}
                          </div>
                          {i < notes.length - 1 && (
                            <div className="w-px flex-1 mt-2" style={{ background: 'oklch(1 0 0 / 0.08)' }} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-medium text-white/60">{TYPE_LABELS[note.type] ?? note.type}</span>
                            {outcome && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: `${outcome.color}20`, color: outcome.color }}>
                                {outcome.label}
                              </span>
                            )}
                            <span className="text-xs text-white/30 ml-auto">
                              {new Date(note.created_at).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed">{note.body}</p>
                          {note.next_action_date && (
                            <div className="mt-1 text-xs text-white/40 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Következő visszahívás: {new Date(note.next_action_date).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-6">Még nincs bejegyzés. Add hozzá az első hívás részleteit!</p>
              )}
            </CardContent>
          </Card>

          {/* Open tasks */}
          {openTasks.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Nyitott feladatok ({openTasks.length})</CardTitle>
                <Link href={`/tasks/new?lead_id=${lead.id}`}>
                  <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Feladat</Button>
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {openTasks.map(task => {
                  const overdue = task.due_date && new Date(task.due_date) < new Date()
                  return (
                    <div key={task.id} className="flex items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-white/80">{task.title}</div>
                        {task.due_date && (
                          <div className="text-xs mt-0.5" style={{ color: overdue ? 'oklch(0.75 0.20 25)' : 'oklch(1 0 0 / 0.40)' }}>
                            {overdue ? '⚠️ ' : ''}{new Date(task.due_date).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={PRIORITY_LABELS[task.priority]?.variant ?? 'outline'} className="text-xs">
                          {PRIORITY_LABELS[task.priority]?.label ?? task.priority}
                        </Badge>
                        <Link href={`/tasks/${task.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Szerk.</Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Offers */}
          {offers && offers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ajánlatok ({offers.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {offers.map(offer => (
                  <Link key={offer.id} href={`/offers/${offer.id}`} className="flex items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                    <div>
                      <div className="text-sm font-medium text-white/80">
                        {Number(offer.total_amount).toLocaleString('hu-HU')} Ft
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">
                        {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                      </div>
                    </div>
                    <Badge variant={offer.status === 'accepted' ? 'default' : offer.status === 'rejected' ? 'destructive' : 'outline'} className="text-xs">
                      {offer.status === 'draft' ? 'Tervezet' : offer.status === 'sent' ? 'Kiküldve' : offer.status === 'accepted' ? 'Elfogadva' : offer.status === 'rejected' ? 'Elutasítva' : offer.status}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: edit form */}
        <div>
          <LeadForm lead={lead} />
        </div>
      </div>
    </div>
  )
}
