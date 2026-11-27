import type { Metadata, Viewport } from 'next'
import { voidFont } from '@/components/public/home/fonts'
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/crm/Sidebar'
import { Topbar } from '@/components/crm/Topbar'
import { MobileNav } from '@/components/crm/MobileNav'
import { CommandMenu } from '@/components/crm/CommandMenu'
import { QuickCreate } from '@/components/crm/QuickCreate'
import { themeInitScript } from '@/components/crm/ThemeToggle'
import { Toaster } from 'sonner'
import { todayKey } from '@/lib/crm/format'
import { requireStaff } from '@/lib/crm/auth'
import './admin.css'

export const metadata: Metadata = {
  title: { default: 'Weboldalas CRM', template: '%s | Weboldalas CRM' },
  manifest: '/crm/manifest.webmanifest',
  icons: {
    icon: [{ url: '/crm/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/crm/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Weboldalas', statusBarStyle: 'default' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f6f8' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  viewportFit: 'cover',
}

async function getNavBadges(): Promise<Record<string, number>> {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'issued')
      .lt('due_date', todayKey())
    return count ? { '/invoices': count } : {}
  } catch {
    return {}
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaff()
  const badges = await getNavBadges()
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <style>{`html:has(.crm-shell) body{font-family:${voidFont.style.fontFamily},ui-sans-serif,system-ui,sans-serif}`}</style>
      <div className={`crm-shell ${voidFont.variable}`}>
        <a href="#crm-main" className="crm-skip-link">Ugrás a tartalomra</a>
        <Sidebar badges={badges} />
        <div className="crm-main-col">
          <Topbar />
          <main id="crm-main" tabIndex={-1} className="crm-main">
            <div className="crm-content">{children}</div>
          </main>
        </div>
        <MobileNav badges={badges} />
      </div>
      <CommandMenu />
      <QuickCreate />
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}
