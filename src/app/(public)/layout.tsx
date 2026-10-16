import { PublicNav } from '@/components/public/PublicNav'
import { PublicFooter } from '@/components/public/PublicFooter'
import { voidFont } from '@/components/public/home/fonts'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${voidFont.variable} void-site min-h-screen bg-void font-ppneuemontreal text-bone-white antialiased`}>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
