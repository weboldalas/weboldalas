import { NextResponse, type NextRequest } from 'next/server'
import { availabilityForWindow, windowRange } from '@/barber/availability'
import { getService } from '@/barber/config'
import { getStore } from '@/barber/store'

export const dynamic = 'force-dynamic'

// GET /barber/api/availability?service=hajvagas → free slots for the next 30 days
export async function GET(request: NextRequest) {
  const service = getService(request.nextUrl.searchParams.get('service') ?? '')
  if (!service) return NextResponse.json({ error: 'Ismeretlen szolgáltatás.' }, { status: 400 })

  const now = new Date()
  const { from, to } = windowRange(now)
  const bookings = await getStore().listActive(from, to)
  const days = availabilityForWindow(service, bookings, now)

  return NextResponse.json({ days }, { headers: { 'Cache-Control': 'no-store' } })
}
