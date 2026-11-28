'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { addDays, formatMonth, monthKey, todayKey } from '@/lib/crm/format'

export type InvoiceFormState = { error?: string; fieldErrors?: Record<string, string> } | null
export type ActionResult = { error?: string; ok?: boolean; created?: number }

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Érvénytelen dátum.')
const optionalUuid = z.string().trim().transform(v => v || null).pipe(z.uuid().nullable())

const itemSchema = z.object({
  description: z.string().trim().min(1, 'Minden tételnek adj megnevezést.').max(500),
  quantity: z.coerce.number().positive('A mennyiség legyen pozitív.').max(100000),
  unit_price: z.coerce.number().min(0, 'Az ár nem lehet negatív.').max(1_000_000_000),
})

const invoiceSchema = z.object({
  customer_id: z.uuid('Válassz partnert.'),
  kind: z.enum(['one_off', 'recurring']),
  status: z.enum(['draft', 'issued']),
  number: z.string().trim().max(60).transform(v => v || null),
  issue_date: dateString,
  due_date: z.string().trim().transform(v => v || null).pipe(dateString.nullable()),
  currency: z.enum(['HUF', 'EUR']),
  subscription_id: optionalUuid,
  project_id: optionalUuid,
  notes: z.string().trim().max(4000).transform(v => v || null),
  items: z.string().transform((raw, ctx) => {
    try { return JSON.parse(raw) as unknown } catch { ctx.addIssue({ code: 'custom', message: 'Hibás tétellista.' }); return z.NEVER }
  }).pipe(z.array(itemSchema).min(1, 'Adj meg legalább egy tételt.').max(100)),
})

function revalidateInvoice(id: string | null, customerId: string | null) {
  revalidatePath('/invoices')
  revalidatePath('/dashboard')
  if (id) revalidatePath(`/invoices/${id}`)
  if (customerId) revalidatePath(`/partners/${customerId}`)
}

function parseInvoice(formData: FormData) {
  const keys = ['customer_id', 'kind', 'status', 'number', 'issue_date', 'due_date', 'currency', 'subscription_id', 'project_id', 'notes', 'items']
  return invoiceSchema.safeParse(Object.fromEntries(keys.map(k => [k, (formData.get(k) as string | null) ?? ''])))
}

function firstErrors(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) { const key = String(issue.path[0]); if (!out[key]) out[key] = issue.message }
  return out
}

export async function createInvoice(_prev: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  const parsed = parseInvoice(formData)
  if (!parsed.success) return { error: Object.values(firstErrors(parsed.error))[0], fieldErrors: firstErrors(parsed.error) }
  const { items, ...data } = parsed.data
  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)

  const supabase = await createClient()
  const { data: invoice, error } = await supabase.from('invoices').insert({ ...data, total }).select('id').single()
  if (error || !invoice) return { error: `A számla mentése nem sikerült: ${error?.message ?? 'ismeretlen hiba'}` }

  const { error: itemsError } = await supabase.from('invoice_items').insert(items.map((item, position) => ({ ...item, position, invoice_id: invoice.id })))
  if (itemsError) {
    await supabase.from('invoices').delete().eq('id', invoice.id)
    return { error: `A tételek mentése nem sikerült: ${itemsError.message}` }
  }

  revalidateInvoice(invoice.id, data.customer_id)
  redirect(`/invoices/${invoice.id}`)
}

export async function updateInvoice(id: string, _prev: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  const parsed = parseInvoice(formData)
  if (!parsed.success) return { error: Object.values(firstErrors(parsed.error))[0], fieldErrors: firstErrors(parsed.error) }
  const { items, ...data } = parsed.data
  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)

  const supabase = await createClient()
  const { data: current } = await supabase.from('invoices').select('status').eq('id', id).single()
  if (!current) return { error: 'A számla nem található.' }
  // A paid invoice keeps its paid status when only its details are edited.
  const status = current.status === 'paid' ? 'paid' : data.status

  const { error } = await supabase.from('invoices').update({ ...data, status, total }).eq('id', id)
  if (error) return { error: `A mentés nem sikerült: ${error.message}` }

  const { error: delError } = await supabase.from('invoice_items').delete().eq('invoice_id', id)
  if (delError) return { error: `A tételek frissítése nem sikerült: ${delError.message}` }
  const { error: itemsError } = await supabase.from('invoice_items').insert(items.map((item, position) => ({ ...item, position, invoice_id: id })))
  if (itemsError) return { error: `A tételek mentése nem sikerült: ${itemsError.message}` }

  await syncPaidStatus(supabase, id)
  revalidateInvoice(id, data.customer_id)
  redirect(`/invoices/${id}`)
}

