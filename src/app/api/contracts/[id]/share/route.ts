import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getStaffUser } from '@/lib/crm/auth'
import { appUrl } from '@/lib/crm/mailer'
import { requestMetaFromHeaders } from '@/lib/crm/request-meta'
import { serviceClient } from '@/lib/crm/service'

/** Creates (or reuses) the public link where the partner can read, sign or ask for changes. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })

  const supabase = serviceClient()
  const { data: doc } = await supabase.from('documents').select('id, status, public_token').eq('id', id).maybeSingle()
  if (!doc) return NextResponse.json({ error: 'A dokumentum nem található.' }, { status: 404 })

  let token = doc.public_token as string | null
  if (!token) {
    token = randomBytes(24).toString('base64url')
    const { error } = await supabase.from('documents').update({ public_token: token }).eq('id', id)
    if (error) return NextResponse.json({ error: 'A megosztási link mentése nem sikerült. Lefutott a CRM migráció?' }, { status: 500 })
  }

  if (doc.status !== 'signed') {
    await supabase.from('documents').update({ status: 'sent' }).eq('id', id).neq('status', 'signed')
  }
  await supabase.from('document_activity').insert({
    document_id: id,
    action: 'shared',
    description: 'Aláírási link létrehozva',
    metadata: requestMetaFromHeaders(request.headers),
  })

  return NextResponse.json({ url: `${appUrl()}/contracts/view/${token}` })
}
