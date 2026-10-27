import { ContactView } from '@/components/public/views/ContactView'
import { CONTACT } from '@/content/contact'
import { alternates } from '@/i18n/routes'

export const metadata = { ...CONTACT.hu.meta, alternates: alternates('hu', 'contact') }

export default async function KapcsolatPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // optional prefill via ?szolgaltatas=…&terv=…
  const sp = await searchParams
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 160) ?? ''
  return <ContactView locale="hu" interest={one(sp.szolgaltatas)} plan={one(sp.terv)} />
}
