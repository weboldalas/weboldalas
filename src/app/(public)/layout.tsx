import { PublicShell } from '@/components/public/PublicShell'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell locale="hu">{children}</PublicShell>
}
