'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ControlledSelect } from '@/components/ui/controlled-select'
import { createTask, updateTask } from './actions'

const STATUS_OPTIONS = [
  { value: 'todo',        label: 'Teendő' },
  { value: 'in_progress', label: 'Folyamatban' },
  { value: 'waiting',     label: 'Várakozik' },
  { value: 'done',        label: 'Kész' },
  { value: 'canceled',    label: 'Törölve' },
]

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Alacsony' },
  { value: 'medium', label: 'Normál' },
  { value: 'high',   label: 'Magas' },
  { value: 'urgent', label: 'Sürgős' },
]

export function TaskForm({ task, customers, leads, users, defaultCustomerId, defaultLeadId }: {
  task?: any
  customers: any[]
  leads: any[]
  users: any[]
  defaultCustomerId?: string
  defaultLeadId?: string
}) {
  const isEditing = !!task
  const action = isEditing ? updateTask.bind(null, task.id) : createTask
  const [state, formAction, pending] = useActionState(action, null)

  const userOptions = [
    { value: 'none', label: 'Nincs megadva' },
    ...users.map(u => ({ value: u.id, label: u.email })),
  ]
  const customerOptions = [
    { value: 'none', label: 'Nincs kapcsolva' },
    ...customers.map(c => ({ value: c.id, label: c.name })),
  ]
  const leadOptions = [
    { value: 'none', label: 'Nincs kapcsolva' },
    ...leads.map(l => ({ value: l.id, label: l.name })),
  ]

  return (
    <Card className="max-w-3xl mx-auto w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Feladat szerkesztése' : 'Új Feladat'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Cím *</Label>
            <Input id="title" name="title" defaultValue={task?.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Leírás</Label>
            <Textarea id="description" name="description" defaultValue={task?.description} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Státusz *</Label>
              <ControlledSelect name="status" options={STATUS_OPTIONS} defaultValue={task?.status || 'todo'} />
            </div>

            <div className="space-y-2">
              <Label>Prioritás *</Label>
              <ControlledSelect name="priority" options={PRIORITY_OPTIONS} defaultValue={task?.priority || 'medium'} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Határidő</Label>
              <Input
                id="due_date"
                name="due_date"
                type="datetime-local"
                defaultValue={task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Felelős</Label>
              <ControlledSelect name="assigned_to" options={userOptions} defaultValue={task?.assigned_to || 'none'} placeholder="Válassz felelőst" />
            </div>

            <div className="space-y-2">
              <Label>Ügyfél kapcsolás</Label>
              <ControlledSelect name="customer_id" options={customerOptions} defaultValue={task?.customer_id || defaultCustomerId || 'none'} />
            </div>

            <div className="space-y-2">
              <Label>Érdeklődő kapcsolás</Label>
              <ControlledSelect name="lead_id" options={leadOptions} defaultValue={task?.lead_id || defaultLeadId || 'none'} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Megjegyzés</Label>
            <Textarea id="note" name="note" defaultValue={task?.note} rows={2} />
          </div>

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Link href="/tasks">
              <Button variant="outline" type="button">Mégse</Button>
            </Link>
            <Button type="submit" disabled={pending}>
              {pending ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
