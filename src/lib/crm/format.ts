export const TIME_ZONE = 'Europe/Budapest'

const dayFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: TIME_ZONE })

/** YYYY-MM-DD in Budapest time. */
export function dayKey(value: Date | string) {
  return dayFormatter.format(new Date(value))
}
export function todayKey() {
  return dayKey(new Date())
}
/** YYYY-MM in Budapest time. */
export function monthKey(value: Date | string) {
  return dayKey(value).slice(0, 7)
}

export function addMonths(key: string, delta: number) {
  const [y, m] = key.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + delta, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function addDays(key: string, delta: number) {
  const date = new Date(`${key}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

const hufFormatter = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 })

export function formatMoney(amount: number | string | null | undefined, currency = 'HUF') {
  const value = Number(amount ?? 0)
  if (currency === 'HUF') return `${hufFormatter.format(Math.round(value))} Ft`
  return new Intl.NumberFormat('hu-HU', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value)
}

/** 1 250 000 → "1,25 M Ft"; keeps KPI tiles short on phones. */
export function formatMoneyShort(amount: number, currency = 'HUF') {
  if (currency !== 'HUF') return formatMoney(amount, currency)
  const abs = Math.abs(amount)
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('hu-HU', { maximumFractionDigits: 2 })} M Ft`
  if (abs >= 10_000) return `${Math.round(amount / 1000).toLocaleString('hu-HU')} e Ft`
  return formatMoney(amount)
}

export function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!value) return '—'
  const date = value.length === 10 ? new Date(`${value}T12:00:00Z`) : new Date(value)
  return date.toLocaleDateString('hu-HU', { timeZone: TIME_ZONE, ...options })
}

export function formatMonth(key: string, style: 'short' | 'long' = 'short') {
  const date = new Date(`${key}-15T12:00:00Z`)
  return date.toLocaleDateString('hu-HU', { timeZone: TIME_ZONE, month: style, ...(style === 'long' ? { year: 'numeric' } : {}) })
}

export function daysBetween(fromKey: string, toKey: string) {
  return Math.round((Date.parse(`${toKey}T12:00:00Z`) - Date.parse(`${fromKey}T12:00:00Z`)) / 86_400_000)
}

export function initials(name: string) {
  const parts = name.replace(/\b(kft|bt|zrt|nyrt|kkt|ev)\.?\b/gi, '').trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toLocaleUpperCase('hu') || '?'
}

const AVATAR_COLORS = ['#7c4dff', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#8b5cf6']
export function avatarColor(seed: string) {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function partnerName(partner: { name?: string | null; company_name?: string | null; is_company?: boolean | null } | null | undefined) {
  if (!partner) return 'Ismeretlen partner'
  return (partner.is_company !== false && partner.company_name) || partner.name || partner.company_name || 'Névtelen partner'
}

/** Escapes user-provided text for HTML e-mails. */
export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
