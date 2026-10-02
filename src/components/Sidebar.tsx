'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, ArrowUpRight, Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'
import { navigationGroups } from '@/components/admin/navigation'

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return <div className="admin-sidebar-content">
    <Link href="/dashboard" className="admin-brand" onClick={onNavigate} aria-label="Weboldalas admin – áttekintés">
      <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={145} height={20} loading="eager" style={{ height: 'auto' }} /><span>Üzleti munkaterület</span>
    </Link>
    <div className="admin-workspace"><span className="admin-workspace-avatar">W</span><div><strong>Weboldalas</strong><span>Ügyfelek. Projektek. Teendők.</span></div></div>
    <Link href="/leads/new" className="admin-sidebar-create" onClick={onNavigate}><Plus size={17} /> Új érdeklődő</Link>
    <nav className="admin-sidebar-nav" aria-label="Admin navigáció">{navigationGroups.map(group => <div key={group.label} className="admin-nav-group"><p>{group.label}</p>{group.routes.map(route => {
      const Icon = route.icon
      const active = pathname === route.href || pathname.startsWith(`${route.href}/`)
      return <Link key={route.href} href={route.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={`admin-nav-link ${active ? 'is-active' : ''}`}><Icon size={18} aria-hidden="true" /><span>{route.label}</span>{active && <span className="admin-nav-active-dot" aria-hidden="true" />}</Link>
    })}</div>)}</nav>
    <div className="admin-sidebar-footer"><Link href="/" onClick={onNavigate}><ArrowUpRight size={17} /> Weboldal megnyitása</Link><form action={logout}><button type="submit"><LogOut size={17} /> Kijelentkezés</button></form></div>
  </div>
}

export function Sidebar() {
  const [open, setOpen] = useState(false)
  return <>
    <aside className="admin-sidebar"><SidebarContent /></aside>
    <div className="admin-mobile-bar">
      <Sheet open={open} onOpenChange={setOpen}><SheetTrigger render={<Button variant="ghost" size="icon" className="text-white/80" />}><Menu size={20} /><span className="sr-only">Navigáció megnyitása</span></SheetTrigger>
        <SheetContent side="left" className="admin-mobile-sheet w-72 max-w-[85vw] gap-0 border-0 p-0" style={{ background: '#111521', color: '#e9edf5' }}><SheetTitle className="sr-only">Admin navigáció</SheetTitle><SheetDescription className="sr-only">Válassz egy oldalt a Weboldalas munkaterületén.</SheetDescription><SidebarContent onNavigate={() => setOpen(false)} /></SheetContent>
      </Sheet>
      <Link href="/dashboard"><Image src="/weboldalas-logo.svg" alt="Weboldalas" width={120} height={17} loading="eager" style={{ height: 'auto' }} /></Link><span className="admin-mobile-label">Admin</span>
    </div>
  </>
}
