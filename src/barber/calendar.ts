import { barber } from './config'
import type { Booking } from './types'

function icsDate(iso: string) {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function icsText(value: string) {
  return value.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

/** iCalendar file for one appointment (email attachment + "add to calendar") */
export function bookingIcs(booking: Booking, method: 'REQUEST' | 'CANCEL' | 'PUBLISH' = 'PUBLISH') {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vagvolgyi Barber//Booking//HU',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${booking.id}@barber`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(booking.startsAt)}`,
    `DTEND:${icsDate(booking.endsAt)}`,
    `SUMMARY:${icsText(`${booking.serviceName} — ${barber.name}`)}`,
    `LOCATION:${icsText(barber.address)}`,
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText(`${booking.serviceName} — ${barber.name}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
