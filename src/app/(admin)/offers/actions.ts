'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { realizeOfferRecords, offerIsExpired } from '@/lib/crm/offers'
import { appUrl, sendEmail } from '@/lib/crm/mailer'
import { offerCustomerHtml } from '@/lib/offer-emails'

export async function createOffer(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const targetType = formData.get('target_type') as string
  const customerId = targetType === 'customer' ? formData.get('customer_id') as string : null
  let leadId = targetType === 'lead' ? formData.get('lead_id') as string : null

  if (targetType === 'new') {
    const newName = formData.get('new_name') as string
    const newEmail = formData.get('new_email') as string
    const newPhone = formData.get('new_phone') as string
    
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert([{ name: newName, email: newEmail, phone: newPhone, status: 'felkeresendo' }])
      .select()
      .single()

    if (leadError || !newLead) {
      return { error: 'Hiba az új érdeklődő rögzítésekor.' }
    }
    leadId = newLead.id
  }
  const status = formData.get('status') as string
  const paymentType = formData.get('payment_type') as string || 'one_time'
  const installmentMonthsRaw = formData.get('installment_months')
  const installmentMonths = paymentType === 'installments' && installmentMonthsRaw ? parseInt(installmentMonthsRaw as string, 10) : null
  const subscriptionPlanName = paymentType === 'subscription' ? formData.get('subscription_plan_name') as string : null
  const subscriptionNote = paymentType === 'subscription' ? (formData.get('subscription_note') as string || null) : null
  const expiresAtRaw = formData.get('expires_at') as string
  const expiresAt = expiresAtRaw ? `${expiresAtRaw}T23:59:59Z` : null

  const itemsJson = formData.get('items') as string
  const items = itemsJson ? JSON.parse(itemsJson) : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalAmount = items.reduce((sum: number, item: any) => sum + Number(item.price), 0)

  // 1. Create offer
  const { data: offer, error: offerError } = await supabase
    .from('offers')
    .insert([{
      customer_id: customerId,
      lead_id: leadId,
      status,
      total_amount: totalAmount,
      payment_type: paymentType,
      installment_months: installmentMonths,
      subscription_plan_name: subscriptionPlanName,
      subscription_note: subscriptionNote,
      expires_at: expiresAt,
    }])
    .select()
    .single()

  if (offerError || !offer) {
    console.error('Error creating offer:', offerError)
    return { error: offerError?.message || 'Error creating offer' }
  }

  // 2. Create offer items
  if (items.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offerItemsToInsert = items.map((item: any, position: number) => ({
      offer_id: offer.id,
      position,
      description: item.description,
      price: Number(item.price)
    }))
    
    const { error: itemsError } = await supabase
      .from('offer_items')
      .insert(offerItemsToInsert)

    if (itemsError) {
      console.error('Error creating offer items:', itemsError)
    }
  }

  revalidatePath('/offers')
  if (customerId) revalidatePath(`/partners/${customerId}`)
  if (leadId) revalidatePath(`/leads/${leadId}`)
  redirect('/offers')
}

export async function updateOffer(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const targetType = formData.get('target_type') as string
  const customerId = targetType === 'customer' ? formData.get('customer_id') as string : null
  let leadId = targetType === 'lead' ? formData.get('lead_id') as string : null

  if (targetType === 'new') {
    const newName = formData.get('new_name') as string
    const newEmail = formData.get('new_email') as string
    const newPhone = formData.get('new_phone') as string
    
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert([{ name: newName, email: newEmail, phone: newPhone, status: 'felkeresendo' }])
      .select()
      .single()

    if (leadError || !newLead) {
      return { error: 'Hiba az új érdeklődő rögzítésekor.' }
    }
    leadId = newLead.id
  }
  const status = formData.get('status') as string
  const paymentType = formData.get('payment_type') as string || 'one_time'
  const installmentMonthsRaw = formData.get('installment_months')
  const installmentMonths = paymentType === 'installments' && installmentMonthsRaw ? parseInt(installmentMonthsRaw as string, 10) : null
  const subscriptionPlanName = paymentType === 'subscription' ? formData.get('subscription_plan_name') as string : null
  const subscriptionNote = paymentType === 'subscription' ? (formData.get('subscription_note') as string || null) : null
  const expiresAtRaw = formData.get('expires_at') as string
  const expiresAt = expiresAtRaw ? `${expiresAtRaw}T23:59:59Z` : null

  const itemsJson = formData.get('items') as string
  const items = itemsJson ? JSON.parse(itemsJson) : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalAmount = items.reduce((sum: number, item: any) => sum + Number(item.price), 0)

  // 1. Update offer
  const { error: offerError } = await supabase
    .from('offers')
    .update({
      customer_id: customerId,
      lead_id: leadId,
      status,
      total_amount: totalAmount,
      payment_type: paymentType,
      installment_months: installmentMonths,
      subscription_plan_name: subscriptionPlanName,
      subscription_note: subscriptionNote,
      expires_at: expiresAt,
    })
    .eq('id', id)

  if (offerError) {
    console.error('Error updating offer:', offerError)
    return { error: offerError.message }
  }

  // 2. Delete existing items
  await supabase.from('offer_items').delete().eq('offer_id', id)

  // 3. Create new offer items
  if (items.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offerItemsToInsert = items.map((item: any, position: number) => ({
      offer_id: id,
      position,
      description: item.description,
      price: Number(item.price)
    }))
    
    await supabase.from('offer_items').insert(offerItemsToInsert)
  }

  revalidatePath('/offers')
  if (customerId) revalidatePath(`/partners/${customerId}`)
  if (leadId) revalidatePath(`/leads/${leadId}`)
  redirect('/offers')
}

