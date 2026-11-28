import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStaffUser } from '@/lib/crm/auth'

export async function PUT(request: Request) {
  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })

  const body = await request.json()
  const { id, ...raw } = body ?? {}
  if (typeof id !== 'string') return NextResponse.json({ error: 'Hiányzó azonosító.' }, { status: 400 })
  // Never let the client overwrite keys or timestamps.
  const data = Object.fromEntries(Object.entries(raw).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key)))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('company_settings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
