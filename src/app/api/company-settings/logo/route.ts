import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStaffUser } from '@/lib/crm/auth'

export async function POST(request: Request) {
  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const settingsId = formData.get('id') as string | null

  if (!file || !settingsId) {
    return NextResponse.json({ error: 'Hiányzó fájl vagy azonosító.' }, { status: 400 })
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'A fájl mérete maximum 2 MB lehet.' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const fileName = `logo-${Date.now()}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('company-assets')
    .upload(fileName, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicData } = supabaseAdmin.storage
    .from('company-assets')
    .getPublicUrl(fileName)

  const url = publicData.publicUrl

  await supabaseAdmin
    .from('company_settings')
    .update({ logo_url: url, updated_at: new Date().toISOString() })
    .eq('id', settingsId)

  return NextResponse.json({ url })
}