export async function sendOfferEmail(id: string) {
  const supabase = await createClient()

  const { data: offer, error: fetchError } = await supabase
    .from('offers')
    .select('*, customers(name, email, billing_email, contact_name), leads(name, email), offer_items(description, price, position)')
    .eq('id', id)
    .single()
  if (fetchError || !offer) return { error: 'Az ajánlat nem található.' }
  if (offer.is_realized || offer.status === 'accepted') return { error: 'Elfogadott ajánlatot már nem lehet újra kiküldeni.' }

  const customer = Array.isArray(offer.customers) ? offer.customers[0] : offer.customers
  const lead = Array.isArray(offer.leads) ? offer.leads[0] : offer.leads
  const to = (customer?.email || customer?.billing_email || lead?.email || '').trim()
  const name = customer?.contact_name || customer?.name || lead?.name || 'Ügyfelünk'
  if (!to) return { error: 'A címzettnek nincs email címe. Add meg a partner vagy az érdeklődő adatlapján.' }

  const items = [...(offer.offer_items ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  if (!items.length) return { error: 'Az ajánlatnak nincs tétele.' }
  if (offerIsExpired(offer.expires_at)) return { error: 'Az ajánlat érvényessége lejárt. Előbb hosszabbítsd meg.' }

  let token = offer.public_token as string | null
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 16)
    const { error: tokenError } = await supabase.from('offers').update({ public_token: token }).eq('id', id)
    if (tokenError) return { error: 'Nem sikerült létrehozni az ajánlat linkjét.' }
  }

  const base = appUrl()
  const sent = await sendEmail({
    to,
    subject: 'Árajánlat az Ön számára | Weboldalas',
    html: offerCustomerHtml({
      name,
      totalAmount: Number(offer.total_amount),
      paymentType: offer.payment_type,
      installmentMonths: offer.installment_months,
      subscriptionPlanName: offer.subscription_plan_name,
      subscriptionNote: offer.subscription_note,
      expiresAt: offer.expires_at,
      items,
      publicUrl: `${base}/offers/view/${token}`,
    }, base),
  })
  if ('error' in sent) return { error: `Az email küldése nem sikerült: ${sent.error}` }

  const { error: updateError } = await supabase.from('offers').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id)
  if (updateError) return { error: 'Az email elment, de az állapot mentése nem sikerült.' }
  if (offer.lead_id) await supabase.from('leads').update({ status: 'ajanlat_kint' }).eq('id', offer.lead_id)

  revalidatePath('/offers')
  revalidatePath(`/offers/${id}`)
  if (offer.customer_id) revalidatePath(`/partners/${offer.customer_id}`)
  if (offer.lead_id) revalidatePath('/leads')
  return { success: true, to }
}

export async function realizeOffer(id: string) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const result = await realizeOfferRecords(supabase, id, userData.user?.id ?? null)
  if ('error' in result) return { error: result.error }

  revalidatePath('/offers')
  revalidatePath(`/offers/${id}`)
  revalidatePath('/invoices')
  revalidatePath('/subscriptions')
  revalidatePath('/dashboard')
  revalidatePath(`/partners/${result.customerId}`)
  revalidatePath('/leads')
  return { success: true, customerId: result.customerId }
}

export async function renewOffer(id: string, newExpiresAt: string) {
  const supabase = await createClient()

  const expiresAt = newExpiresAt ? `${newExpiresAt}T23:59:59Z` : null

  const { error } = await supabase
    .from('offers')
    .update({ status: 'sent', expires_at: expiresAt })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/offers')
  revalidatePath(`/offers/${id}`)
  return { success: true }
}

export async function deleteOffer(id: string) {
  const supabase = await createClient()

  // First fetch to know what paths to revalidate
  const { data: offer } = await supabase
    .from('offers')
    .select('customer_id, lead_id')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('offers').delete().eq('id', id)

  if (error) {
    console.error('Error deleting offer:', error)
    return { error: 'Hiba történt a törlés során.' }
  }

  revalidatePath('/offers')
  if (offer?.customer_id) revalidatePath(`/partners/${offer.customer_id}`)
  if (offer?.lead_id) revalidatePath(`/leads/${offer.lead_id}`)
  
  redirect('/offers')
}
