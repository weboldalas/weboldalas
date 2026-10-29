import { bookingIcs } from './calendar'
import { barber, formatHuf } from './config'
import { formatLongDate, formatTime } from './time'
import type { Booking } from './types'

// Transactional emails through Resend's REST API (same approach as the rest of
// the app). Sending is skipped silently when RESEND_API_KEY or
// BARBER_FROM_EMAIL is missing, so the demo works without email setup.

function ics(booking: Booking, method: 'REQUEST' | 'CANCEL') {
  return Buffer.from(bookingIcs(booking, method)).toString('base64')
}

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#0c0b0a;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#f2ede4">
<div style="max-width:520px;margin:0 auto;padding:48px 28px">
<p style="margin:0 0 40px;font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:#c8a27c">${escape(barber.name)} — Barber</p>
<h1 style="margin:0 0 28px;font-size:34px;font-weight:400;letter-spacing:-.02em;line-height:1.1">${title}</h1>
${body}
<p style="margin:48px 0 0;font-size:12px;color:#8a847a">${escape(barber.address)} · ${escape(barber.phone)}</p>
</div></body></html>`
}

function details(b: Booking) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;color:#8a847a;font-size:14px">${k}</td><td style="padding:10px 0;text-align:right;font-size:14px">${escape(v)}</td></tr>`
  return `<table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2724;border-bottom:1px solid #2a2724;margin:0 0 28px">
${row('Szolgáltatás', b.serviceName)}
${row('Időpont', `${formatLongDate(new Date(b.startsAt))}, ${formatTime(new Date(b.startsAt))}`)}
${row('Időtartam', `${b.durationMin} perc`)}
${row('Ár', formatHuf(b.priceHuf))}
</table>`
}

async function send(payload: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.BARBER_FROM_EMAIL
  if (!key || !from) return
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, ...payload }),
    })
    if (!res.ok) console.error('Barber email failed:', res.status, await res.text())
  } catch (error) {
    // an email problem must never undo a booking
    console.error('Barber email failed:', error)
  }
}

export async function sendBookingEmails(booking: Booking, manageUrl: string) {
  const when = `${formatLongDate(new Date(booking.startsAt))}, ${formatTime(new Date(booking.startsAt))}`
  const jobs: Promise<void>[] = []

  if (booking.customerEmail) {
    jobs.push(
      send({
        to: booking.customerEmail,
        reply_to: barber.email,
        subject: `Foglalás visszaigazolva — ${when}`,
        html: layout(
          `Várlak, ${escape(booking.customerName.split(' ')[0])}.`,
          `${details(booking)}
<p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#cfc8bd">A naptárfájlt csatoltam. Ha mégsem jó az időpont, legkésőbb az előtte lévő 6 órában lemondhatod:</p>
<a href="${manageUrl}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:#f2ede4;color:#0c0b0a;text-decoration:none;font-size:13px;letter-spacing:.12em;text-transform:uppercase">Foglalás kezelése</a>`
        ),
        attachments: [{ filename: 'foglalas.ics', content: ics(booking, 'REQUEST') }],
      })
    )
  }

  const notify = process.env.BARBER_NOTIFY_EMAIL
  if (notify) {
    jobs.push(
      send({
        to: notify,
        subject: `Új foglalás: ${booking.customerName} — ${when}`,
        html: layout(
          'Új foglalás érkezett.',
          `${details(booking)}
<p style="margin:0;font-size:15px;line-height:1.7;color:#cfc8bd">${escape(booking.customerName)}<br>${escape(booking.customerPhone ?? '')}<br>${escape(booking.customerEmail ?? '')}${booking.note ? `<br><br>„${escape(booking.note)}”` : ''}</p>`
        ),
        attachments: [{ filename: 'foglalas.ics', content: ics(booking, 'REQUEST') }],
      })
    )
  }

  await Promise.all(jobs)
}

export async function sendCancellationEmails(booking: Booking) {
  const when = `${formatLongDate(new Date(booking.startsAt))}, ${formatTime(new Date(booking.startsAt))}`
  const jobs: Promise<void>[] = []
  if (booking.customerEmail) {
    jobs.push(
      send({
        to: booking.customerEmail,
        subject: `Foglalás lemondva — ${when}`,
        html: layout('A foglalásod lemondva.', `${details(booking)}<p style="margin:0;font-size:15px;color:#cfc8bd">Bármikor foglalhatsz új időpontot a weboldalon.</p>`),
        attachments: [{ filename: 'lemondas.ics', content: ics(booking, 'CANCEL') }],
      })
    )
  }
  const notify = process.env.BARBER_NOTIFY_EMAIL
  if (notify) {
    jobs.push(
      send({
        to: notify,
        subject: `Lemondás: ${booking.customerName} — ${when}`,
        html: layout('Egy foglalást lemondtak.', details(booking)),
      })
    )
  }
  await Promise.all(jobs)
}
