import { PublicNav } from '@/components/public/PublicNav'
import { PublicFooter } from '@/components/public/PublicFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen antialiased" style={{ background: '#08080f', color: '#fff' }}>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
