import { NextResponse } from 'next/server'
import { getStaffUser } from '@/lib/crm/auth'
import { markPerfexFileUploaded } from '@/lib/crm/perfex-import'
import { serviceClient } from '@/lib/crm/service'

/** POST { perfexId, size } — stores the uploaded attachment's size. Owner/staff only. */
export async function POST(request: Request) {
  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })
  const body = await request.json().catch(() => null)
  const perfexId = Number(body?.perfexId)
  const size = Number(body?.size)
  if (!Number.isInteger(perfexId) || !Number.isFinite(size)) return NextResponse.json({ error: 'Hibás adat.' }, { status: 400 })
  await markPerfexFileUploaded(serviceClient(), perfexId, size)
  return NextResponse.json({ ok: true })
}
