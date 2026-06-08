import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }})
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const { name, email, phone, message, interest_type } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY')
    }

    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'lacibalda@gmail.com'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Weboldalas <hello@weboldalas.hu>',
        to: ADMIN_EMAIL,
        subject: `Új érdeklődő: ${name}${interest_type ? ` — ${interest_type}` : ''}`,
        html: `
          <h2>Új érdeklődő érkezett!</h2>
          ${interest_type ? `<p><strong>Szolgáltatás:</strong> ${interest_type}</p>` : ''}
          <p><strong>Név:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || '-'}</p>
          <p><strong>Telefon:</strong> ${phone || '-'}</p>
          <p><strong>Üzenet:</strong> ${message || '-'}</p>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    })
  }
})
