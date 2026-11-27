'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogOut, Search } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { navigationGroups } from '@/components/admin/navigation'
import { BrandLogo } from './BrandLogo'
import { ThemeToggle } from './ThemeToggle'
import { openCommandMenu } from './CommandMenu'

export function NavLinks({ onNavigate, badges = {} }: { onNavigate?: () => void; badges?: Record<string, number> }) {
  const pathname = usePathname()
  return (
    <nav className="crm-nav" aria-label="Fő navigáció">
      {navigationGroups.map(group => (
        <div key={group.label} className="crm-nav-group">
          <p>{group.label}</p>
          {group.routes.map(route => {
            const Icon = route.icon
            const active = pathname === route.href || pathname.startsWith(`${route.href}/`)
            const badge = badges[route.href]
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`crm-nav-link ${active ? 'is-active' : ''}`}
              >
                <Icon aria-hidden="true" />
                <span>{route.label}</span>
                {badge ? <span className="crm-nav-count" aria-label={`${badge} figyelmet igényel`}>{badge}</span> : null}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

export function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="crm-sidebar-foot">
      <ThemeToggle withLabel className="" />
      <Link href="/" onClick={onNavigate}><ArrowUpRight /> Weboldal megnyitása</Link>
      <form action={logout}><button type="submit"><LogOut /> Kijelentkezés</button></form>
    </div>
  )
}

export function Sidebar({ badges }: { badges?: Record<string, number> }) {
  return (
    <aside className="crm-sidebar">
      <div className="crm-sidebar-head">
        <Link href="/dashboard" className="crm-brand" aria-label="Weboldalas CRM, áttekintés">
          <span className="crm-brand-mark" aria-hidden="true">W</span>
          <BrandLogo />
        </Link>
      </div>
      <button type="button" className="crm-sidebar-search" onClick={openCommandMenu}>
        <Search size={15} /> Keresés <kbd>⌘K</kbd>
      </button>
      <NavLinks badges={badges} />
      <SidebarFooter />
    </aside>
  )
}
