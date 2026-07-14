import Link from 'next/link'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { Plus, Phone, Mail, Calendar, Users, PhoneCall } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { convertLeadToCustomer } from '../customers/actions'
import { DeleteLeadIconButton } from './DeleteLeadIconButton'
import { PIPELINE_STAGES } from './pipeline'

export const metadata = {
  title: 'Érdeklődők | Weboldalas Admin',
}

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  const todayCallbacks = leads?.filter(l => {
    if (!l.next_call_date) return false
    return l.next_call_date.startsWith(todayStr) && !['elfogadott', 'elutasitott'].includes(l.status)
  }) ?? []

  const groups = PIPELINE_STAGES.map(stage => ({
    stage,
    leads: leads?.filter(l => l.status === stage.id) ?? [],
  }))

  const total = leads?.length ?? 0
  const active = leads?.filter(l => !['elfogadott', 'elutasitott'].includes(l.status)).length ?? 0

  return (
    <div className="flex flex-col gap-6 sm:gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Érdeklődők</h1>
          <p className="text-white/40 mt-1 text-sm">{total} összesen · {active} aktív</p>
        </div>
        <Link href="/leads/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Új Érdeklődő</Button>
        </Link>
      </div>

      {/* === MAI VISSZAHÍVÁSOK === */}
      {todayCallbacks.length > 0 && (
        <div className="flex flex-col gap-2">

          {/* Mai hívások */}
          {todayCallbacks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5" style={{ color: 'oklch(0.68 0.18 145)' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'oklch(0.68 0.18 145)' }}>
                  Ma felhívandók — {todayCallbacks.length} személy
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {todayCallbacks.map(lead => {
                  const stage = PIPELINE_STAGES.find(s => s.id === lead.status)
                  return (
                    <div key={lead.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{ background: 'oklch(0.68 0.18 145 / 0.08)', border: '1px solid oklch(0.68 0.18 145 / 0.25)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                        style={{ background: 'oklch(0.68 0.18 145 / 0.20)', color: 'oklch(0.75 0.18 145)' }}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <Link href={`/leads/${lead.id}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                        <div className="text-sm font-semibold text-white truncate">{lead.name}</div>
                        <div className="text-xs text-white/40 truncate">
                          {stage?.label ?? lead.status}
                          {lead.next_call_date && ` · ${new Date(lead.next_call_date).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}`}
                        </div>
                      </Link>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          style={{ color: 'oklch(0.75 0.18 145)' }}>
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pipeline stat kártyák */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {PIPELINE_STAGES.map(stage => {
          const count = leads?.filter(l => l.status === stage.id).length ?? 0
          return (
            <div key={stage.id} className="rounded-xl p-3"
              style={{ background: stage.bg, border: `1px solid ${stage.color}30` }}>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs font-medium mt-0.5 truncate" style={{ color: stage.color }}>
                {stage.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Csoportosított leadek */}
      {groups.map(({ stage, leads: stageLeads }) => {
        if (stageLeads.length === 0) return null
        return (
          <div key={stage.id}>
            {/* Szekció fejléc */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: stage.color }}>
                {stage.label}
              </h2>
              <span className="text-xs rounded-full px-2 py-0.5 font-bold"
                style={{ background: `${stage.color}20`, color: stage.color }}>
                {stageLeads.length}
              </span>
            </div>

            {/* Kártya grid */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {stageLeads.map(lead => (
                <div key={lead.id} className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{
                    background: 'oklch(1 0 0 / 0.03)',
                    border: `1px solid ${stage.color}18`,
                    borderLeft: `3px solid ${stage.color}`,
                  }}>

                  {/* Név + törlés */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Link href={`/leads/${lead.id}`}
                        className="font-semibold text-white hover:text-white/80 transition-colors truncate block">
                        {lead.name}
                      </Link>
                      {lead.interest_type && (
                        <div className="text-xs text-white/35 mt-0.5 truncate">{lead.interest_type}</div>
                      )}
                    </div>
                    <DeleteLeadIconButton id={lead.id} />
                  </div>

                  {/* Kontakt adatok */}
                  <div className="flex flex-col gap-1">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs text-white/45">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-xs text-white/45">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.next_call_date && (
                      <div className="flex items-center gap-2 text-xs text-white/45">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{format(new Date(lead.next_call_date), 'yyyy. MMM d.', { locale: hu })}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-white/25">
                      {format(new Date(lead.created_at), 'yyyy. MM. dd.')}
                    </span>
                    <div className="flex items-center gap-1">
                      {!['elfogadott', 'elutasitott'].includes(lead.status) && (
                        <form action={convertLeadToCustomer.bind(null, lead.id)}>
                          <Button variant="outline" size="sm" type="submit"
                            className="h-7 text-xs px-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                            Ügyféllé
                          </Button>
                        </form>
                      )}
                      <Link href={`/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                          Megnyit →
                        </Button>
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )
      })}

      {(!leads || leads.length === 0) && (
        <div className="text-center py-20 text-white/30">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-4">Még nincs érdeklődő. Hozz létre egyet!</p>
          <Link href="/leads/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Új Érdeklődő</Button>
          </Link>
        </div>
      )}

    </div>
  )
}