async function syncPaidStatus(supabase: Awaited<ReturnType<typeof createClient>>, invoiceId: string) {
  const { data: invoice } = await supabase.from('invoices').select('status, total, payments(amount, status)').eq('id', invoiceId).single()
  if (!invoice || invoice.status === 'cancelled' || invoice.status === 'draft') return
  const paid = (invoice.payments ?? []).filter(p => p.status === 'completed' || p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const next = paid >= Number(invoice.total) && Number(invoice.total) > 0 ? 'paid' : 'issued'
  if (next !== invoice.status) await supabase.from('invoices').update({ status: next }).eq('id', invoiceId)
}

const paymentSchema = z.object({
  amount: z.coerce.number().positive('Az összeg legyen pozitív.'),
  payment_date: dateString,
  note: z.string().trim().max(500).transform(v => v || null),
})

export async function recordPayment(invoiceId: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = paymentSchema.safeParse({ amount: formData.get('amount'), payment_date: formData.get('payment_date'), note: formData.get('note') ?? '' })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const { data: invoice } = await supabase.from('invoices').select('id, customer_id, kind, currency, status, due_date').eq('id', invoiceId).single()
  if (!invoice) return { error: 'A számla nem található.' }
  if (invoice.status === 'cancelled') return { error: 'Sztornózott számlára nem rögzíthető befizetés.' }

  const { error } = await supabase.from('payments').insert({
    customer_id: invoice.customer_id,
    invoice_id: invoice.id,
    amount: parsed.data.amount,
    currency: invoice.currency,
    status: 'completed',
    payment_date: `${parsed.data.payment_date}T12:00:00Z`,
    due_date: invoice.due_date ? `${invoice.due_date}T12:00:00Z` : null,
    payment_type: invoice.kind === 'recurring' ? 'előfizetés' : 'egyszeri',
    note: parsed.data.note,
  })
  if (error) return { error: `A befizetés mentése nem sikerült: ${error.message}` }

  if (invoice.status === 'draft') await supabase.from('invoices').update({ status: 'issued' }).eq('id', invoiceId)
  await syncPaidStatus(supabase, invoiceId)
  revalidateInvoice(invoiceId, invoice.customer_id)
  revalidatePath('/payments')
  return { ok: true }
}

export async function deletePayment(invoiceId: string, paymentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('payments').delete().eq('id', paymentId).eq('invoice_id', invoiceId)
  if (error) return { error: `A törlés nem sikerült: ${error.message}` }
  const { data: invoice } = await supabase.from('invoices').select('customer_id').eq('id', invoiceId).single()
  await syncPaidStatus(supabase, invoiceId)
  revalidateInvoice(invoiceId, invoice?.customer_id ?? null)
  revalidatePath('/payments')
  return { ok: true }
}

export async function setInvoiceStatus(invoiceId: string, status: 'issued' | 'cancelled'): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: invoice, error } = await supabase.from('invoices').update({ status }).eq('id', invoiceId).select('customer_id').single()
  if (error) return { error: `A mentés nem sikerült: ${error.message}` }
  if (status === 'issued') await syncPaidStatus(supabase, invoiceId)
  revalidateInvoice(invoiceId, invoice?.customer_id ?? null)
  return { ok: true }
}

export async function deleteInvoice(invoiceId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { count } = await supabase.from('payments').select('id', { count: 'exact', head: true }).eq('invoice_id', invoiceId)
  if (count) return { error: 'Ehhez a számlához befizetés tartozik. Előbb töröld a befizetést, vagy sztornózd a számlát.' }
  const { data: invoice, error } = await supabase.from('invoices').delete().eq('id', invoiceId).select('customer_id').single()
  if (error) return { error: `A törlés nem sikerült: ${error.message}` }
  revalidateInvoice(null, invoice?.customer_id ?? null)
  redirect('/invoices')
}

/** Creates this month's invoice for every active monthly fee that does not have one yet. */
export async function generateRetainerInvoices(): Promise<ActionResult> {
  const supabase = await createClient()
  const today = todayKey()
  const month = monthKey(new Date())
  const monthStart = `${month}-01`

  const { data: subs, error } = await supabase.from('subscriptions')
    .select('id, customer_id, plan_name, monthly_fee, currency, billing_day')
    .eq('status', 'active')
  if (error) return { error: error.message }
  if (!subs?.length) return { ok: true, created: 0 }

  const { data: existing } = await supabase.from('invoices').select('subscription_id')
    .in('subscription_id', subs.map(s => s.id)).gte('issue_date', monthStart).neq('status', 'cancelled')
  const done = new Set((existing ?? []).map(e => e.subscription_id))
  const todo = subs.filter(s => !done.has(s.id) && Number(s.monthly_fee) > 0)

  let created = 0
  for (const sub of todo) {
    const issueDate = sub.billing_day ? `${month}-${String(sub.billing_day).padStart(2, '0')}` : today
    const { data: invoice, error: invError } = await supabase.from('invoices').insert({
      customer_id: sub.customer_id,
      kind: 'recurring',
      status: 'issued',
      issue_date: issueDate,
      due_date: addDays(issueDate, 8),
      total: sub.monthly_fee,
      currency: sub.currency ?? 'HUF',
      subscription_id: sub.id,
    }).select('id').single()
    if (invError || !invoice) continue
    await supabase.from('invoice_items').insert({ invoice_id: invoice.id, position: 0, description: `${sub.plan_name} – ${formatMonth(month, 'long')}`, quantity: 1, unit_price: sub.monthly_fee })
    created++
    revalidatePath(`/partners/${sub.customer_id}`)
  }

  revalidatePath('/invoices')
  revalidatePath('/dashboard')
  return { ok: true, created }
}
