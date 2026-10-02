'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronRight, ArrowUpRight, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { adminRoutes, quickActions } from './navigation'

function normalize(value: string) { return value.toLocaleLowerCase('hu').normalize('NFD').replace(/[\u0300-\u036f]/g, '') }

export function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const current = adminRoutes.find(route => pathname === route.href || pathname.startsWith(`${route.href}/`))
  const isDetail = current && pathname !== current.href
  const results = [...adminRoutes, ...quickActions].filter(item => normalize(`${item.label} ${item.description}`).includes(normalize(query.trim())))

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(value => !value)
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function close() { setOpen(false); setQuery('') }

  return <>
    <header className="admin-topbar"><nav aria-label="Oldal helye" className="admin-breadcrumb"><Link href="/dashboard">Munkaterület</Link><ChevronRight size={14} /><Link href={current?.href ?? '/dashboard'} aria-current={!isDetail ? 'page' : undefined}>{current?.label ?? 'Admin'}</Link>{isDetail && <><ChevronRight size={14} /><span aria-current="page">{pathname.endsWith('/new') ? 'Új létrehozása' : 'Részletek'}</span></>}</nav>
      <div className="admin-topbar-actions"><button type="button" className="admin-search-trigger" aria-label="Oldal vagy művelet keresése" onClick={() => {setQuery(''); setOpen(true)}}><Search size={16} /><span>Oldal vagy művelet keresése</span><kbd>⌘ / Ctrl K</kbd></button><Link href="/tasks/new" className="admin-topbar-add" aria-label="Új feladat"><Plus size={18} /><span>Új feladat</span></Link></div>
    </header>
    <Dialog open={open} onOpenChange={value => {setOpen(value); if (!value) setQuery('')}}><DialogContent className="admin-command-dialog sm:max-w-xl" style={{ background: '#171d2b', color: '#edf1f9' }} initialFocus={input}>
      <DialogTitle className="text-base font-semibold">Hová szeretnél menni?</DialogTitle><DialogDescription className="text-sm text-slate-400">Keress az adminoldalak és a gyors műveletek között.</DialogDescription>
      <div className="admin-command-input"><Search size={18} /><input ref={input} value={query} onChange={event => setQuery(event.target.value)} aria-label="Oldal vagy művelet keresése" placeholder="Például: ajánlat, ügyfél, új feladat…" /></div>
      <nav aria-label="Keresési találatok" className="admin-command-results">{results.length ? results.map(item => {const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={close}><Icon size={19} /><div><strong>{item.label}</strong><span>{item.description}</span></div><ArrowUpRight size={16} /></Link>}) : <p className="admin-command-empty">Nincs ilyen oldal vagy művelet. Próbálj másik kifejezést.</p>}</nav>
      <p className="admin-command-help">Tab: találatok közötti lépés · Enter: megnyitás · Esc: bezárás</p>
    </DialogContent></Dialog>
  </>
}
