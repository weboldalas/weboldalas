import { NextResponse } from 'next/server'
import { appUrl, sendEmail } from '@/lib/crm/mailer'
import { esc } from '@/lib/offer-emails'
import { requestMetaFromHeaders } from '@/lib/crm/request-meta'
import { serviceClient } from '@/lib/crm/service'

const MAX_SIGNATURE_LENGTH = 600_000

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await request.json().catch(() => ({}))
  const signature = typeof body?.signature === 'string' ? body.signature : ''
  const signerEmail = typeof body?.partnerEmail === 'string' ? body.partnerEmail.slice(0, 200) : null

  if (!signature.startsWith('data:image/png;base64,') || signature.length > MAX_SIGNATURE_LENGTH) {
    return NextResponse.json({ error: 'Érvénytelen aláírás. Kérjük, próbálja újra.' }, { status: 400 })
  }

  const supabase = serviceClient()
  const { data: doc } = await supabase.from('documents').select('id, title, status').eq('public_token', token).maybeSingle()
  if (!doc) return NextResponse.json({ error: 'A dokumentum nem található.' }, { status: 404 })
  if (doc.status === 'signed') return NextResponse.json({ error: 'Ezt a dokumentumot már aláírták.' }, { status: 409 })

  const [{ data: version }, { data: settings }] = await Promise.all([
    supabase.from('document_versions').select('id').eq('document_id', doc.id).order('version', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('company_settings').select('owner_signature').limit(1).maybeSingle(),
  ])
  if (!version) return NextResponse.json({ error: 'A dokumentumnak nincs aláírható változata.' }, { status: 409 })

  const now = new Date().toISOString()
  // Lock first, conditionally, so two parallel signatures cannot both succeed.
  const { data: locked } = await supabase
    .from('documents')
    .update({ status: 'signed', locked_at: now })
    .eq('id', doc.id)
    .neq('status', 'signed')
    .select('id')
    .maybeSingle()
  if (!locked) return NextResponse.json({ error: 'Ezt a dokumentumot már aláírták.' }, { status: 409 })

  const { error: versionError } = await supabase
    .from('document_versions')
    .update({ client_signature: signature, company_signature: settings?.owner_signature ?? null, signed_at: now })
    .eq('id', version.id)
  if (versionError) {
    await supabase.from('documents').update({ status: doc.status, locked_at: null }).eq('id', doc.id)
    return NextResponse.json({ error: 'Az aláírás mentése nem sikerült.' }, { status: 500 })
  }

  const meta = requestMetaFromHeaders(request.headers)
  await supabase.from('document_activity').insert({
    document_id: doc.id,
    action: 'signed',
    description: `Partner aláírta${signerEmail ? ` (${signerEmail})` : ''} · IP: ${meta.ip}`,
    metadata: meta,
  })

  const adminEmail = process.env.ADMIN_EMAIL || 'lacibalda@gmail.com'
  await sendEmail({
    to: adminEmail,
    subject: `Aláírva: ${String(doc.title).replace(/[\r\n]+/g, ' ')}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#1a1a1a"><h2 style="margin:0 0 12px">A partner aláírta a szerződést</h2><p style="color:#444;line-height:1.6"><strong>${esc(doc.title)}</strong></p><p><a href="${appUrl()}/contracts/${doc.id}" style="display:inline-block;background:#7c4dff;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Megnyitás a CRM-ben</a></p></div>`,
  })

  return NextResponse.json({ success: true })
}
