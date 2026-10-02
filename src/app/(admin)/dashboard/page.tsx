import Link from 'next/link'
import { Phone, Users, CheckSquare, Clock, ArrowRight, Plus, UserPlus, FilePlus, Briefcase, CircleCheck, AlertTriangle, MessageSquare, Mail, CalendarDays, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { PIPELINE_STAGES } from '../leads/pipeline'
import { RevenueChart } from './RevenueChart'

export const metadata = { title: 'Áttekintés | Weboldalas Admin' }
const TIME_ZONE = 'Europe/Budapest'
const dayFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: TIME_ZONE })
function dayKey(value: Date | string) { return dayFormatter.format(new Date(value)) }
function monthBoundary(year: number, month: number) {
  const date = new Date(Date.UTC(year, month, 1))
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value.replace('GMT', '') || '+00:00'
  return `${date.toISOString().slice(0, 10)}T00:00:00${offset}`
}
function shortDate(value: string) { return new Date(value).toLocaleDateString('hu-HU', { timeZone: TIME_ZONE, month: 'short', day: 'numeric' }) }
const priorityLabels: Record<string, string> = { urgent: 'Sürgős', high: 'Magas', medium: 'Normál', low: 'Alacsony' }
const taskStatusLabels: Record<string, string> = { todo: 'Teendő', in_progress: 'Folyamatban', waiting: 'Várakozik' }
const outcomeLabels: Record<string, string> = { elerte: 'Elértem', nem_vette_fel: 'Nem vette fel', visszahiv: 'Visszahív', nem_erdekli: 'Nem érdekli', kesobb: 'Később', egyeb: 'Egyéb' }
const noteIcons = { call: Phone, email: Mail, meeting: CalendarDays, note: MessageSquare }
const pipelineColors = ['#9cabc6', '#b2a7ed', '#e7c481', '#e5a17e', '#86c9b0', '#dc939e']

