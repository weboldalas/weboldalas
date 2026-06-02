import Link from 'next/link'
import { Plus, CheckCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feladatok</h1>
          <p className="text-muted-foreground mt-2">
            Kezelje a teendőket és projekttfeladatokat.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Új Feladat
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
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
                    <div className="flex justify-end gap-2">
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
    </div>
  )
}
