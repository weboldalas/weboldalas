import { closedDates, dayNames, openingHours } from './config'
import { addDays, dateKeyOf, hhmmToMinutes, minutesOf, weekdayOf } from './time'

/** "Most nyitva · 19:00-ig" / "Zárva · Kedd 10:00-kor nyit" in shop time */
export function shopStatus(now = new Date()) {
  const today = dateKeyOf(now)
  const minutes = minutesOf(now)
  const hours = closedDates.includes(today) ? null : openingHours[weekdayOf(today)]

  if (hours && minutes >= hhmmToMinutes(hours.open) && minutes < hhmmToMinutes(hours.close)) {
    return { open: true, label: `Most nyitva · ${hours.close}-ig` }
  }

  for (let i = 0; i < 14; i++) {
    const key = addDays(today, i)
    const day = closedDates.includes(key) ? null : openingHours[weekdayOf(key)]
    if (!day) continue
    if (i === 0 && minutes >= hhmmToMinutes(day.open)) continue
    const when = i === 0 ? 'Ma' : i === 1 ? 'Holnap' : dayNames[weekdayOf(key)]
    return { open: false, label: `Zárva · ${when} ${day.open}-kor nyit` }
  }
  return { open: false, label: 'Zárva' }
}

/** "ma 15:30", "holnap 10:00", "csütörtök 11:15" */
export function relativeSlotLabel(date: Date, now = new Date()) {
  const key = dateKeyOf(date)
  const today = dateKeyOf(now)
  const time = `${String(Math.floor(minutesOf(date) / 60)).padStart(2, '0')}:${String(minutesOf(date) % 60).padStart(2, '0')}`
  if (key === today) return `ma ${time}`
  if (key === addDays(today, 1)) return `holnap ${time}`
  const [, m, d] = key.split('-').map(Number)
  return `${dayNames[weekdayOf(key)].toLowerCase()} (${m}.${String(d).padStart(2, '0')}.) ${time}`
}

/** Where a booking stands from the customer's point of view right now */
export function bookingState(booking: { startsAt: string; status: string }, cancelUntilHours: number, now = Date.now()) {
  const start = Date.parse(booking.startsAt)
  return {
    past: start < now,
    cancelled: booking.status === 'cancelled',
    cancellable: booking.status === 'confirmed' && now < start - cancelUntilHours * 3_600_000,
  }
}
