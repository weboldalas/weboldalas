export type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export const PARTNER_STATUS: Record<string, { label: string; tone: Tone }> = {
  active: { label: 'Aktív', tone: 'success' },
  paused: { label: 'Szünetel', tone: 'warning' },
  former: { label: 'Korábbi', tone: 'neutral' },
}

export const INVOICE_STATUS: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Piszkozat', tone: 'neutral' },
  issued: { label: 'Kiállítva', tone: 'info' },
  overdue: { label: 'Lejárt', tone: 'danger' },
  partial: { label: 'Részben fizetve', tone: 'warning' },
  paid: { label: 'Fizetve', tone: 'success' },
  cancelled: { label: 'Sztornó', tone: 'neutral' },
}

export const INVOICE_KIND: Record<string, string> = {
  recurring: 'Havidíj',
  one_off: 'Eseti',
}

export const PROJECT_STATUS: Record<string, { label: string; tone: Tone }> = {
  planned: { label: 'Tervezett', tone: 'neutral' },
  active: { label: 'Folyamatban', tone: 'brand' },
  on_hold: { label: 'Szünetel', tone: 'warning' },
  completed: { label: 'Kész', tone: 'success' },
  cancelled: { label: 'Leállítva', tone: 'neutral' },
}

export const SUBSCRIPTION_STATUS: Record<string, { label: string; tone: Tone }> = {
  active: { label: 'Aktív', tone: 'success' },
  trial: { label: 'Próbaidő', tone: 'info' },
  past_due: { label: 'Hátralékos', tone: 'danger' },
  canceled: { label: 'Lemondva', tone: 'neutral' },
  expired: { label: 'Lejárt', tone: 'neutral' },
}

export const OFFER_STATUS: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Tervezet', tone: 'neutral' },
  sent: { label: 'Elküldve', tone: 'info' },
  accepted: { label: 'Elfogadva', tone: 'success' },
  rejected: { label: 'Elutasítva', tone: 'danger' },
  expired: { label: 'Lejárt', tone: 'warning' },
}

export const DOCUMENT_STATUS: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Tervezet', tone: 'neutral' },
  generated: { label: 'Generálva', tone: 'neutral' },
  sent: { label: 'Elküldve', tone: 'info' },
  review_requested: { label: 'Módosítást kértek', tone: 'warning' },
  signed: { label: 'Aláírva', tone: 'success' },
  archived: { label: 'Archivált', tone: 'neutral' },
  cancelled: { label: 'Visszavonva', tone: 'neutral' },
}

/** Payment statuses that mean money actually arrived. */
export const PAID_PAYMENT_STATUSES = ['completed', 'paid']
/** Legacy scheduled payments that are still expected. */
export const OPEN_PAYMENT_STATUSES = ['pending', 'overdue']
