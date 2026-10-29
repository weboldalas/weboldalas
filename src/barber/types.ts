export type BookingStatus = 'confirmed' | 'cancelled'
export type BookingSource = 'online' | 'admin'

export type Booking = {
  id: string
  token: string // secret used in the customer's manage link
  serviceId: string
  serviceName: string
  durationMin: number
  priceHuf: number
  startsAt: string // ISO
  endsAt: string // ISO, end of the service
  blocksUntil: string // ISO, end + cleanup buffer; used for overlap checks
  customerName: string
  customerEmail: string | null
  customerPhone: string | null
  note: string | null
  status: BookingStatus
  source: BookingSource
  createdAt: string
}

export type NewBooking = Omit<Booking, 'id' | 'token' | 'status' | 'createdAt'>

export type CreateResult = { ok: true; booking: Booking } | { ok: false; reason: 'conflict' }

export interface BookingStore {
  readonly kind: 'memory' | 'supabase'
  /** Confirmed bookings whose blocked interval overlaps [from, to) */
  listActive(from: Date, to: Date): Promise<Booking[]>
  /** All bookings starting in [from, to), cancelled included, ordered by start */
  listForAdmin(from: Date, to: Date): Promise<Booking[]>
  /** Must reject atomically when the slot was taken in the meantime */
  create(input: NewBooking): Promise<CreateResult>
  getByToken(token: string): Promise<Booking | null>
  getById(id: string): Promise<Booking | null>
  cancel(id: string): Promise<void>
}
