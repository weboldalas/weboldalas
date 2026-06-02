'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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
      .insert([{ name: newName, email: newEmail, phone: newPhone, status: 'new' }])
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
      subscription_plan_name: subscriptionPlanName
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
    const offerItemsToInsert = items.map((item: any) => ({
      offer_id: offer.id,
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
  if (customerId) revalidatePath(`/customers/${customerId}`)
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
      .insert([{ name: newName, email: newEmail, phone: newPhone, status: 'new' }])
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
      subscription_plan_name: subscriptionPlanName
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
    const offerItemsToInsert = items.map((item: any) => ({
      offer_id: id,
      description: item.description,
      price: Number(item.price)
    }))
    
    await supabase.from('offer_items').insert(offerItemsToInsert)
  }

  revalidatePath('/offers')
  if (customerId) revalidatePath(`/customers/${customerId}`)
  if (leadId) revalidatePath(`/leads/${leadId}`)
  redirect('/offers')
}

export async function sendOfferEmail(id: string) {
  const supabase = await createClient()

  // 1. Fetch offer, customer (or lead), and items
  const { data: offer, error: fetchError } = await supabase
    .from('offers')
    .select('*, customers(*), leads(*)')
    .eq('id', id)
    .single()

  if (fetchError || !offer) {
    return { error: 'Ajánlat nem található.' }
  }

  const { data: items } = await supabase
    .from('offer_items')
    .select('*')
    .eq('offer_id', id)
    .order('created_at', { ascending: true })

  // 2. Generate secure token if missing
  let token = offer.public_token
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 16)
    const { error: tokenError } = await supabase
      .from('offers')
      .update({ public_token: token })
      .eq('id', id)

    if (tokenError) {
      return { error: 'Hiba a token generálásakor.' }
    }
  }

  // 3. Invoke Edge Function
  const targetEntity = offer.customer_id ? offer.customers : offer.leads;

  const payload = {
    offer: { ...offer, public_token: token },
    customer: targetEntity,
    items: items || []
  }

  const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-offer', {
    body: payload,
  })

  if (edgeError) {
    console.error('Edge Function error:', edgeError)
    return { error: 'Hiba az email küldésekor.' }
  }

  if (edgeData?.error) {
    console.error('Resend error:', edgeData.error)
    return { error: 'Hiba a Resend API hívásakor.' }
  }

  // 4. Update offer status to 'sent'
  const { error: updateError } = await supabase
    .from('offers')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', id)

  if (updateError) {
    return { error: 'Sikeres küldés, de a státusz frissítése nem sikerült.' }
  }

  // 5. Ha van lead, átrakjuk "Ajánlat küldve" fázisba a Kanbanban
  if (offer.lead_id) {
    await supabase
      .from('leads')
      .update({ status: 'ajanlat_kint' })
      .eq('id', offer.lead_id)
  }

  revalidatePath('/offers')
  if (offer.customer_id) revalidatePath(`/customers/${offer.customer_id}`)
  if (offer.lead_id) revalidatePath(`/leads/${offer.lead_id}`)
  revalidatePath(`/offers/${id}`)
  
  return { success: true }
}

export async function realizeOffer(id: string) {
  const supabase = await createClient()

  const { data: offer, error: fetchError } = await supabase
    .from('offers')
    .select('*, leads(*)')
    .eq('id', id)
    .single()

  if (fetchError || !offer) {
    return { error: 'Ajánlat nem található.' }
  }

  if (offer.status !== 'accepted') {
    return { error: 'Csak elfogadott ajánlatot lehet realizálni.' }
  }

  if (offer.is_realized) {
    return { error: 'Ez az ajánlat már realizálva lett.' }
  }

  let finalCustomerId = offer.customer_id

  // 1. Ha Lead, hozzunk létre Customer-t
  if (offer.lead_id && !offer.customer_id) {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert([{
        name: offer.leads.name,
        email: offer.leads.email,
        phone: offer.leads.phone
      }])
      .select()
      .single()

    if (customerError || !newCustomer) {
      return { error: 'Hiba az ügyfél létrehozásakor a leadből.' }
    }

    finalCustomerId = newCustomer.id

    // Frissítjük a Lead-et 'won' státuszra
    await supabase.from('leads').update({ status: 'won' }).eq('id', offer.lead_id)
  }

  if (!finalCustomerId) {
    return { error: 'Nincs megadva ügyfél.' }
  }

  const now = new Date()

  // 2. Pénzügyi tételek generálása
  if (offer.payment_type === 'one_time') {
    await supabase.from('payments').insert([{
      customer_id: finalCustomerId,
      amount: offer.total_amount,
      status: 'pending',
      payment_type: 'egyéb',
      due_date: now.toISOString()
    }])
  } else if (offer.payment_type === 'installments') {
    const months = offer.installment_months || 12
    const monthlyAmount = Math.round(Number(offer.total_amount) / months)

    // Létrehozunk egy installment_plan rekordot (opcionális, de kérted a tervben)
    await supabase.from('installment_plans').insert([{
      customer_id: finalCustomerId,
      total_amount: offer.total_amount,
      number_of_installments: months
    }])

    const paymentsToInsert = []
    for (let i = 0; i < months; i++) {
      const dueDate = new Date(now)
      dueDate.setMonth(now.getMonth() + i)
      paymentsToInsert.push({
        customer_id: finalCustomerId,
        amount: monthlyAmount,
        status: 'pending',
        payment_type: 'egyéb',
        due_date: dueDate.toISOString(),
        note: `${i + 1}. részlet az ajánlat alapján`
      })
    }

    await supabase.from('payments').insert(paymentsToInsert)
  } else if (offer.payment_type === 'subscription') {
    await supabase.from('subscriptions').insert([{
      customer_id: finalCustomerId,
      plan_name: offer.subscription_plan_name || 'Előfizetés',
      monthly_fee: offer.total_amount,
      status: 'active',
      start_date: now.toISOString(),
      next_billing_date: now.toISOString()
    }])
  }

  // 3. Offer frissítése (realizálva)
  const { data: userData } = await supabase.auth.getUser()
  
  const { error: updateError } = await supabase
    .from('offers')
    .update({
      is_realized: true,
      realized_at: now.toISOString(),
      realized_by: userData?.user?.id || null,
      customer_id: finalCustomerId
    })
    .eq('id', id)

  if (updateError) {
    return { error: 'Sikeres generálás, de az ajánlat státuszának mentése sikertelen.' }
  }

  revalidatePath('/offers')
  revalidatePath(`/offers/${id}`)
  revalidatePath('/payments')
  revalidatePath('/subscriptions')
  revalidatePath(`/customers/${finalCustomerId}`)
  if (offer.lead_id) revalidatePath(`/leads/${offer.lead_id}`)

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
  if (offer?.customer_id) revalidatePath(`/customers/${offer.customer_id}`)
  if (offer?.lead_id) revalidatePath(`/leads/${offer.lead_id}`)
  
  redirect('/offers')
}
