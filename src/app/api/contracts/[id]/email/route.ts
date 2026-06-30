import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const recipientEmail: string = body.recipientEmail
  const pdfUrl: string = body.pdfUrl
  const title: string = body.title || 'Szerződés'

  if (!recipientEmail || !pdfUrl) {
    return NextResponse.json({ error: 'Hiányzó e-mail cím vagy PDF URL.' }, { status: 400 })
  }

  // Fetch PDF as buffer for attachment
  let pdfBuffer: Buffer
  try {
    const pdfRes = await fetch(pdfUrl)
    if (!pdfRes.ok) throw new Error('PDF letöltés sikertelen')
    const arrayBuffer = await pdfRes.arrayBuffer()
    pdfBuffer = Buffer.from(arrayBuffer)
  } catch (err) {
    console.error('PDF fetch error:', err)
    return NextResponse.json({ error: 'PDF letöltés sikertelen az email küldéséhez.' }, { status: 500 })
  }

  const fileName = `${title.replace(/[^a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s-]/g, '').trim()}.pdf`

  try {
    const { error: sendError } = await resend.emails.send({
      from: 'Weboldalas.hu <info@weboldalas.hu>',
      to: recipientEmail,
      subject: `Szerződés: ${title}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Tisztelt Partnerünk!</h2>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-bottom: 24px;">
            Csatoltan küldjük a(z) <strong>${title}</strong> dokumentumot.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-bottom: 32px;">
            Kérjük, olvassa el, és amennyiben bármilyen kérdése van, forduljon hozzánk bizalommal!
          </p>
          <p style="font-size: 14px; color: #888; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            Üdvözlettel,<br/>
            <strong>Weboldalas.hu csapata</strong><br/>
            <a href="https://weboldalas.hu" style="color: #6d28d9;">weboldalas.hu</a>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json({ error: 'Email küldés sikertelen.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Email küldés sikertelen.' }, { status: 500 })
  }
}
