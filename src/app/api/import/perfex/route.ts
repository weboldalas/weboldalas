import { NextResponse } from 'next/server'
import { getStaffUser } from '@/lib/crm/auth'
import { parsePerfexExport, preparePerfexFiles, writePerfexPlan } from '@/lib/crm/perfex-import'
import { serviceClient } from '@/lib/crm/service'

export const maxDuration = 60

/**
 * POST { tables, skip, write, mode } — preview (write=false), run the data import (write=true),
 * or mode='files': record attachments and hand out signed upload URLs. Owner/staff only.
 */
export async function POST(request: Request) {
  const user = await getStaffUser()
  if (!user) return NextResponse.json({ error: 'Nincs jogosultságod ehhez.' }, { status: 403 })

  const body = await request.json().catch(() => null)
  if (!body || !Array.isArray(body.tables)) return NextResponse.json({ error: 'Hiányzó vagy hibás export.' }, { status: 400 })
  const skip = Array.isArray(body.skip) ? body.skip.map(Number).filter(Number.isFinite) : []

  let plan
  try {
    plan = parsePerfexExport(body.tables, skip)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Az export nem olvasható.' }, { status: 400 })
  }
  if (body.mode === 'files') {
    try {
      return NextResponse.json({ uploads: await preparePerfexFiles(serviceClient(), plan) })
    } catch (err) {
      return NextResponse.json({ error: `A fájlok előkészítése nem sikerült: ${err instanceof Error ? err.message : 'ismeretlen hiba'}` }, { status: 500 })
    }
  }
  if (!body.write) return NextResponse.json({ partners: plan.partners, counts: plan.counts })

  const log: string[] = []
  try {
    const counts = await writePerfexPlan(serviceClient(), plan, line => log.push(line))
    return NextResponse.json({ ok: true, counts, log })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ismeretlen hiba.'
    const hint = /perfex_id|author_name/.test(message) ? ' Futtasd le a 20261127100000_perfex_import.sql migrációt.' : ''
    return NextResponse.json({ error: `Az import megszakadt: ${message}.${hint}`, log }, { status: 500 })
  }
}
