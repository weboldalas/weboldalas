import Link from 'next/link'
import { Plus, CheckCheck, ArrowRight, AlertTriangle, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { markTaskDone } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata = {
  title: 'Feladatok | Weboldalas Admin',
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  todo: { label: 'Teendő', variant: 'outline' },
  in_progress: { label: 'Folyamatban', variant: 'default' },
  waiting: { label: 'Várakozik', variant: 'secondary' },
  done: { label: 'Kész', variant: 'secondary' },
  canceled: { label: 'Törölve', variant: 'secondary' },
}

const priorityMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  low: { label: 'Alacsony', variant: 'secondary' },
  medium: { label: 'Normál', variant: 'outline' },
  high: { label: 'Magas', variant: 'default' },
  urgent: { label: 'Sürgős', variant: 'destructive' },
}

export default async function TasksPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, customers(name), leads(name)')
    .order('due_date', { ascending: true, nullsFirst: false })

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Feladatok</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Kezelje a teendőket és projektfeladatokat.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Feladat</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cím</TableHead>
              <TableHead>Prioritás</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead>Határidő</TableHead>
              <TableHead>Ügyfél / Érdeklődő</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => {
              const isOverdue =
                task.due_date &&
                new Date(task.due_date) < new Date() &&
                task.status !== 'done' &&
                task.status !== 'canceled'

              return (
                <TableRow key={task.id} style={isOverdue ? { background: 'oklch(0.62 0.22 25 / 0.08)' } : {}}>
                  <TableCell className="font-medium">
                    {task.title}
                    {task.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityMap[task.priority]?.variant || 'outline'}>
                      {priorityMap[task.priority]?.label || task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[task.status]?.variant || 'outline'}>
                      {statusMap[task.status]?.label || task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.due_date ? (
                      <span className="font-medium" style={isOverdue ? { color: 'oklch(0.70 0.22 25)' } : {}}>
                        {new Date(task.due_date).toLocaleString('hu-HU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {isOverdue && ' ⚠️'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">–</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.customers?.name ? (
                      <Link href={`/customers/${task.customer_id}`} className="text-sm hover:underline">
                        👤 {task.customers.name}
                      </Link>
                    ) : task.leads?.name ? (
                      <Link href={`/leads/${task.lead_id}`} className="text-sm hover:underline">
                        🎯 {task.leads.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-sm">Általános</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {task.status !== 'done' && task.status !== 'canceled' && (
                        <form action={markTaskDone.bind(null, task.id)}>
                          <Button variant="ghost" size="sm" type="submit" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                            <CheckCheck className="h-4 w-4 mr-1" /> Kész
                          </Button>
                        </form>
                      )}
                      <Link href={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">Szerkesztés</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!tasks || tasks.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nincs megjeleníthető feladat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobil + Tablet: Kártyák */}
      <div className="lg:hidden flex flex-col gap-3">
        {tasks?.map((task) => {
          const isOverdue =
            task.due_date &&
            new Date(task.due_date) < new Date() &&
            task.status !== 'done' &&
            task.status !== 'canceled'
          const isDone = task.status === 'done' || task.status === 'canceled'

          return (
            <Link key={task.id} href={`/tasks/${task.id}`} className="block">
              <Card
                className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer border-white/10"
                style={{
                  background: isOverdue ? 'oklch(0.62 0.22 25 / 0.08)' : 'oklch(1 0 0 / 0.04)',
                  borderLeftWidth: '3px',
                  borderLeftColor: isOverdue
                    ? 'oklch(0.70 0.22 25)'
                    : isDone
                      ? 'oklch(1 0 0 / 0.1)'
                      : task.priority === 'urgent'
                        ? 'oklch(0.65 0.22 25)'
                        : task.priority === 'high'
                          ? 'oklch(0.70 0.18 60)'
                          : 'oklch(0.60 0.22 290)',
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-white truncate mb-1.5 ${isDone ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={priorityMap[task.priority]?.variant || 'outline'} className="text-xs">
                          {priorityMap[task.priority]?.label || task.priority}
                        </Badge>
                        <Badge variant={statusMap[task.status]?.variant || 'outline'} className="text-xs">
                          {statusMap[task.status]?.label || task.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-white/40">
                        {task.due_date && (
                          <div className="flex items-center gap-1.5" style={isOverdue ? { color: 'oklch(0.70 0.22 25)' } : {}}>
                            {isOverdue ? <AlertTriangle className="h-3 w-3 shrink-0" /> : <Clock className="h-3 w-3 shrink-0" />}
                            {new Date(task.due_date).toLocaleString('hu-HU', {
                              year: 'numeric', month: '2-digit', day: '2-digit',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </div>
                        )}
                        {(task.customers?.name || task.leads?.name) && (
                          <div className="text-white/30">
                            {task.customers?.name ? `👤 ${task.customers.name}` : `🎯 ${task.leads?.name}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!isDone && (
                        <form action={markTaskDone.bind(null, task.id)} onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      <ArrowRight className="h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-12 text-white/40">
            <p className="text-lg mb-2">Nincs megjeleníthető feladat.</p>
            <Link href="/tasks/new">
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Új Feladat létrehozása
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
