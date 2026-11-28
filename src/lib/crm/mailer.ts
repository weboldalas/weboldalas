import { Resend } from 'resend'

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Weboldalas <hello@weboldalas.hu>'

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
}

/** Sends one transactional email through Resend. Never throws. */
export async function sendEmail(input: { to: string | string[]; subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: Buffer }[] }) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { error: 'A RESEND_API_KEY nincs beállítva.' }
  try {
    const resend = new Resend(key)
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
      attachments: input.attachments,
    })
    if (error) return { error: error.message }
    return { id: data?.id ?? null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Ismeretlen email hiba.' }
  }
}
