import { NextResponse } from 'next/server'
import { getStaffUser } from '@/lib/crm/auth'
import { Resend } from 'resend'
import { esc } from '@/lib/offer-emails'


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })

  const body = await request.json()
  const recipientEmail: string = body.recipientEmail
  const pdfUrl: string = body.pdfUrl
  const title: string = body.title || 'Szerződés'

  if (!recipientEmail || !pdfUrl) {
    return NextResponse.json({ error: 'Hiányzó e-mail cím vagy PDF URL.' }, { status: 400 })
  }
  if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(recipientEmail.trim())) {
    return NextResponse.json({ error: 'Érvénytelen e-mail cím.' }, { status: 400 })
  }
  // Only our own contract PDFs may be fetched and attached (no arbitrary URLs).
  const allowedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/contracts/${id}/`
  if (!pdfUrl.startsWith(allowedPrefix)) {
    return NextResponse.json({ error: 'Érvénytelen PDF hivatkozás. Generáld újra a PDF-et.' }, { status: 400 })
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

  // Created per request, not at module load: a missing key must not break `next build`
  // (e.g. preview deployments without RESEND_API_KEY), only this endpoint.
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ error: 'Az email küldés nincs beállítva (RESEND_API_KEY hiányzik).' }, { status: 500 })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error: sendError } = await resend.emails.send({
      from: 'Weboldalas.hu <info@weboldalas.hu>',
      to: recipientEmail.trim(),
      subject: `Szerződés: ${title.replace(/[\r\n]+/g, ' ')}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Tisztelt Partnerünk!</h2>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-bottom: 24px;">
            Csatoltan küldjük a(z) <strong>${esc(title)}</strong> dokumentumot.
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
