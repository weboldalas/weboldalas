import type { SupabaseClient } from '@supabase/supabase-js'
import { addDays, todayKey } from './format'
import { createPartnerFromLead } from './partners'

const PAYMENT_DAYS = 8

function addMonthsToDay(key: string, delta: number) {
  const [y, m, d] = key.split('-').map(Number)
  const last = new Date(Date.UTC(y, m - 1 + delta + 1, 0)).getUTCDate()
  const date = new Date(Date.UTC(y, m - 1 + delta, Math.min(d, last)))
  return date.toISOString().slice(0, 10)
}

/**
 * Turns an accepted offer into real records:
 * - a partner (from the lead) if the offer was made to a lead,
 * - one-off: one issued invoice; installments: one invoice per month;
 * - subscription: an active monthly fee (its invoices come from "E havi havidíjak").
 *
 * The offer is claimed first with a conditional update, so a double click or a
 * customer accepting twice can never create the records twice.
 */
export async function realizeOfferRecords(supabase: SupabaseClient, offerId: string, userId: string | null = null) {
  const { data: claimed, error: claimError } = await supabase
    .from('offers')
    .update({ is_realized: true, realized_at: new Date().toISOString(), realized_by: userId })
    .eq('id', offerId)
    .eq('status', 'accepted')
    .eq('is_realized', false)
    .select('id, customer_id, lead_id, total_amount, payment_type, installment_months, subscription_plan_name, subscription_note, leads(name, email, phone), offer_items(description, price, position)')
    .maybeSingle()

  if (claimError) return { error: claimError.message }
  if (!claimed) return { error: 'Az ajánlat már realizálva van, vagy még nincs elfogadva.' }

  const release = () => supabase.from('offers').update({ is_realized: false, realized_at: null, realized_by: null }).eq('id', offerId)

  let customerId = claimed.customer_id as string | null
  const lead = (Array.isArray(claimed.leads) ? claimed.leads[0] : claimed.leads) as { name: string | null; email: string | null; phone: string | null } | null
  if (!customerId && claimed.lead_id && lead) {
    const created = await createPartnerFromLead(supabase, lead)
    if ('error' in created) { await release(); return { error: created.error } }
    customerId = created.id
    await supabase.from('leads').update({ status: 'elfogadott' }).eq('id', claimed.lead_id)
  }
  if (!customerId) { await release(); return { error: 'Az ajánlathoz nincs partner vagy érdeklődő rendelve.' } }

  const items = [...(claimed.offer_items ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const total = Number(claimed.total_amount) || items.reduce((s, i) => s + Number(i.price), 0)
  const today = todayKey()

  if (claimed.payment_type === 'subscription') {
    const { error } = await supabase.from('subscriptions').insert({
      customer_id: customerId,
      plan_name: claimed.subscription_plan_name || 'Havidíj',
      monthly_fee: total,
      status: 'active',
      start_date: new Date().toISOString(),
      next_billing_date: new Date().toISOString(),
      billing_day: Math.min(28, Number(today.slice(8, 10))),
      note: claimed.subscription_note,
    })
    if (error) { await release(); return { error: error.message } }
  } else {
    const months = claimed.payment_type === 'installments' ? Math.max(1, Number(claimed.installment_months) || 1) : 1
    const base = Math.floor(total / months)
    for (let i = 0; i < months; i++) {
      const amount = i === months - 1 ? total - base * (months - 1) : base
      const issueDate = addMonthsToDay(today, i)
      const { data: invoice, error } = await supabase.from('invoices').insert({
        customer_id: customerId,
        kind: 'one_off',
        status: i === 0 ? 'issued' : 'draft',
        issue_date: issueDate,
        due_date: addDays(issueDate, PAYMENT_DAYS),
        total: amount,
        currency: 'HUF',
        offer_id: offerId,
        notes: months > 1 ? `${i + 1}/${months}. részlet az elfogadott ajánlat alapján` : 'Elfogadott ajánlat alapján',
      }).select('id').single()
      if (error || !invoice) { await release(); return { error: error?.message ?? 'A számla létrehozása nem sikerült.' } }

      const invoiceItems = months > 1
        ? [{ invoice_id: invoice.id, position: 0, description: `${i + 1}. részlet (${items.map(it => it.description).join(', ') || 'ajánlat'})`.slice(0, 500), quantity: 1, unit_price: amount }]
        : (items.length ? items : [{ description: 'Ajánlat szerinti munka', price: total }]).map((it, position) => ({ invoice_id: invoice.id, position, description: it.description, quantity: 1, unit_price: Number(it.price) }))
      await supabase.from('invoice_items').insert(invoiceItems)
    }
  }

  await supabase.from('offers').update({ customer_id: customerId }).eq('id', offerId)
  return { ok: true as const, customerId }
}

export function offerIsExpired(expiresAt: string | null | undefined) {
  return !!expiresAt && new Date(expiresAt).getTime() < Date.now()
}

