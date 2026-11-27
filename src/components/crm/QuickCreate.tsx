'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { quickActions } from '@/components/admin/navigation'

export const OPEN_QUICK_EVENT = 'crm:quick'
export function openQuickCreate() { window.dispatchEvent(new Event(OPEN_QUICK_EVENT)) }

function QuickGrid({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="crm-quick-grid">
      {quickActions.map(action => {
        const Icon = action.icon
        return (
          <Link key={action.href} href={action.href} className="crm-quick-item" onClick={onNavigate}>
            <span><Icon size={18} /></span>
            <span><strong>{action.label}</strong><small>{action.description}</small></span>
          </Link>
        )
      })}
    </div>
  )
}

/** One “+ Új” menu: a bottom sheet on phones, a dialog on larger screens. */
export function QuickCreate() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_QUICK_EVENT, onOpen)
    return () => { media.removeEventListener('change', sync); window.removeEventListener(OPEN_QUICK_EVENT, onOpen) }
  }, [])

  const close = () => setOpen(false)

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="crm-sheet rounded-t-3xl pb-[env(safe-area-inset-bottom)]" showCloseButton={false}>
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[var(--line-strong)]" aria-hidden="true" />
          <div className="px-4 pt-1">
            <SheetTitle className="text-base font-semibold">Mit hozzunk létre?</SheetTitle>
            <SheetDescription className="text-[13px] text-[var(--text-3)]">Válassz, és már nyílik is az űrlap.</SheetDescription>
          </div>
          <QuickGrid onNavigate={close} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="crm-command sm:max-w-lg">
        <div className="px-4 pt-4">
          <DialogTitle className="text-base font-semibold">Mit hozzunk létre?</DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--text-3)]">Válassz, és már nyílik is az űrlap.</DialogDescription>
        </div>
        <QuickGrid onNavigate={close} />
      </DialogContent>
    </Dialog>
  )
}
