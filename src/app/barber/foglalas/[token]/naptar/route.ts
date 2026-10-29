import { bookingIcs } from '@/barber/calendar'
import { getStore } from '@/barber/store'

// GET /barber/foglalas/:token/naptar → .ics file for "add to calendar"
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const booking = await getStore().getByToken(token)
  if (!booking || booking.status !== 'confirmed') return new Response('Nem található.', { status: 404 })

  return new Response(bookingIcs(booking), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="barber-foglalas.ics"',
      'Cache-Control': 'no-store',
    },
  })
}
