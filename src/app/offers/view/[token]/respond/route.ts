import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { respondCustomerHtml, adminRespondHtml } from '@/lib/offer-emails'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { action } = await request.json()

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Ajánlat lekérése
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*, customers(name, email), leads(name, email, phone)')
      .eq('public_token', token)
      .single()

    if (fetchError || !offer) {
      return NextResponse.json({ message: 'Ajánlat nem található.' }, { status: 404 })
    }

    if (offer.status !== 'sent') {
      return NextResponse.json({ message: 'Ezt az ajánlatot már elbírálták.' }, { status: 400 })
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected'

    // 2. Ajánlat státusz frissítése
    const { error: updateError } = await supabase
      .from('offers')
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .eq('id', offer.id)

    if (updateError) {
      return NextResponse.json({ message: 'Hiba a mentés során.' }, { status: 500 })
    }

    // 3. Lead státusz frissítése a Kanbanban
    if (offer.lead_id) {
      await supabase
        .from('leads')
        .update({ status: action === 'accept' ? 'elfogadott' : 'elutasitott' })
        .eq('id', offer.lead_id)
    }

    // 4. Elfogadáskor automatikus pénzügyi bejegyzés
    if (action === 'accept') {
      const now = new Date()
      let finalCustomerId = offer.customer_id

      // Ha lead-hez tartozik az ajánlat, létrehozzuk az ügyfelet
      if (offer.lead_id && !offer.customer_id) {
        const lead = offer.leads as { name: string; email: string; phone: string } | null
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert([{
            name: lead?.name ?? 'Ismeretlen',
            email: lead?.email ?? null,
            phone: lead?.phone ?? null,
          }])
          .select()
          .single()

        if (newCustomer) {
          finalCustomerId = newCustomer.id
        }
      }

      if (finalCustomerId) {
        if (offer.payment_type === 'one_time') {
          await supabase.from('payments').insert([{
            customer_id: finalCustomerId,
            amount: offer.total_amount,
            status: 'pending',
            payment_type: 'egyszeri',
            due_date: now.toISOString(),
          }])
        } else if (offer.payment_type === 'installments') {
          const months = offer.installment_months || 12
          const monthlyAmount = Math.round(Number(offer.total_amount) / months)

          await supabase.from('installment_plans').insert([{
            customer_id: finalCustomerId,
            total_amount: offer.total_amount,
            number_of_installments: months,
          }])

          const paymentsToInsert = Array.from({ length: months }, (_, i) => {
            const dueDate = new Date(now)
            dueDate.setMonth(now.getMonth() + i)
            return {
              customer_id: finalCustomerId,
              amount: monthlyAmount,
              status: 'pending',
              payment_type: 'részlet',
              due_date: dueDate.toISOString(),
              note: `${i + 1}. részlet`,
            }
          })

          await supabase.from('payments').insert(paymentsToInsert)
        } else if (offer.payment_type === 'subscription') {
          await supabase.from('subscriptions').insert([{
            customer_id: finalCustomerId,
            plan_name: offer.subscription_plan_name || 'Előfizetés',
            monthly_fee: offer.total_amount,
            status: 'active',
            start_date: now.toISOString(),
            next_billing_date: now.toISOString(),
          }])
        }

        // Ajánlat frissítése: realizálva + customer_id beállítva
        await supabase
          .from('offers')
          .update({
            is_realized: true,
            realized_at: now.toISOString(),
            customer_id: finalCustomerId,
          })
          .eq('id', offer.id)
      }
    }

    // 5. Admin értesítő email
    const resendApiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'lacibalda@gmail.com'
    const fromEmail = 'Weboldalas <hello@weboldalas.hu>'

    const contactName  = offer.customers?.name  || (offer.leads as any)?.name  || 'Ismeretlen'
    const contactEmail = offer.customers?.email || (offer.leads as any)?.email || ''

    if (resendApiKey) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      // Admin email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          subject: `${action === 'accept' ? '✅ Elfogadva' : '❌ Elutasítva'} – ${contactName}`,
          html: adminRespondHtml(contactName, contactEmail, action, Number(offer.total_amount), offer.id, appUrl),
        }),
      })

      // Customer/lead email
      if (contactEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: fromEmail,
            to: [contactEmail],
            subject: `${action === 'accept' ? '✅ Ajánlat elfogadva' : 'Visszajelzés megkaptuk'} – Weboldalas`,
            html: respondCustomerHtml(contactName, action, Number(offer.total_amount), appUrl),
          }),
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Respond API Error:', err)
    return NextResponse.json({ message: 'Szerver hiba történt.' }, { status: 500 })
  }
}
