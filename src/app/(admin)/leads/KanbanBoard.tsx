'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Phone, Mail, Calendar, ChevronRight, ChevronLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { moveLeadStage } from './actions'
import { PIPELINE_STAGES } from './pipeline'
export { PIPELINE_STAGES } from './pipeline'
export type { LeadStatus } from './pipeline'

const SOURCE_LABELS: Record<string, string> = {
  hideg_hivas: '📞 Hideg hívás',
  hirdetes:    '📢 Hirdetés',
  email:       '✉️ Email',
  ajanlas:     '🤝 Ajánlás',
  weboldal:    '🌐 Weboldal',
  egyeb:       '❓ Egyéb',
}

function LeadCard({ lead, stageIndex }: { lead: any, stageIndex: number }) {
  const [isPending, startTransition] = useTransition()

  const move = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? stageIndex + 1 : stageIndex - 1
    const newStage = PIPELINE_STAGES[newIndex]?.id
    if (!newStage) return
    startTransition(async () => {
      const res = await moveLeadStage(lead.id, newStage)
      if (res?.error) toast.error('Hiba', { description: res.error })
    })
  }

  const isOverdue = lead.next_call_date && new Date(lead.next_call_date) < new Date()

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'oklch(1 0 0 / 0.04)',
        border: '1px solid oklch(1 0 0 / 0.08)',
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {/* Name + link */}
      <div className="flex items-start justify-between gap-2">
        <Link href={`/leads/${lead.id}`} className="font-semibold text-sm text-white hover:text-violet-300 transition-colors leading-tight">
          {lead.name}
        </Link>
      </div>

      {/* Industry */}
      {lead.industry && (
        <div className="text-xs text-white/40 flex items-center gap-1">
          <User className="h-3 w-3" />
          {lead.industry}
        </div>
      )}

      {/* Contact */}
      <div className="flex flex-col gap-0.5">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors">
            <Phone className="h-3 w-3" /> {lead.phone}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors truncate">
            <Mail className="h-3 w-3" /> {lead.email}
          </a>
        )}
      </div>

      {/* Source */}
      {lead.source && (
        <div className="text-xs text-white/35">{SOURCE_LABELS[lead.source] || lead.source}</div>
      )}

      {/* Next call */}
      {lead.next_call_date && (
        <div
          className="flex items-center gap-1 text-xs rounded-lg px-2 py-1"
          style={{
            background: isOverdue ? 'oklch(0.62 0.22 25 / 0.15)' : 'oklch(1 0 0 / 0.05)',
            color: isOverdue ? 'oklch(0.75 0.20 25)' : 'oklch(1 0 0 / 0.50)',
          }}
        >
          <Calendar className="h-3 w-3 shrink-0" />
          {isOverdue ? '⚠️ ' : ''}
          {new Date(lead.next_call_date).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 pt-1">
        {stageIndex > 0 && (
          <button
            onClick={() => move('prev')}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1 text-xs text-white/30 hover:text-white/70 hover:bg-white/05 transition-all"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
        {stageIndex < PIPELINE_STAGES.length - 1 && (
          <button
            onClick={() => move('next')}
            disabled={isPending}
            className="flex-[2] flex items-center justify-center gap-1 rounded-lg py-1 text-xs hover:bg-white/05 transition-all"
            style={{ color: PIPELINE_STAGES[stageIndex + 1]?.color }}
          >
            {PIPELINE_STAGES[stageIndex + 1]?.label} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export function KanbanBoard({ leads }: { leads: any[] }) {
  const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = leads.filter(l => l.status === stage.id)
    return acc
  }, {} as Record<string, any[]>)

  const ACTIVE_STAGES = PIPELINE_STAGES.slice(0, 4)   // Felkeresendő → Függőben
  const CLOSED_STAGES = PIPELINE_STAGES.slice(4)       // Elfogadott, Elutasított

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex gap-2 flex-wrap items-center">
        {ACTIVE_STAGES.map(stage => (
          <div key={stage.id} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{ background: stage.bg, color: stage.color, border: `1px solid ${stage.color}30` }}>
            {stage.label}
            <span className="font-bold">{grouped[stage.id]?.length ?? 0}</span>
          </div>
        ))}
        <div className="ml-auto flex gap-2">
          <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
            style={{ background: 'oklch(0.68 0.18 145 / 0.12)', color: 'oklch(0.75 0.18 145)', border: '1px solid oklch(0.68 0.18 145 / 0.30)' }}>
            ✓ Elfogadott: {grouped['elfogadott']?.length ?? 0}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
            style={{ background: 'oklch(0.62 0.22 25 / 0.10)', color: 'oklch(0.70 0.20 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
            ✗ Elutasított: {grouped['elutasitott']?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Active Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {ACTIVE_STAGES.map((stage, stageIndex) => {
          const stageLeads = grouped[stage.id] ?? []
          return (
            <div key={stage.id} className="flex flex-col gap-2 rounded-2xl p-3 min-h-[120px]"
              style={{ background: stage.bg, border: `1px solid ${stage.color}25` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: stage.color }}>
                  {stage.label}
                </span>
                <span className="text-xs font-bold rounded-full px-2 py-0.5"
                  style={{ background: `${stage.color}25`, color: stage.color }}>
                  {stageLeads.length}
                </span>
              </div>
              {stageLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} stageIndex={stageIndex} />
              ))}
              {stageLeads.length === 0 && (
                <div className="text-center text-xs py-6" style={{ color: `${stage.color}50` }}>Üres</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Closed stages — Elfogadott / Elutasított side by side */}
      {(grouped['elfogadott']?.length > 0 || grouped['elutasitott']?.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {CLOSED_STAGES.map((stage) => {
            const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === stage.id)
            const stageLeads = grouped[stage.id] ?? []
            return (
              <div key={stage.id} className="flex flex-col gap-2 rounded-2xl p-3"
                style={{ background: stage.bg, border: `1px solid ${stage.color}25` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: stage.color }}>
                    {stage.id === 'elfogadott' ? '✓ ' : '✗ '}{stage.label}
                  </span>
                  <span className="text-xs font-bold rounded-full px-2 py-0.5"
                    style={{ background: `${stage.color}25`, color: stage.color }}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stageLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} stageIndex={stageIdx} />
                  ))}
                </div>
                {stageLeads.length === 0 && (
                  <div className="text-center text-xs py-4" style={{ color: `${stage.color}50` }}>Üres</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