export default async function DashboardPage() {
  const supabase = await createClient()
  const now = new Date()
  const today = dayKey(now)
  const monthStart = monthBoundary(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1)
  const monthEnd = monthBoundary(Number(today.slice(0, 4)), Number(today.slice(5, 7)))
  const twoYearsAgo = `${Number(today.slice(0, 4)) - 2}-01-01T00:00:00Z`

  const [leadResult, subscriptionResult, paymentResult, taskResult, noteResult, urgentResult, chartResult] = await Promise.all([
    supabase.from('leads').select('id, name, status, phone, next_call_date, industry, interest_type'),
    supabase.from('subscriptions').select('monthly_fee, currency').eq('status', 'active'),
    supabase.from('payments').select('amount, currency').gte('due_date', monthStart).lt('due_date', monthEnd).neq('status', 'cancelled'),
    supabase.from('tasks').select('id, title, due_date, priority, status', { count: 'exact' }).in('status', ['todo', 'in_progress', 'waiting']).order('due_date', { ascending: true, nullsFirst: false }).limit(5),
    supabase.from('lead_notes').select('id, body, type, outcome, created_at, lead_id, leads(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('priority', 'urgent').in('status', ['todo', 'in_progress', 'waiting']),
    supabase.from('payments').select('amount, currency, payment_date, due_date, status').neq('status', 'cancelled').or(`payment_date.gte.${twoYearsAgo},due_date.gte.${twoYearsAgo}`),
  ])
  const leads = leadResult.data ?? []
  const activeLeads = leads.filter(lead => !['elfogadott', 'elutasitott'].includes(lead.status))
  const callbacks = activeLeads.filter(lead => lead.next_call_date && dayKey(lead.next_call_date) <= today).sort((a, b) => new Date(a.next_call_date!).getTime() - new Date(b.next_call_date!).getTime())
  const todaysCallbacks = callbacks.filter(lead => dayKey(lead.next_call_date!) === today)
  const overdueCallbacks = callbacks.length - todaysCallbacks.length
  const tasks = taskResult.data ?? []
  const notes = noteResult.data ?? []
  const urgentTasks = urgentResult.count ?? 0
  const subscriptions = subscriptionResult.data ?? []
  const mrr = subscriptions.filter(subscription => subscription.currency === 'HUF').reduce((sum, subscription) => sum + Number(subscription.monthly_fee), 0)
  const projectRevenue = (paymentResult.data ?? []).filter(payment => payment.currency === 'HUF').reduce((sum, payment) => sum + Number(payment.amount), 0)
  const nonHuf = subscriptions.some(subscription => subscription.currency !== 'HUF') || (chartResult.data ?? []).some(payment => payment.currency !== 'HUF')
  const hasErrors = [leadResult, subscriptionResult, paymentResult, taskResult, noteResult, urgentResult, chartResult].some(result => result.error)
  const quickActions = [
    { href: '/leads/new', title: 'Új érdeklődő', description: 'Kapcsolat rögzítése', icon: UserPlus },
    { href: '/tasks/new', title: 'Új feladat', description: 'Teendő felvétele', icon: Plus },
    { href: '/offers/new', title: 'Új ajánlat', description: 'Árajánlat készítése', icon: FilePlus },
    { href: '/customers/new', title: 'Új ügyfél', description: 'Ügyfél felvétele', icon: Briefcase },
  ]

  return <div className="dashboard">
    <div className="dashboard-heading"><div><p className="dashboard-eyebrow">{now.toLocaleDateString('hu-HU', { timeZone: TIME_ZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p><h1>Minden fontos, egy helyen.</h1><p className="dashboard-heading-description">Nézd át a teendőket, vedd fel a kapcsolatot az érdeklődőkkel, és haladj tovább.</p></div><Link href="/tasks/new" className="admin-action"><Plus size={16} />Új feladat</Link></div>
    {hasErrors && <div className="dashboard-data-warning" role="alert"><AlertTriangle size={18} /><span>Néhány adatot nem sikerült betölteni. Az érintett blokkoknál jelezzük a hibát. Frissítsd az oldalt az újrapróbáláshoz.</span></div>}
    <div className="dashboard-stats">
      <Link href="/tasks" className="dashboard-stat"><div className="dashboard-stat-top"><span>Nyitott feladatok</span><CheckSquare size={18} /></div><strong>{taskResult.error ? '—' : taskResult.count ?? 0}</strong><small>Teendő, folyamatban vagy várakozik</small></Link>
      <Link href="/leads" className="dashboard-stat"><div className="dashboard-stat-top"><span>Mai visszahívások</span><Phone size={18} /></div><strong>{leadResult.error ? '—' : todaysCallbacks.length}</strong><small>{overdueCallbacks > 0 ? `További ${overdueCallbacks} elmaradt visszahívás` : 'Az aktív érdeklődők közül'}</small></Link>
      <Link href="/leads" className="dashboard-stat"><div className="dashboard-stat-top"><span>Aktív érdeklődők</span><Users size={18} /></div><strong>{leadResult.error ? '—' : activeLeads.length}</strong><small>{leadResult.error ? 'Nem sikerült betölteni' : `${leads.length} érdeklődő összesen`}</small></Link>
      <Link href="/tasks" className={`dashboard-stat ${urgentTasks > 0 ? 'is-urgent' : ''}`}><div className="dashboard-stat-top"><span>Sürgős feladatok</span><AlertTriangle size={18} /></div><strong>{urgentResult.error ? '—' : urgentTasks}</strong><small>{urgentResult.error ? 'Nem sikerült betölteni' : urgentTasks ? 'Ezekkel érdemes kezdeni' : 'Nincs sürgős nyitott teendő'}</small></Link>
    </div>
    <div className="dashboard-main-grid">
      <section className="dashboard-panel" aria-labelledby="dashboard-tasks-title"><div className="dashboard-panel-header"><div><h2 id="dashboard-tasks-title"><CheckSquare size={17} />Soron következő feladatok</h2><p>A legközelebbi határidők, az elmaradásokkal együtt.</p></div><Link href="/tasks">Összes feladat <ArrowRight size={14} /></Link></div>
        {taskResult.error ? <div className="dashboard-empty"><AlertTriangle size={20} /><div><strong>A feladatok most nem érhetők el.</strong><p>Frissítsd az oldalt az újrapróbáláshoz.</p></div></div> : tasks.length ? tasks.map(task => {
          const overdue = task.due_date && dayKey(task.due_date) < today
          const isToday = task.due_date && dayKey(task.due_date) === today
          return <Link href={`/tasks/${task.id}`} key={task.id} className="dashboard-list-row"><span className={`dashboard-task-icon ${overdue ? 'is-overdue' : ''}`}>{overdue ? <Clock size={15} /> : <CheckSquare size={15} />}</span><div className="dashboard-list-main"><strong>{task.title}</strong><p>{taskStatusLabels[task.status] ?? task.status}</p></div><div className={`dashboard-row-date ${overdue ? 'is-overdue' : ''}`}><span className={`dashboard-pill ${task.priority === 'urgent' ? 'is-urgent' : task.priority === 'high' ? 'is-high' : ''}`}>{priorityLabels[task.priority] ?? task.priority}</span><span>{task.due_date ? `${overdue ? 'Elmaradt · ' : isToday ? 'Ma · ' : ''}${shortDate(task.due_date)}` : 'Nincs határidő'}</span></div></Link>
        }) : <div className="dashboard-empty"><CircleCheck size={22} /><div><strong>Nincs nyitott feladat.</strong><p>Ha új teendő érkezik, itt fogod látni.</p><Link href="/tasks/new">Új feladat létrehozása →</Link></div></div>}
      </section>
      <section className="dashboard-panel" aria-labelledby="dashboard-calls-title"><div className="dashboard-panel-header"><div><h2 id="dashboard-calls-title"><Phone size={17} />Visszahívások</h2><p>Mai hívások és korábbról elmaradt egyeztetések.</p></div><Link href="/leads">Érdeklődők <ArrowRight size={14} /></Link></div>
        {leadResult.error ? <div className="dashboard-empty"><AlertTriangle size={20} /><div><strong>A visszahívások most nem érhetők el.</strong><p>Frissítsd az oldalt az újrapróbáláshoz.</p></div></div> : callbacks.length ? callbacks.slice(0, 5).map(lead => {
          const overdue = dayKey(lead.next_call_date!) < today
          return <div key={lead.id} className="dashboard-list-row"><span className="dashboard-avatar">{lead.name.charAt(0).toLocaleUpperCase('hu')}</span><Link href={`/leads/${lead.id}`} className="dashboard-list-main"><strong>{lead.name}</strong><p>{overdue ? `Elmaradt · ${shortDate(lead.next_call_date!)}` : `Ma · ${new Date(lead.next_call_date!).toLocaleTimeString('hu-HU', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' })}`}{lead.interest_type ? ` · ${lead.interest_type}` : ''}</p></Link>{lead.phone ? <a href={`tel:${lead.phone}`} className="dashboard-call-action" aria-label={`${lead.name} felhívása: ${lead.phone}`} title={lead.phone}><Phone size={16} /></a> : <span className="dashboard-pill">Nincs szám</span>}</div>
        }) : <div className="dashboard-empty"><CircleCheck size={22} /><div><strong>Nincs esedékes visszahívás.</strong><p>Az érdeklődő adatlapján állíthatsz be új időpontot.</p><Link href="/leads">Érdeklődők megnyitása →</Link></div></div>}
        {callbacks.length > 5 && <div className="dashboard-panel-footer">Az első 5 visszahívás látható. <Link href="/leads">Összes érdeklődő →</Link></div>}
      </section>
    </div>
    <nav className="dashboard-quick-actions" aria-label="Gyors műveletek">{quickActions.map(action => {const Icon = action.icon; return <Link href={action.href} key={action.href}><Icon size={19} /><div><strong>{action.title}</strong><span>{action.description}</span></div><ArrowUpRight size={14} /></Link>})}</nav>
    <section aria-labelledby="dashboard-pipeline-title"><div className="dashboard-section-heading"><div><h2 id="dashboard-pipeline-title">Értékesítési folyamat</h2><p>Hol tartanak az érdeklődőid?</p></div><Link href="/leads">Megnyitás <ArrowRight size={14} /></Link></div><div className="dashboard-pipeline">{PIPELINE_STAGES.map((stage, index) => {
      const count = leads.filter(lead => lead.status === stage.id).length
      return <Link key={stage.id} href={`/leads#stage-${stage.id}`} aria-label={`${stage.label}: ${leadResult.error ? 'adat nem elérhető' : count + ' érdeklődő'}`}><span className="dashboard-pipeline-label"><i style={{background:pipelineColors[index]}} />{stage.label}</span><strong>{leadResult.error ? '—' : count}</strong><span className="dashboard-pipeline-bar" aria-hidden="true"><i style={{width:leads.length ? `${count / leads.length * 100}%` : '0%', background:pipelineColors[index]}} /></span></Link>
    })}</div></section>
    <div className="dashboard-main-grid">
      <section aria-labelledby="dashboard-finance-title"><div className="dashboard-section-heading"><div><h2 id="dashboard-finance-title">Pénzügyi áttekintés</h2><p>Előfizetések és ütemezett befizetések, forintban.</p></div><Link href="/payments">Befizetések <ArrowRight size={14} /></Link></div>
        {subscriptionResult.error || paymentResult.error || chartResult.error ? <div className="dashboard-panel dashboard-empty"><AlertTriangle size={20} /><div><strong>A pénzügyi adatok most nem érhetők el.</strong><p>Frissítsd az oldalt az újrapróbáláshoz.</p></div></div> : <RevenueChart payments={(chartResult.data ?? []).filter(payment => payment.currency === 'HUF')} mrr={mrr} activeSubscriptions={subscriptions.filter(subscription => subscription.currency === 'HUF').length} projectRevenue={projectRevenue} />}
        {nonHuf && <p className="dashboard-finance-note">Más pénznemű tételek is vannak. Ezeket az összesítés nem váltja forintra; a Pénzügy és Előfizetések oldalon külön láthatók.</p>}
      </section>
      <section className="dashboard-panel dashboard-notes" aria-labelledby="dashboard-activity-title"><div className="dashboard-panel-header"><div><h2 id="dashboard-activity-title"><MessageSquare size={17} />Legutóbbi bejegyzések</h2><p>Hívások, egyeztetések és feljegyzések.</p></div><Link href="/leads">Érdeklődők <ArrowRight size={14} /></Link></div>
        {noteResult.error ? <div className="dashboard-empty"><AlertTriangle size={20} /><div><strong>A bejegyzések most nem érhetők el.</strong><p>Frissítsd az oldalt az újrapróbáláshoz.</p></div></div> : notes.length ? notes.map(note => {
          const Icon = noteIcons[note.type as keyof typeof noteIcons] ?? MessageSquare
          const related = note.leads as {name:string} | {name:string}[] | null
          const name = Array.isArray(related) ? related[0]?.name : related?.name
          return <Link href={`/leads/${note.lead_id}`} key={note.id} className="dashboard-list-row"><span className="dashboard-note-icon"><Icon size={14} /></span><div className="dashboard-list-main"><div className="dashboard-note-title"><strong>{name ?? 'Érdeklődő'}</strong>{note.outcome && <span>{outcomeLabels[note.outcome] ?? note.outcome}</span>}</div><p>{note.body}</p></div><time className="dashboard-row-date" dateTime={note.created_at}>{shortDate(note.created_at)}</time></Link>
        }) : <div className="dashboard-empty"><MessageSquare size={22} /><div><strong>Még nincs bejegyzés.</strong><p>Az érdeklődő adatlapján rögzített egyeztetések itt jelennek meg.</p></div></div>}
      </section>
    </div>
  </div>
}
