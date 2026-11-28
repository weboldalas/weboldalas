'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

export type ProjectFormState = { error?: string; fieldErrors?: Record<string, string> } | null

const optionalDate = z.string().trim().transform(v => v || null).pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Érvénytelen dátum.').nullable())

const projectSchema = z.object({
  customer_id: z.uuid('Válassz partnert.'),
  name: z.string().trim().min(1, 'Add meg a projekt nevét.').max(200),
  description: z.string().trim().max(5000).transform(v => v || null),
  status: z.enum(['planned', 'active', 'on_hold', 'completed', 'cancelled']),
  start_date: optionalDate,
  due_date: optionalDate,
  budget: z.string().trim().max(30),
  currency: z.enum(['HUF', 'EUR']),
})

function parse(formData: FormData) {
  const raw = Object.fromEntries(['customer_id', 'name', 'description', 'status', 'start_date', 'due_date', 'budget', 'currency'].map(k => [k, (formData.get(k) as string | null) ?? '']))
  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    return { error: Object.values(fieldErrors)[0], fieldErrors } as const
  }
  const budgetRaw = parsed.data.budget.replace(/\s/g, '').replace(',', '.')
  const budget = budgetRaw ? Number(budgetRaw) : null
  if (budget !== null && (!Number.isFinite(budget) || budget < 0)) return { error: 'A keretösszeg legyen pozitív szám.', fieldErrors: { budget: 'Érvénytelen összeg.' } } as const
  return { data: { ...parsed.data, budget } } as const
}

export async function createProject(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const result = parse(formData)
  if ('error' in result) return result
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').insert(result.data).select('id').single()
  if (error || !data) return { error: `A projekt mentése nem sikerült: ${error?.message ?? 'ismeretlen hiba'}` }
  revalidatePath('/projects')
  revalidatePath(`/partners/${result.data.customer_id}`)
  redirect(`/projects/${data.id}`)
}

export async function updateProject(id: string, _prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const result = parse(formData)
  if ('error' in result) return result
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update(result.data).eq('id', id)
  if (error) return { error: `A mentés nem sikerült: ${error.message}` }
  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  revalidatePath(`/partners/${result.data.customer_id}`)
  redirect(`/projects/${id}`)
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select('customer_id').single()
  if (error) return { error: `A törlés nem sikerült: ${error.message}` }
  revalidatePath('/projects')
  if (data?.customer_id) revalidatePath(`/partners/${data.customer_id}`)
  redirect('/projects')
}
