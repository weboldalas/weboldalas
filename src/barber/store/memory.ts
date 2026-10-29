import { randomBytes, randomUUID } from 'node:crypto'
import { bookingRules, closedDates, openingHours, services } from '../config'
import { addDays, dateKeyOf, hhmmToMinutes, weekdayOf, zonedToUtc } from '../time'
import type { Booking, BookingStore, CreateResult, NewBooking } from '../types'

// Demo store: lives in server memory, so data resets on redeploy and is not
// shared between serverless instances. Good for showing the concept, not for
// real customers — set BARBER_STORE=supabase for that.

const MIN = 60_000

type MemoryState = { bookings: Booking[]; seeded: boolean }
const globalState = globalThis as unknown as { __barberMemory?: MemoryState }
const state: MemoryState = (globalState.__barberMemory ??= { bookings: [], seeded: false })

const demoNames = ['Bence K.', 'Máté S.', 'Dávid H.', 'Levente P.', 'Gergő T.', 'Ádám N.', 'Zsolt V.', 'Marcell B.']
const demoTimes = ['10:00', '11:15', '12:30', '15:00', '16:30', '17:45', '09:30', '11:00']

function seed() {
  if (state.seeded) return
  state.seeded = true
  // a realistic, deterministic sprinkle of bookings so the calendar isn't empty
  const today = dateKeyOf(new Date())
  for (let day = 0; day < 21; day++) {
    const dateKey = addDays(today, day)
    const hours = closedDates.includes(dateKey) ? null : openingHours[weekdayOf(dateKey)]
    if (!hours) continue
    for (let i = 0; i < 4; i++) {
      const pick = (day * 7 + i * 3) % 8
      if ((day + i) % 3 === 0) continue
      const service = services[(day + i) % services.length]
      const start = hhmmToMinutes(demoTimes[pick])
      if (start < hhmmToMinutes(hours.open) || start + service.durationMin > hhmmToMinutes(hours.close)) continue
      const startsAt = zonedToUtc(dateKey, start)
      void createSync({
        serviceId: service.id,
        serviceName: service.name,
        durationMin: service.durationMin,
        priceHuf: service.priceHuf,
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() + service.durationMin * MIN).toISOString(),
        blocksUntil: new Date(startsAt.getTime() + (service.durationMin + bookingRules.bufferMin) * MIN).toISOString(),
        customerName: demoNames[(day + i) % demoNames.length],
        customerEmail: null,
        customerPhone: null,
        note: null,
        source: 'online',
      })
    }
  }
}

function createSync(input: NewBooking): CreateResult {
  const start = Date.parse(input.startsAt)
  const end = Date.parse(input.blocksUntil)
  const clash = state.bookings.some(
    (b) => b.status === 'confirmed' && start < Date.parse(b.blocksUntil) && Date.parse(b.startsAt) < end
  )
  if (clash) return { ok: false, reason: 'conflict' }
  const booking: Booking = {
    ...input,
    id: randomUUID(),
    token: randomBytes(18).toString('base64url'),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  state.bookings.push(booking)
  return { ok: true, booking }
}

export const memoryStore: BookingStore = {
  kind: 'memory',
  async listActive(from, to) {
    seed()
    return state.bookings.filter(
      (b) => b.status === 'confirmed' && Date.parse(b.startsAt) < to.getTime() && Date.parse(b.blocksUntil) > from.getTime()
    )
  },
  async listForAdmin(from, to) {
    seed()
    return state.bookings
      .filter((b) => Date.parse(b.startsAt) >= from.getTime() && Date.parse(b.startsAt) < to.getTime())
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  },
  async create(input) {
    seed()
    // single-threaded JS: check + push cannot interleave, so this is atomic
    return createSync(input)
  },
  async getByToken(token) {
    seed()
    return state.bookings.find((b) => b.token === token) ?? null
  },
  async getById(id) {
    seed()
    return state.bookings.find((b) => b.id === id) ?? null
  },
  async cancel(id) {
    const booking = state.bookings.find((b) => b.id === id)
    if (booking) booking.status = 'cancelled'
  },
}
