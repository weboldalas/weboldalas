import { NextResponse } from 'next/server'
import { appUrl, sendEmail } from '@/lib/crm/mailer'
import { esc } from '@/lib/offer-emails'
import { requestMetaFromHeaders } from '@/lib/crm/request-meta'
import { serviceClient } from '@/lib/crm/service'

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await request.json().catch(() => ({}))
  const note = typeof body?.reviewNote === 'string' ? body.reviewNote.trim().slice(0, 4000) : ''
  if (!note) return NextResponse.json({ error: 'Kérjük, írja le, mit módosítanánk.' }, { status: 400 })

  const supabase = serviceClient()
  const { data: doc } = await supabase.from('documents').select('id, title, status').eq('public_token', token).maybeSingle()
  if (!doc) return NextResponse.json({ error: 'A dokumentum nem található.' }, { status: 404 })
  if (doc.status === 'signed') return NextResponse.json({ error: 'Aláírt dokumentumon már nem kérhető módosítás.' }, { status: 409 })

  const { error } = await supabase
    .from('documents')
    .update({ status: 'review_requested', review_note: note, review_requested_at: new Date().toISOString() })
    .eq('id', doc.id)
    .neq('status', 'signed')
  if (error) return NextResponse.json({ error: 'A kérés mentése nem sikerült.' }, { status: 500 })

  const meta = requestMetaFromHeaders(request.headers)
  await supabase.from('document_activity').insert({
    document_id: doc.id,
    action: 'review_requested',
    description: `Módosítást kért: ${note.slice(0, 300)}`,
    metadata: meta,
  })

  const adminEmail = process.env.ADMIN_EMAIL || 'lacibalda@gmail.com'
  await sendEmail({
    to: adminEmail,
    subject: `Módosítást kértek: ${String(doc.title).replace(/[\r\n]+/g, ' ')}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#1a1a1a"><h2 style="margin:0 0 12px">A partner módosítást kért</h2><p style="color:#444"><strong>${esc(doc.title)}</strong></p><blockquote style="margin:16px 0;padding:12px 16px;background:#f5f3ff;border-left:3px solid #7c4dff;border-radius:6px;white-space:pre-wrap;color:#333">${esc(note)}</blockquote><p><a href="${appUrl()}/contracts/${doc.id}" style="display:inline-block;background:#7c4dff;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Megnyitás a CRM-ben</a></p></div>`,
  })

  return NextResponse.json({ success: true })
}
