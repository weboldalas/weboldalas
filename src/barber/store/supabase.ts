import { randomBytes } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Booking, BookingStore } from '../types'

// Production store: table `barber_bookings` (see supabase/migrations). The
// table has RLS on with no policies, so only this server-side service-role
// client can touch it. Double bookings are prevented by an exclusion
// constraint in Postgres, not just by the availability check.

type Row = {
  id: string
  token: string
  service_id: string
  service_name: string
  duration_min: number
  price_huf: number
  starts_at: string
  ends_at: string
  blocks_until: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  note: string | null
  status: Booking['status']
  source: Booking['source']
  created_at: string
}

let client: SupabaseClient | null = null
function db() {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  return client.from('barber_bookings')
}

function fromRow(r: Row): Booking {
  return {
    id: r.id,
    token: r.token,
    serviceId: r.service_id,
    serviceName: r.service_name,
    durationMin: r.duration_min,
    priceHuf: r.price_huf,
    startsAt: new Date(r.starts_at).toISOString(),
    endsAt: new Date(r.ends_at).toISOString(),
    blocksUntil: new Date(r.blocks_until).toISOString(),
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    note: r.note,
    status: r.status,
    source: r.source,
    createdAt: r.created_at,
  }
}

function fail(error: { message: string }): never {
  throw new Error(`barber_bookings: ${error.message}`)
}

export const supabaseStore: BookingStore = {
  kind: 'supabase',
  async listActive(from, to) {
    const { data, error } = await db()
      .select('*')
      .eq('status', 'confirmed')
      .lt('starts_at', to.toISOString())
      .gt('blocks_until', from.toISOString())
    if (error) fail(error)
    return (data as Row[]).map(fromRow)
  },
  async listForAdmin(from, to) {
    const { data, error } = await db()
      .select('*')
      .gte('starts_at', from.toISOString())
      .lt('starts_at', to.toISOString())
      .order('starts_at')
    if (error) fail(error)
    return (data as Row[]).map(fromRow)
  },
  async create(input) {
    const { data, error } = await db()
      .insert({
        token: randomBytes(18).toString('base64url'),
        service_id: input.serviceId,
        service_name: input.serviceName,
        duration_min: input.durationMin,
        price_huf: input.priceHuf,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        blocks_until: input.blocksUntil,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
        note: input.note,
        source: input.source,
      })
      .select('*')
      .single()
    // 23P01 = exclusion_violation: someone else took the slot a moment earlier
    if (error?.code === '23P01') return { ok: false, reason: 'conflict' }
    if (error) fail(error)
    return { ok: true, booking: fromRow(data as Row) }
  },
  async getByToken(token) {
    const { data, error } = await db().select('*').eq('token', token).maybeSingle()
    if (error) fail(error)
    return data ? fromRow(data as Row) : null
  },
  async getById(id) {
    const { data, error } = await db().select('*').eq('id', id).maybeSingle()
    if (error) fail(error)
    return data ? fromRow(data as Row) : null
  },
  async cancel(id) {
    const { error } = await db().update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('id', id)
    if (error) fail(error)
  },
}
