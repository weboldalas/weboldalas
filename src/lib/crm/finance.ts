import { addMonths, dayKey, monthKey } from './format'
import { PAID_PAYMENT_STATUSES } from './status'

export type PaymentRow = {
  amount: number | string
  currency: string | null
  status: string
  payment_date: string | null
  due_date: string | null
  payment_type: string | null
  customer_id: string | null
  invoice_id?: string | null
  invoices?: { kind: string | null } | { kind: string | null }[] | null
}

export type InvoiceWithPayments = {
  id: string
  total: number | string
  status: string
  due_date: string | null
  payments?: { amount: number | string; status: string }[] | null
}

const RECURRING_PAYMENT_TYPES = ['előfizetés', 'havidíj', 'subscription']

function relatedKind(row: PaymentRow) {
  const inv = Array.isArray(row.invoices) ? row.invoices[0] : row.invoices
  return inv?.kind ?? null
}

/** A payment is recurring income when it pays a monthly-fee invoice (or was logged as a subscription payment). */
export function isRecurringPayment(row: PaymentRow) {
  const kind = relatedKind(row)
  if (kind) return kind === 'recurring'
  return RECURRING_PAYMENT_TYPES.includes((row.payment_type ?? '').toLocaleLowerCase('hu'))
}

export function isPaid(row: { status: string }) {
  return PAID_PAYMENT_STATUSES.includes(row.status)
}

/** The day money arrived: payment date, falling back to the due date for older records. */
export function paidOn(row: PaymentRow) {
  return row.payment_date ?? row.due_date
}

export type MonthPoint = { month: string; recurring: number; oneOff: number }

export function monthlyRevenue(payments: PaymentRow[], months: number, endMonth: string): MonthPoint[] {
  const keys = Array.from({ length: months }, (_, i) => addMonths(endMonth, i - months + 1))
  const map = new Map(keys.map(key => [key, { month: key, recurring: 0, oneOff: 0 }]))
  for (const row of payments) {
    if (!isPaid(row) || (row.currency ?? 'HUF') !== 'HUF') continue
    const date = paidOn(row)
    if (!date) continue
    const point = map.get(monthKey(date))
    if (!point) continue
    if (isRecurringPayment(row)) point.recurring += Number(row.amount)
    else point.oneOff += Number(row.amount)
  }
  return keys.map(key => map.get(key)!)
}

export function invoicePaidAmount(invoice: InvoiceWithPayments) {
  return (invoice.payments ?? []).filter(isPaid).reduce((sum, p) => sum + Number(p.amount), 0)
}

export function invoiceOpenAmount(invoice: InvoiceWithPayments) {
  if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'draft') return 0
  return Math.max(0, Number(invoice.total) - invoicePaidAmount(invoice))
}

/** Display status: issued invoices past their due date read as overdue, part-paid ones as partial. */
export function invoiceDisplayStatus(invoice: InvoiceWithPayments, today = dayKey(new Date())) {
  if (invoice.status !== 'issued') return invoice.status
  if (invoice.due_date && invoice.due_date < today) return 'overdue'
  if (invoicePaidAmount(invoice) > 0) return 'partial'
  return 'issued'
}

export function percentChange(current: number, previous: number) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}
