import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Minimal PIN gate for Ákos's agenda. One shared PIN (BARBER_ADMIN_PIN), the
// cookie holds a hash of it, so changing the PIN logs every device out.
// Demo store without a configured PIN uses 0000; the real database never
// opens without an explicit PIN.

const COOKIE = 'barber_admin'

export function adminPin(): string | null {
  if (process.env.BARBER_ADMIN_PIN) return process.env.BARBER_ADMIN_PIN
  return process.env.BARBER_STORE === 'supabase' ? null : '0000'
}

export function isDemoPin() {
  return !process.env.BARBER_ADMIN_PIN && process.env.BARBER_STORE !== 'supabase'
}

function sessionValue(pin: string) {
  const secret = process.env.BARBER_ADMIN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'barber-demo'
  return createHash('sha256').update(`${pin}:${secret}`).digest('base64url')
}

function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPin(input: string) {
  const pin = adminPin()
  return pin !== null && same(input, pin)
}

export async function isAdmin() {
  const pin = adminPin()
  if (!pin) return false
  const value = (await cookies()).get(COOKIE)?.value
  return !!value && same(value, sessionValue(pin))
}

export async function startAdminSession() {
  const pin = adminPin()
  if (!pin) return
  ;(await cookies()).set(COOKIE, sessionValue(pin), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/barber',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function endAdminSession() {
  ;(await cookies()).delete({ name: COOKIE, path: '/barber' })
}
