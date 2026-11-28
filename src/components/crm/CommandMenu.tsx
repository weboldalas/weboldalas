'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, CornerDownLeft, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'
import { adminRoutes, quickActions } from '@/components/admin/navigation'

export const OPEN_COMMAND_EVENT = 'crm:command'
export function openCommandMenu() { window.dispatchEvent(new Event(OPEN_COMMAND_EVENT)) }

type Item = { key: string; href: string; label: string; hint?: string; icon: React.ComponentType<{ className?: string }>; group: string }

function normalize(value: string) {
  return value.toLocaleLowerCase('hu').normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [partners, setPartners] = useState<{ id: string; name: string; company_name: string | null }[]>([])
  const [selected, setSelected] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(value => !value)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(OPEN_COMMAND_EVENT, onOpen) }
  }, [])

  // Partner names are loaded once per opening; the list is small enough to filter locally.
  useEffect(() => {
    if (!open) return
    let cancelled = false
    createClient().from('customers').select('id, name, company_name').order('name').limit(500)
      .then(({ data }) => { if (!cancelled) setPartners(data ?? []) })
    return () => { cancelled = true }
  }, [open])

  const items = useMemo<Item[]>(() => {
    const q = normalize(query.trim())
    const match = (text: string) => !q || normalize(text).includes(q)
    const partnerItems: Item[] = q
      ? partners.filter(p => match(`${p.name} ${p.company_name ?? ''}`)).slice(0, 6).map(p => ({
          key: `p-${p.id}`, href: `/partners/${p.id}`, label: p.company_name || p.name, hint: 'Partner', icon: Building2, group: 'Partnerek',
        }))
      : []
    const actionItems: Item[] = quickActions.filter(a => match(`${a.label} ${a.description}`)).map(a => ({ key: `a-${a.href}`, href: a.href, label: a.label, hint: a.description, icon: a.icon, group: 'Gyors műveletek' }))
    const pageItems: Item[] = adminRoutes.filter(r => match(`${r.label} ${r.description}`)).map(r => ({ key: `r-${r.href}`, href: r.href, label: r.label, hint: r.description, icon: r.icon, group: 'Oldalak' }))
    return [...partnerItems, ...actionItems, ...pageItems]
  }, [query, partners])

  function go(item: Item | undefined) {
    if (!item) return
    setOpen(false)
    setQuery('')
    router.push(item.href)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setSelected(i => Math.min(i + 1, items.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setSelected(i => Math.max(i - 1, 0)) }
    if (event.key === 'Enter') { event.preventDefault(); go(items[selected]) }
  }

  let lastGroup = ''
  return (
    <Dialog open={open} onOpenChange={value => { setOpen(value); if (!value) setQuery('') }}>
      <DialogContent className="crm-command sm:max-w-xl" showCloseButton={false} initialFocus={input}>
        <DialogTitle className="sr-only">Keresés</DialogTitle>
        <DialogDescription className="sr-only">Keress partnerre, oldalra vagy műveletre.</DialogDescription>
        <div className="crm-command-input">
          <Search size={18} />
          <input
            ref={input}
            value={query}
            onChange={event => { setQuery(event.target.value); setSelected(0) }}
            onKeyDown={onKeyDown}
            placeholder="Partner, oldal vagy művelet…"
            aria-label="Keresés"
          />
        </div>
        <div className="crm-command-list" role="listbox" aria-label="Találatok">
          {items.length === 0 && <div className="crm-command-empty">Nincs találat erre: „{query}”</div>}
          {items.map((item, index) => {
            const Icon = item.icon
            const header = item.group !== lastGroup ? <p key={`g-${item.group}`}>{item.group}</p> : null
            lastGroup = item.group
            return [
              header,
              <a
                key={item.key}
                href={item.href}
                role="option"
                aria-selected={index === selected}
                className={`crm-command-item ${index === selected ? 'is-selected' : ''}`}
                onMouseEnter={() => setSelected(index)}
                onClick={event => { event.preventDefault(); go(item) }}
              >
                <Icon />
                <span>{item.label}</span>
                {item.hint && <small>{item.hint}</small>}
              </a>,
            ]
          })}
        </div>
        <div className="crm-command-foot"><span>↑↓ mozgás</span><span><CornerDownLeft size={11} className="inline" /> megnyitás</span><span>Esc bezárás</span></div>
      </DialogContent>
    </Dialog>
  )
}
