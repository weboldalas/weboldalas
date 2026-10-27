import { PublicShell } from '@/components/public/PublicShell'

// English public site, served under /en
export default function PublicEnLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell locale="en">{children}</PublicShell>
}
