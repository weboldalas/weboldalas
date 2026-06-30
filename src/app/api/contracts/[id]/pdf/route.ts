import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generatePdfBuffer } from './pdf-generator'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Auth check via SSR client
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
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const content: string = body.content || ''
  const title: string = body.title || 'Szerződés'

  // Generate PDF buffer
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generatePdfBuffer(content, title)
  } catch (err) {
    console.error('PDF render error:', err)
    return NextResponse.json({ error: 'PDF generálás sikertelen.' }, { status: 500 })
  }

  // Upload to Supabase Storage using service role key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileName = `${id}/${Date.now()}.pdf`
  const { error: uploadError } = await supabaseAdmin.storage
    .from('contracts')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'PDF feltöltés sikertelen.' }, { status: 500 })
  }

  // Get signed URL (valid 10 years)
  const { data: signedData, error: signError } = await supabaseAdmin.storage
    .from('contracts')
    .createSignedUrl(fileName, 60 * 60 * 24 * 365 * 10)

  if (signError || !signedData) {
    console.error('Signed URL error:', signError)
    return NextResponse.json({ error: 'PDF URL generálás sikertelen.' }, { status: 500 })
  }

  return NextResponse.json({ url: signedData.signedUrl })
}
