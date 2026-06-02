import { createClient } from '@/utils/supabase/server'
import { TaskForm } from '../TaskForm'

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string; lead_id?: string }>
}) {
  const resolvedParams = await searchParams
  const supabase = await createClient()

  const [
    { data: customers },
    { data: leads },
    { data: { users } = { users: [] } },
  ] = await Promise.all([
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('leads').select('id, name').order('name'),
    supabase.auth.admin.listUsers(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Új Feladat</h1>
      </div>
      <TaskForm
        customers={customers || []}
        leads={leads || []}
        users={users || []}
        defaultCustomerId={resolvedParams?.customer_id}
        defaultLeadId={resolvedParams?.lead_id}
      />
    </div>
  )
}
