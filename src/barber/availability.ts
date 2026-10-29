import { bookingRules, closedDates, openingHours, type Service } from './config'
import { addDays, dateKeyOf, hhmmToMinutes, minutesToHhmm, weekdayOf, zonedToUtc } from './time'
import type { Booking } from './types'

export type Slot = { time: string; startsAt: string }
export type DayAvailability = { date: string; open: boolean; slots: Slot[] }

const MIN = 60_000

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd
}

/** First and last bookable day keys, as seen from `now` */
export function bookingWindow(now: Date) {
  const first = dateKeyOf(now)
  return { first, last: addDays(first, bookingRules.horizonDays - 1) }
}

export function slotsForDay(dateKey: string, service: Service, bookings: Booking[], now: Date): Slot[] {
  const { first, last } = bookingWindow(now)
  if (dateKey < first || dateKey > last) return []
  if (closedDates.includes(dateKey)) return []

  const hours = openingHours[weekdayOf(dateKey)]
  if (!hours) return []

  const open = hhmmToMinutes(hours.open)
  const close = hhmmToMinutes(hours.close)
  const breaks = (hours.breaks ?? []).map((b) => [hhmmToMinutes(b.from), hhmmToMinutes(b.to)] as const)
  const earliest = now.getTime() + bookingRules.minLeadMin * MIN
  const taken = bookings
    .filter((b) => b.status === 'confirmed')
    .map((b) => [Date.parse(b.startsAt), Date.parse(b.blocksUntil)] as const)

  const slots: Slot[] = []
  for (let m = open; m + service.durationMin <= close; m += bookingRules.slotStepMin) {
    const end = m + service.durationMin
    if (breaks.some(([from, to]) => overlaps(m, end, from, to))) continue

    const start = zonedToUtc(dateKey, m).getTime()
    if (start < earliest) continue

    const blockEnd = start + (service.durationMin + bookingRules.bufferMin) * MIN
    if (taken.some(([s, e]) => overlaps(start, blockEnd, s, e))) continue

    slots.push({ time: minutesToHhmm(m), startsAt: new Date(start).toISOString() })
  }
  return slots
}

/** Availability for every day in the booking window, for the calendar view */
export function availabilityForWindow(service: Service, bookings: Booking[], now: Date): DayAvailability[] {
  const { first } = bookingWindow(now)
  return Array.from({ length: bookingRules.horizonDays }, (_, i) => {
    const date = addDays(first, i)
    const slots = slotsForDay(date, service, bookings, now)
    return { date, open: slots.length > 0, slots }
  })
}

/** Instant range that covers the whole booking window, for one store query */
export function windowRange(now: Date) {
  const { first, last } = bookingWindow(now)
  return { from: zonedToUtc(first, 0), to: zonedToUtc(addDays(last, 1), 0) }
}

/** Is this exact start time offered for the service right now? Server-side guard. */
export function isSlotAvailable(startsAt: Date, service: Service, bookings: Booking[], now: Date) {
  const iso = startsAt.toISOString()
  return slotsForDay(dateKeyOf(startsAt), service, bookings, now).some((s) => s.startsAt === iso)
}
