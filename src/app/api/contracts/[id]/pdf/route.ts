import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generatePdfBuffer } from './pdf-generator'

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
  const content: string = body.content || ''
  const title: string = body.title || 'Szerződés'
  const companySettings = body.companySettings ?? null
  const clientSignature: string | null = body.clientSignature ?? null
  const companySignature: string | null = body.companySignature ?? null

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generatePdfBuffer({ content, title, companySettings, clientSignature, companySignature })
  } catch (err) {
    console.error('PDF render error:', err)
    return NextResponse.json({ error: 'PDF generálás sikertelen.' }, { status: 500 })
  }

  // SHA-256 hash for integrity verification
  const hash = createHash('sha256').update(pdfBuffer).digest('hex')

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileName = `${id}/${Date.now()}.pdf`
  const { error: uploadError } = await supabaseAdmin.storage
    .from('contracts')
    .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'PDF feltöltés sikertelen.' }, { status: 500 })
  }

  const { data: signedData, error: signError } = await supabaseAdmin.storage
    .from('contracts')
    .createSignedUrl(fileName, 60 * 60 * 24 * 365 * 10)

  if (signError || !signedData) {
    return NextResponse.json({ error: 'PDF URL generálás sikertelen.' }, { status: 500 })
  }

  return NextResponse.json({ url: signedData.signedUrl, fileName, hash })
}
