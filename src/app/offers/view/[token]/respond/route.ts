import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { respondCustomerHtml, adminRespondHtml } from '@/lib/offer-emails'
import { offerIsExpired, realizeOfferRecords } from '@/lib/crm/offers'
import { appUrl, sendEmail } from '@/lib/crm/mailer'

type Contact = { name: string | null; email: string | null } | null
const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v)

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const body = await request.json().catch(() => ({}))
    const action = body?.action
    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ message: 'Érvénytelen művelet.' }, { status: 400 })
    }
    if (!token || token.length < 20) return NextResponse.json({ message: 'Ajánlat nem található.' }, { status: 404 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

    const { data: offer } = await supabase
      .from('offers')
      .select('id, status, expires_at, lead_id, total_amount, customers(name, email, contact_name), leads(name, email)')
      .eq('public_token', token)
      .maybeSingle()
    if (!offer) return NextResponse.json({ message: 'Ajánlat nem található.' }, { status: 404 })

    if (offer.status === 'sent' && offerIsExpired(offer.expires_at)) {
      await supabase.from('offers').update({ status: 'expired' }).eq('id', offer.id).eq('status', 'sent')
      return NextResponse.json({ message: 'Az ajánlat érvényessége lejárt. Kérjük, vegye fel velünk a kapcsolatot.' }, { status: 410 })
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected'
    // Conditional update: only the first response wins, even on a double click.
    const { data: updated, error: updateError } = await supabase
      .from('offers')
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .eq('id', offer.id)
      .eq('status', 'sent')
      .select('id')
      .maybeSingle()
    if (updateError) return NextResponse.json({ message: 'Hiba a mentés során.' }, { status: 500 })
    if (!updated) return NextResponse.json({ message: 'Erre az ajánlatra már érkezett válasz.' }, { status: 409 })

    if (offer.lead_id) {
      await supabase.from('leads').update({ status: action === 'accept' ? 'elfogadott' : 'elutasitott' }).eq('id', offer.lead_id)
    }

    if (action === 'accept') {
      const result = await realizeOfferRecords(supabase, offer.id)
      if ('error' in result) console.error('Offer realize failed', offer.id, result.error)
    }

    const customer = one(offer.customers as (Contact & { contact_name: string | null }) | (Contact & { contact_name: string | null })[] | null)
    const lead = one(offer.leads as Contact | Contact[] | null)
    const contactName = customer?.contact_name || customer?.name || lead?.name || 'Ismeretlen'
    const contactEmail = customer?.email || lead?.email || ''
    const base = appUrl()
    const adminEmail = process.env.ADMIN_EMAIL || 'lacibalda@gmail.com'

    const mails: Promise<unknown>[] = []
    if (adminEmail) {
      mails.push(sendEmail({
        to: adminEmail,
        subject: `${action === 'accept' ? 'Elfogadva' : 'Elutasítva'}: ${contactName} ajánlata`,
        html: adminRespondHtml(contactName, contactEmail, action, Number(offer.total_amount), offer.id, base),
      }))
    }
    if (contactEmail) {
      mails.push(sendEmail({
        to: contactEmail,
        subject: action === 'accept' ? 'Köszönjük, megkaptuk az elfogadást | Weboldalas' : 'Megkaptuk a visszajelzését | Weboldalas',
        html: respondCustomerHtml(contactName, action, Number(offer.total_amount), base),
      }))
    }
    await Promise.all(mails)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Respond API error:', err)
    return NextResponse.json({ message: 'Szerver hiba történt.' }, { status: 500 })
  }
}
