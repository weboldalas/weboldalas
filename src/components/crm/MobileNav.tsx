'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, Menu, Plus, Receipt } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { NavLinks, SidebarFooter } from './Sidebar'
import { openQuickCreate } from './QuickCreate'

const tabs = [
  { href: '/dashboard', label: 'Áttekintés', icon: LayoutDashboard },
  { href: '/partners', label: 'Partnerek', icon: Building2 },
]
const tabsEnd = [{ href: '/invoices', label: 'Számlák', icon: Receipt }]

export function MobileNav({ badges }: { badges?: Record<string, number> }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const tab = (item: { href: string; label: string; icon: typeof LayoutDashboard }) => {
    const Icon = item.icon
    return (
      <Link key={item.href} href={item.href} className={isActive(item.href) ? 'is-active' : ''} aria-current={isActive(item.href) ? 'page' : undefined}>
        <Icon aria-hidden="true" />{item.label}
      </Link>
    )
  }

  return (
    <>
      <nav className="crm-bottom-nav" aria-label="Mobil navigáció">
        {tabs.map(tab)}
        <button type="button" className="crm-fab" onClick={openQuickCreate} aria-label="Új létrehozása"><Plus /></button>
        {tabsEnd.map(tab)}
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Menü megnyitása"><Menu aria-hidden="true" />Menü</button>
      </nav>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="crm-sheet w-[300px] max-w-[85vw] gap-0 p-0">
          <SheetTitle className="sr-only">Menü</SheetTitle>
          <SheetDescription className="sr-only">Válassz egy oldalt.</SheetDescription>
          <div className="flex h-full flex-col pt-14">
            <NavLinks badges={badges} onNavigate={() => setMenuOpen(false)} />
            <SidebarFooter onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
