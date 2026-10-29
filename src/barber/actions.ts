'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { z } from 'zod'
import { isSlotAvailable } from './availability'
import { bookingRules, getService } from './config'
import { checkPin, endAdminSession, isAdmin, startAdminSession } from './admin-auth'
import { sendBookingEmails, sendCancellationEmails } from './email'
import { getStore } from './store'
import { dateKeyOf, hhmmToMinutes, isDateKey, zonedToUtc } from './time'
import type { NewBooking } from './types'

const MIN = 60_000

async function siteUrl() {
  if (process.env.BARBER_SITE_URL) return process.env.BARBER_SITE_URL.replace(/\/$/, '')
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

function buildBooking(
  serviceId: string,
  startsAt: Date,
  customer: { name: string; email: string | null; phone: string | null; note: string | null },
  source: NewBooking['source']
): NewBooking | null {
  const service = getService(serviceId)
  if (!service) return null
  const start = startsAt.getTime()
  return {
    serviceId: service.id,
    serviceName: service.name,
    durationMin: service.durationMin,
    priceHuf: service.priceHuf,
    startsAt: startsAt.toISOString(),
    endsAt: new Date(start + service.durationMin * MIN).toISOString(),
    blocksUntil: new Date(start + (service.durationMin + bookingRules.bufferMin) * MIN).toISOString(),
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    note: customer.note,
    source,
  }
}

// ---------- customer booking ----------

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  startsAt: z.iso.datetime(),
  name: z.string().trim().min(2, 'Add meg a neved.').max(80),
  email: z.email('Érvényes e-mail címet adj meg.').max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{8,20}$/, 'Érvényes telefonszámot adj meg.'),
  note: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(), // honeypot, must stay empty
})

export type BookingInput = z.input<typeof bookingSchema>

export type BookingResult =
  | { ok: true; token: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; slotTaken?: boolean }

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    return { ok: false, error: 'Nézd át a kiemelt mezőket.', fieldErrors }
  }
  const data = parsed.data
  const service = getService(data.serviceId)
  if (!service) return { ok: false, error: 'Ismeretlen szolgáltatás.' }

  const startsAt = new Date(data.startsAt)
  const store = getStore()
  const now = new Date()
  const dayStart = zonedToUtc(dateKeyOf(startsAt), 0)
  const dayEnd = new Date(dayStart.getTime() + 36 * 60 * MIN)
  const existing = await store.listActive(dayStart, dayEnd)

  // re-check on the server: opening hours, lead time, breaks, overlaps
  if (!isSlotAvailable(startsAt, service, existing, now)) {
    return { ok: false, slotTaken: true, error: 'Ezt az időpontot közben lefoglalták. Válassz egy másikat.' }
  }

  const draft = buildBooking(
    service.id,
    startsAt,
    { name: data.name, email: data.email.toLowerCase(), phone: data.phone, note: data.note || null },
    'online'
  )!
  const result = await store.create(draft)
  if (!result.ok) {
    return { ok: false, slotTaken: true, error: 'Ezt az időpontot közben lefoglalták. Válassz egy másikat.' }
  }

  const manageUrl = `${await siteUrl()}/barber/foglalas/${result.booking.token}`
  // emails go out after the response, the customer doesn't wait for Resend
  after(() => sendBookingEmails(result.booking, manageUrl))
  revalidatePath('/barber/admin')
  return { ok: true, token: result.booking.token }
}

export async function cancelBookingByToken(token: string): Promise<{ ok: boolean; error?: string }> {
  const store = getStore()
  const booking = await store.getByToken(token)
  if (!booking || booking.status !== 'confirmed') return { ok: false, error: 'Ez a foglalás már nem aktív.' }
  const cutoff = Date.parse(booking.startsAt) - bookingRules.cancelUntilHours * 60 * MIN
  if (Date.now() > cutoff) {
    return { ok: false, error: `Az időpont előtti ${bookingRules.cancelUntilHours} órában már csak telefonon tudod lemondani.` }
  }
  await store.cancel(booking.id)
  after(() => sendCancellationEmails(booking))
  revalidatePath(`/barber/foglalas/${token}`)
  revalidatePath('/barber/admin')
  return { ok: true }
}

// ---------- admin ----------

export async function adminLogin(_prev: { error?: string } | undefined, formData: FormData) {
  const pin = String(formData.get('pin') ?? '')
  if (!checkPin(pin)) {
    await new Promise((r) => setTimeout(r, 600)) // slow down guessing
    return { error: 'Hibás PIN.' }
  }
  await startAdminSession()
  redirect('/barber/admin')
}

export async function adminLogout() {
  await endAdminSession()
  redirect('/barber/admin')
}

export async function adminCancel(formData: FormData) {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  const id = String(formData.get('id') ?? '')
  const store = getStore()
  const booking = await store.getById(id)
  if (!booking || booking.status !== 'confirmed') return
  await store.cancel(id)
  after(() => sendCancellationEmails(booking))
  revalidatePath('/barber/admin')
}

const adminBookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().refine(isDateKey),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(20).optional(),
})

export async function adminCreate(_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  const parsed = adminBookingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Hiányzó vagy hibás adat.' }
  const { serviceId, date, time, name, phone } = parsed.data
  // walk-ins and phone bookings may ignore opening hours and lead time,
  // only real overlaps are refused
  const draft = buildBooking(serviceId, zonedToUtc(date, hhmmToMinutes(time)), { name, email: null, phone: phone || null, note: null }, 'admin')
  if (!draft) return { error: 'Ismeretlen szolgáltatás.' }
  const result = await getStore().create(draft)
  if (!result.ok) return { error: 'Ütközik egy meglévő foglalással.' }
  revalidatePath('/barber/admin')
  return { ok: true }
}
