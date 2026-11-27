'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { findRoute } from '@/components/admin/navigation'
import { BrandLogo } from './BrandLogo'
import { ThemeToggle } from './ThemeToggle'
import { openCommandMenu } from './CommandMenu'
import { openQuickCreate } from './QuickCreate'

export function Topbar() {
  const pathname = usePathname()
  const current = findRoute(pathname)
  const rest = current ? pathname.slice(current.href.length) : ''
  const detail = rest.endsWith('/new') ? 'Új létrehozása' : rest.endsWith('/edit') ? 'Szerkesztés' : rest ? 'Részletek' : null

  return (
    <header className="crm-topbar">
      <Link href="/dashboard" className="crm-topbar-mobile-brand" aria-label="Weboldalas CRM">
        <span className="crm-brand-mark" aria-hidden="true">W</span>
        <BrandLogo />
      </Link>
      <nav aria-label="Oldal helye" className="crm-breadcrumb">
        {current ? (
          <>
            <Link href={current.href} aria-current={detail ? undefined : 'page'}>{current.label}</Link>
            {detail && <><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{detail}</span></>}
          </>
        ) : <span aria-current="page">Weboldalas CRM</span>}
      </nav>
      <div className="crm-topbar-actions">
        <button type="button" className="crm-icon-btn" onClick={openCommandMenu} aria-label="Keresés (Ctrl K)"><Search /></button>
        <span className="max-[900px]:inline-flex hidden"><ThemeToggle /></span>
        <button type="button" className="crm-btn crm-btn-primary crm-btn-sm max-[900px]:hidden" onClick={openQuickCreate}>
          <Plus /> Új
        </button>
      </div>
    </header>
  )
}
