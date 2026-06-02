import { createClient } from '@/utils/supabase/server'
import { TaskForm } from '../TaskForm'
import { notFound } from 'next/navigation'

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: task, error },
    { data: customers },
    { data: leads },
    { data: { users } = { users: [] } },
  ] = await Promise.all([
    supabase.from('tasks').select('*').eq('id', id).single(),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('leads').select('id, name').order('name'),
    supabase.auth.admin.listUsers(),
  ])

  if (error || !task) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feladat szerkesztése</h1>
      </div>
      <TaskForm
        task={task}
        customers={customers || []}
        leads={leads || []}
        users={users || []}
      />
    </div>
  )
}
