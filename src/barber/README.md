# Vágvölgyi Ákos — barber site concept

Self-contained concept under `/barber`. Nothing here touches the agency site or the CRM,
so it can later be moved into its own repo by copying `src/barber`, `src/components/barber`,
`src/app/barber` and the `barber_bookings` migration.

| Route | What |
|---|---|
| `/barber` | One-page site: hero with live open/closed status + next free slot, services, about, hours, FAQ |
| `/barber/foglalas` | Booking wizard (service → day → time → details → confirmation), `?szolgaltatas=<id>` preselects |
| `/barber/foglalas/<token>` | Customer's own booking: details, add to calendar, self-service cancellation |
| `/barber/foglalas/<token>/naptar` | `.ics` download |
| `/barber/admin` | PIN-protected day view: timeline, stats, cancel, manual (phone / walk-in) bookings |
| `/barber/api/availability?service=<id>` | Free slots for the next 30 days |

## Edit the business
Everything lives in `config.ts`: name, contact details, services (price, duration), opening hours,
breaks, closed dates, booking rules (slot step, cleanup buffer, lead time, horizon, cancel cutoff), FAQ.
Values marked `PLACEHOLDER` must be replaced with real data.

## Environment
| Variable | Default | Purpose |
|---|---|---|
| `BARBER_STORE` | memory | `supabase` = real database. Anything else = in-memory demo with sample bookings (resets on redeploy, not shared across serverless instances) |
| `BARBER_ADMIN_PIN` | `0000` in demo, **required** with Supabase | Admin PIN; use 6+ digits in production |
| `BARBER_ADMIN_SECRET` | service role key | Salt for the admin session cookie |
| `RESEND_API_KEY` + `BARBER_FROM_EMAIL` | – | Confirmation / cancellation emails with `.ics` (skipped if missing) |
| `BARBER_NOTIFY_EMAIL` | – | Ákos gets a mail for every new booking / cancellation |
| `BARBER_SITE_URL` | request host | Base URL for the manage link in emails |

## Going live with Supabase
1. Apply `supabase/migrations/20261029000000_barber_bookings.sql` (needs `btree_gist`; RLS on, no policies → server-only access).
2. Set `BARBER_STORE=supabase`, `BARBER_ADMIN_PIN`, and the Resend variables.
Double bookings are blocked by a Postgres exclusion constraint, not only by the UI check.
