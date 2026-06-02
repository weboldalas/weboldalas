'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createTask(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  // Get current user id for assigned_to if we wanted to auto-assign, but user can be selected.
  // For now, if assigned_to is in form, use it, else keep null or assign to self
  
  const toUUID = (val: FormDataEntryValue | null) => {
    const s = val as string
    return s && s !== 'none' ? s : null
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    status: formData.get('status') as string,
    priority: formData.get('priority') as string,
    due_date: formData.get('due_date') ? new Date(formData.get('due_date') as string).toISOString() : null,
    customer_id: toUUID(formData.get('customer_id')),
    lead_id: toUUID(formData.get('lead_id')),
    assigned_to: toUUID(formData.get('assigned_to')),
    note: formData.get('note') as string || null,
  }

  const { error } = await supabase.from('tasks').insert([data])

  if (error) {
    console.error('Error creating task:', error)
    return { error: error.message }
  }

  revalidatePath('/tasks')
  if (data.customer_id) revalidatePath(`/customers/${data.customer_id}`)
  if (data.lead_id) revalidatePath(`/leads/${data.lead_id}`)
  
  redirect('/tasks')
}

export async function updateTask(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const toUUID = (val: FormDataEntryValue | null) => {
    const s = val as string
    return s && s !== 'none' ? s : null
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    status: formData.get('status') as string,
    priority: formData.get('priority') as string,
    due_date: formData.get('due_date') ? new Date(formData.get('due_date') as string).toISOString() : null,
    customer_id: toUUID(formData.get('customer_id')),
    lead_id: toUUID(formData.get('lead_id')),
    assigned_to: toUUID(formData.get('assigned_to')),
    note: formData.get('note') as string || null,
  }

  const { error } = await supabase.from('tasks').update(data).eq('id', id)

  if (error) {
    console.error('Error updating task:', error)
    return { error: error.message }
  }

  revalidatePath('/tasks')
  if (data.customer_id) revalidatePath(`/customers/${data.customer_id}`)
  if (data.lead_id) revalidatePath(`/leads/${data.lead_id}`)

  redirect('/tasks')
}

export async function markTaskDone(id: string) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ status: 'done' }).eq('id', id)
  revalidatePath('/tasks')
}
