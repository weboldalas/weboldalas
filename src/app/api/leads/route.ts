import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  // We use the service role key here to bypass RLS and insert the lead securely from the server
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  )
  try {
    const body = await request.json()
    const { name, email, phone, message, interest_type } = body

    if (!name) {
      return NextResponse.json({ error: 'Név megadása kötelező' }, { status: 400 })
    }

    // 1. Save to database
    const { data: lead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          note: message,
          source: 'weboldal',
          status: 'felkeresendo',
          interest_type: interest_type || null,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting lead:', insertError)
      return NextResponse.json({ error: 'Hiba történt a mentés során' }, { status: 500 })
    }

    // 2. Call Supabase Edge Function to send email
    const { error: fnError } = await supabaseAdmin.functions.invoke('notify-new-lead', {
      body: { name, email, phone, message, interest_type },
    })

    if (fnError) {
      // We don't fail the request if email fails, but we log it
      console.error('Error sending email notification:', fnError)
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Belső szerverhiba' }, { status: 500 })
  }
}
