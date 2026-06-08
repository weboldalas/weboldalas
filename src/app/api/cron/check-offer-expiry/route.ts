import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { expiryCustomerHtml, expiryAdminHtml } from '@/lib/offer-emails'

const RESEND_API_KEY = process.env.RESEND_API_KEY!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'lacibalda@gmail.com'
const FROM_EMAIL = 'Weboldalas <noreply@weboldalas.hu>'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  })
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const tomorrowDate = new Date(now); tomorrowDate.setDate(now.getDate() + 1)
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0]
  const dayAfterDate = new Date(tomorrowDate); dayAfterDate.setDate(tomorrowDate.getDate() + 1)
  const dayAfterStr = dayAfterDate.toISOString().split('T')[0]

  let expired = 0, remindedToday = 0, remindedTomorrow = 0

  // 1. Lejárt ajánlatok (tegnap vagy korábban) → 'expired' státusz + értesítés
  const { data: toExpire } = await supabase
    .from('offers')
    .select('*, customers(name, email), leads(name, email)')
    .eq('status', 'sent')
    .not('expires_at', 'is', null)
    .lt('expires_at', `${todayStr}T00:00:00Z`)

  for (const offer of (toExpire || [])) {
    await supabase.from('offers').update({ status: 'expired' }).eq('id', offer.id)
    const name  = offer.customers?.name  || offer.leads?.name  || 'Ügyfél'
    const email = offer.customers?.email || offer.leads?.email
    const publicUrl = `${APP_URL}/offers/view/${offer.public_token}`
    if (email) await sendEmail(email, 'Ajánlata lejárt – Weboldalas', expiryCustomerHtml(name, publicUrl, 'expired', APP_URL))
    await sendEmail(ADMIN_EMAIL, `❌ Lejárt ajánlat – ${name}`, expiryAdminHtml(name, email || '', Number(offer.total_amount), offer.id, 'expired', APP_URL))
    expired++
  }

  // 2. Ma lejáró ajánlatok → utolsó nap emlékeztető
  const { data: expiringToday } = await supabase
    .from('offers')
    .select('*, customers(name, email), leads(name, email)')
    .eq('status', 'sent')
    .not('expires_at', 'is', null)
    .gte('expires_at', `${todayStr}T00:00:00Z`)
    .lt('expires_at', `${tomorrowStr}T00:00:00Z`)

  for (const offer of (expiringToday || [])) {
    const name  = offer.customers?.name  || offer.leads?.name  || 'Ügyfél'
    const email = offer.customers?.email || offer.leads?.email
    const publicUrl = `${APP_URL}/offers/view/${offer.public_token}`
    if (email) await sendEmail(email, '🔔 Ajánlata ma jár le – Weboldalas', expiryCustomerHtml(name, publicUrl, 'today', APP_URL))
    await sendEmail(ADMIN_EMAIL, `🔔 Ajánlat ma jár le – ${name}`, expiryAdminHtml(name, email || '', Number(offer.total_amount), offer.id, 'today', APP_URL))
    remindedToday++
  }

  // 3. Holnap lejáró ajánlatok → 1 napos emlékeztető
  const { data: expiringTomorrow } = await supabase
    .from('offers')
    .select('*, customers(name, email), leads(name, email)')
    .eq('status', 'sent')
    .not('expires_at', 'is', null)
    .gte('expires_at', `${tomorrowStr}T00:00:00Z`)
    .lt('expires_at', `${dayAfterStr}T00:00:00Z`)

  for (const offer of (expiringTomorrow || [])) {
    const name  = offer.customers?.name  || offer.leads?.name  || 'Ügyfél'
    const email = offer.customers?.email || offer.leads?.email
    const publicUrl = `${APP_URL}/offers/view/${offer.public_token}`
    if (email) await sendEmail(email, '⏰ Ajánlata holnap jár le – Weboldalas', expiryCustomerHtml(name, publicUrl, 'tomorrow', APP_URL))
    await sendEmail(ADMIN_EMAIL, `⏰ Ajánlat holnap jár le – ${name}`, expiryAdminHtml(name, email || '', Number(offer.total_amount), offer.id, 'tomorrow', APP_URL))
    remindedTomorrow++
  }

  return NextResponse.json({ expired, remindedToday, remindedTomorrow })
}
