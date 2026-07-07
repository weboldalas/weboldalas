import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  Phone, AlertTriangle, Users, TrendingUp,
  CheckSquare, Clock, Zap, ArrowRight,
} from 'lucide-react'
import { PIPELINE_STAGES } from '../leads/pipeline'
import { PhoneLink } from './PhoneLink'

export const metadata = {
  title: 'Dashboard | Weboldalas Admin',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const todayStart = now.toISOString().split('T')[0] + 'T00:00:00Z'
  const todayEnd   = now.toISOString().split('T')[0] + 'T23:59:59Z'
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { data: leads },
    { data: activeSubscriptions },
    { data: monthPayments },
    { data: openTasks },
    { data: recentNotes },
    { count: urgentTasks },
  ] = await Promise.all([
    supabase.from('leads').select('id, name, status, phone, next_call_date, industry, interest_type'),
    supabase.from('subscriptions').select('monthly_fee, currency').eq('status', 'active'),
    supabase.from('payments').select('amount')
      .gte('due_date', monthStart).lte('due_date', monthEnd)
      .neq('status', 'cancelled'),
    supabase.from('tasks').select('id, title, due_date, priority, status, lead_id, customer_id')
      .in('status', ['todo', 'in_progress', 'waiting'])
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(5),
    supabase.from('lead_notes').select('id, body, type, outcome, created_at, lead_id, leads(name)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('tasks').select('*', { count: 'exact', head: true })
      .eq('priority', 'urgent').in('status', ['todo', 'in_progress', 'waiting']),
  ])

  // Pipeline counts
  const pipelineCounts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = leads?.filter(l => l.status === stage.id).length ?? 0
    return acc
  }, {} as Record<string, number>)

  // Today's callbacks
  const todayCallbacks = leads?.filter(l => {
    if (!l.next_call_date) return false
    const d = new Date(l.next_call_date)
    return d >= new Date(todayStart) && d <= new Date(todayEnd)
  }) ?? []

  // Overdue callbacks (nem nyert/elutasított)
  const overdueCallbacks = leads?.filter(l => {
    if (!l.next_call_date) return false
    return new Date(l.next_call_date) < now
      && !['elfogadott', 'elutasitott'].includes(l.status)
      && new Date(l.next_call_date) < new Date(todayStart)
  }) ?? []

  const mrr = activeSubscriptions?.reduce((sum, s) => sum + Number(s.monthly_fee), 0) ?? 0
  const projectRevenue = monthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0
  const expectedRevenue = mrr + projectRevenue
  const monthName = now.toLocaleDateString('hu-HU', { month: 'long' })

  const OUTCOME_LABELS: Record<string, string> = {
    elerte: '✅ Elértem', nem_vette_fel: '📵 Nem vette fel',
    visszahiv: '🔄 Visszahív', nem_erdekli: '❌ Nem érdekli',
    kesobb: '⏳ Később', egyeb: '📝 Egyéb',
  }
  const TYPE_LABELS: Record<string, string> = {
    call: '📞', email: '✉️', meeting: '🤝', note: '📝',
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-white/40 mt-1 text-sm">
          {now.toLocaleDateString('hu-HU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* === ALERTS === */}
      {(overdueCallbacks.length > 0 || (urgentTasks ?? 0) > 0) && (
        <div className="flex flex-col gap-2">
          {overdueCallbacks.length > 0 && (
            <Link href="/leads">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
                <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: 'oklch(0.75 0.20 25)' }} />
                <span className="text-sm font-medium truncate min-w-0" style={{ color: 'oklch(0.75 0.20 25)' }}>
                  {overdueCallbacks.length} lejárt visszahívás <span className="hidden sm:inline">— {overdueCallbacks.slice(0, 3).map(l => l.name).join(', ')}{overdueCallbacks.length > 3 ? ` +${overdueCallbacks.length - 3}` : ''}</span>
                </span>
                <ArrowRight className="h-4 w-4 ml-auto shrink-0" style={{ color: 'oklch(0.75 0.20 25)' }} />
              </div>
            </Link>
          )}
          {(urgentTasks ?? 0) > 0 && (
            <Link href="/tasks">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: 'oklch(0.70 0.20 40 / 0.12)', border: '1px solid oklch(0.70 0.20 40 / 0.25)' }}>
                <Zap className="h-4 w-4 shrink-0" style={{ color: 'oklch(0.75 0.18 40)' }} />
                <span className="text-sm font-medium truncate min-w-0" style={{ color: 'oklch(0.75 0.18 40)' }}>
                  {urgentTasks} sürgős feladat vár
                </span>
                <ArrowRight className="h-4 w-4 ml-auto shrink-0" style={{ color: 'oklch(0.75 0.18 40)' }} />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* === MAI VISSZAHÍVÁSOK === */}
      {todayCallbacks.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> Mai visszahívások ({todayCallbacks.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {todayCallbacks.map(lead => (
              <Link key={lead.id} href={`/leads/${lead.id}`}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 hover:opacity-80 transition-opacity"
                  style={{ background: 'oklch(0.68 0.18 145 / 0.10)', border: '1px solid oklch(0.68 0.18 145 / 0.25)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: 'oklch(0.68 0.18 145 / 0.20)', color: 'oklch(0.75 0.18 145)' }}>
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">{lead.name}</div>
                    <div className="text-xs text-white/40 truncate">
                      {lead.interest_type || lead.industry || '—'} · {new Date(lead.next_call_date!).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {lead.phone && <PhoneLink phone={lead.phone} />}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* === PIPELINE KÁRTYÁK === */}
      <div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Users className="h-3.5 w-3.5" /> Értékesítési pipeline
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {PIPELINE_STAGES.map(stage => {
            const count = pipelineCounts[stage.id] ?? 0
            return (
              <Link key={stage.id} href="/leads">
                <Card className="hover:-translate-y-0.5 transition-transform cursor-pointer"
                  style={{ background: stage.bg, border: `1px solid ${stage.color}25` }}>
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium" style={{ color: stage.color }}>
                      {stage.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-2xl font-bold text-white">{count}</div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* === VÁRHATÓ BEVÉTEL === */}
      <div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" /> Pénzügyek
        </h2>
        <div className="rounded-2xl p-5"
          style={{ background: 'oklch(0.68 0.18 145 / 0.07)', border: '1px solid oklch(0.68 0.18 145 / 0.20)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-white/50 mb-1">Várható bevétel — {monthName}</div>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight truncate">{expectedRevenue.toLocaleString('hu-HU')} Ft</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-3 text-xs text-white/35">
                <Link href="/subscriptions" className="hover:text-white/60 transition-colors">
                  MRR: {mrr.toLocaleString('hu-HU')} Ft ({activeSubscriptions?.length ?? 0} előfizetés)
                </Link>
                {projectRevenue > 0 && (
                  <>
                    <span className="hidden sm:inline-block text-white/15">·</span>
                    <Link href="/payments" className="hover:text-white/60 transition-colors">
                      Projektek: {projectRevenue.toLocaleString('hu-HU')} Ft
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-2xl p-3 shrink-0" style={{ background: 'oklch(0.68 0.18 145 / 0.15)' }}>
              <TrendingUp className="h-6 w-6" style={{ color: 'oklch(0.75 0.18 145)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* === ALSÓ SOR: Feladatok + Hívásnapló === */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Nyitott feladatok */}
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><CheckSquare className="h-3.5 w-3.5" /> Soron következő feladatok</span>
            <Link href="/tasks" className="text-white/30 hover:text-white/60 transition-colors normal-case tracking-normal font-normal flex items-center gap-1">
              Mind <ArrowRight className="h-3 w-3" />
            </Link>
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
            {openTasks && openTasks.length > 0 ? openTasks.map((task, i) => {
              const isOverdue = task.due_date && new Date(task.due_date) < now
              return (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors ${i < (openTasks.length - 1) ? 'border-b border-white/5' : ''}`}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: task.priority === 'urgent' ? 'oklch(0.65 0.22 25)' : task.priority === 'high' ? 'oklch(0.70 0.18 40)' : 'oklch(0.60 0.05 270)' }} />
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-sm text-white/80 truncate">{task.title}</div>
                    </div>
                    {task.due_date && (
                      <div className="text-xs shrink-0 flex items-center gap-1"
                        style={{ color: isOverdue ? 'oklch(0.72 0.20 25)' : 'oklch(1 0 0 / 0.35)' }}>
                        <Clock className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                </Link>
              )
            }) : (
              <div className="px-4 py-8 text-center text-sm text-white/30">Nincs nyitott feladat 🎉</div>
            )}
          </div>
        </div>

        {/* Legutóbbi hívásnapló */}
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Legutóbbi bejegyzések</span>
            <Link href="/leads" className="text-white/30 hover:text-white/60 transition-colors normal-case tracking-normal font-normal flex items-center gap-1">
              Leadek <ArrowRight className="h-3 w-3" />
            </Link>
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
            {recentNotes && recentNotes.length > 0 ? recentNotes.map((note: any, i) => (
              <Link key={note.id} href={`/leads/${note.lead_id}`}>
                <div className={`flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors ${i < (recentNotes.length - 1) ? 'border-b border-white/5' : ''}`}>
                  <span className="text-base shrink-0 mt-0.5">{TYPE_LABELS[note.type] ?? '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-white/70 truncate">{note.leads?.name}</span>
                      {note.outcome && (
                        <span className="text-xs text-white/35 shrink-0">{OUTCOME_LABELS[note.outcome]?.split(' ')[0]}</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{note.body}</p>
                  </div>
                  <span className="text-xs text-white/25 shrink-0">
                    {new Date(note.created_at).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            )) : (
              <div className="px-4 py-8 text-center text-sm text-white/30">Még nincsenek bejegyzések</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
