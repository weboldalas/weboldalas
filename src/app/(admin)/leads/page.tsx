import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from './KanbanBoard'

export const metadata = {
  title: 'Érdeklődők | Weboldalas Admin',
}

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const total = leads?.length ?? 0
  const todayCallbacks = leads?.filter(l => {
    if (!l.next_call_date) return false
    const d = new Date(l.next_call_date)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length ?? 0
  const overdueCallbacks = leads?.filter(l => {
    if (!l.next_call_date) return false
    return new Date(l.next_call_date) < new Date() && l.status !== 'nyert' && l.status !== 'elveszett'
  }).length ?? 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Érdeklődők</h1>
          <p className="text-white/50 mt-1">Értékesítési pipeline — {total} lead összesen</p>
        </div>
        <Link href="/leads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Új Lead
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="flex gap-3 flex-wrap">
        {todayCallbacks > 0 && (
          <div className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
            style={{ background: 'oklch(0.68 0.18 145 / 0.12)', border: '1px solid oklch(0.68 0.18 145 / 0.25)', color: 'oklch(0.75 0.18 145)' }}>
            📞 Mai visszahívások: <strong>{todayCallbacks}</strong>
          </div>
        )}
        {overdueCallbacks > 0 && (
          <div className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
            style={{ background: 'oklch(0.62 0.22 25 / 0.12)', border: '1px solid oklch(0.62 0.22 25 / 0.25)', color: 'oklch(0.75 0.20 25)' }}>
            ⚠️ Lejárt visszahívások: <strong>{overdueCallbacks}</strong>
          </div>
        )}
      </div>

      {/* Kanban board */}
      <KanbanBoard leads={leads ?? []} />
    </div>
  )
}
