import { barber } from './config'

// The server runs in UTC, the shop runs in Budapest time. These helpers convert
// between a Budapest wall-clock time and real instants without extra packages.

const TZ = barber.timeZone

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function zonedParts(date: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]))
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    second: Number(p.second),
  }
}

// Offset of the shop's time zone from UTC at a given instant, in ms
function offsetAt(date: Date) {
  const p = zonedParts(date)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/** "YYYY-MM-DD" + minutes since local midnight → the real instant */
export function zonedToUtc(dateKey: string, minutes: number): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  const naive = Date.UTC(y, m - 1, d, 0, minutes)
  const first = naive - offsetAt(new Date(naive))
  // second pass settles DST edges
  return new Date(naive - offsetAt(new Date(first)))
}

/** Instant → "YYYY-MM-DD" in shop time */
export function dateKeyOf(date: Date) {
  const p = zonedParts(date)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** Instant → minutes since local midnight in shop time */
export function minutesOf(date: Date) {
  const p = zonedParts(date)
  return p.hour * 60 + p.minute
}

export function hhmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function minutesToHhmm(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

/** Weekday (0 = Sunday) of a "YYYY-MM-DD" key — calendar math, zone independent */
export function weekdayOf(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export function addDays(dateKey: string, days: number) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return next.toISOString().slice(0, 10)
}

export function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

const longDate = new Intl.DateTimeFormat('hu-HU', {
  timeZone: TZ,
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const timeFmt = new Intl.DateTimeFormat('hu-HU', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })

export function formatLongDate(date: Date) {
  return longDate.format(date)
}

export function formatTime(date: Date) {
  return timeFmt.format(date)
}
