'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { MenuParticles } from './MenuParticles'

const EASE = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const

const links = [
  { href: '/', label: 'Főoldal' },
  { href: '/szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/referenciak', label: 'Referenciák' },
  { href: '/arak', label: 'Árak' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
]

/** Two lines: they slide together, then rotate into an X (and reverse on close). */
function HamburgerIcon({ open }: { open: boolean }) {
  const line = 'absolute right-0 block h-[1.5px] rounded-full bg-white'
  const t = { duration: 0.5, ease: EASE, times: [0, 0.45, 1] }
  return (
    <span className="relative block h-3 w-6" aria-hidden>
      <motion.span
        className={`${line} top-0 w-6`}
        initial={false}
        animate={open ? { y: [0, 5.25, 5.25], rotate: [0, 0, 45] } : { y: [5.25, 5.25, 0], rotate: [45, 0, 0] }}
        transition={t}
      />
      <motion.span
        className={`${line} bottom-0 w-4`}
        initial={false}
        animate={open ? { y: [0, -5.25, -5.25], rotate: [0, 0, -45], width: 24 } : { y: [-5.25, -5.25, 0], rotate: [-45, 0, 0], width: 16 }}
        transition={t}
      />
    </span>
  )
}

const menuVariants: Variants = {
  closed: { clipPath: 'circle(0% at 91% 32px)', transition: { duration: 0.55, ease: EASE, delay: 0.1 } },
  open: { clipPath: 'circle(150% at 91% 32px)', transition: { duration: 0.75, ease: EASE } },
}
const listVariants: Variants = {
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.065, delayChildren: 0.22 } },
}
const itemVariants: Variants = {
  closed: { y: '110%', transition: { duration: 0.3, ease: EASE } },
  open: { y: '0%', transition: { duration: 0.7, ease: EASE_OUT } },
}
const fadeVariants: Variants = {
  closed: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.55 } },
}

export function PublicNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    // a page opened mid-way (#anchor, restored scroll) needs the solid bar right away
    const raf = requestAnimationFrame(fn)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', fn) }
  }, [])

  // lock page scroll + close on Escape while the menu is open
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { html.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open])

  // Close menu on route change (render-time state adjustment instead of an effect)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 isolate transition-[background-color] duration-300"
      style={{
        // Void design: solid black, no blur, no border
        background: open ? 'transparent' : scrolled ? '#000' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={160} height={22} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const isActive = pathname === l.href
              return (
                <Link key={l.href} href={l.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)' }}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/kapcsolat"
              className="void-button">
              Ajánlatot kérek
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="group -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <HamburgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile menu: full-screen, revealed as a circle from the hamburger */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 -z-10 overflow-y-auto bg-black md:hidden"
          >
            <MenuParticles />
            <div className="relative mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-24 sm:px-6">
              <motion.ul variants={listVariants} className="space-y-1">
                {links.map((l, i) => {
                  const isActive = pathname === l.href
                  return (
                    <li key={l.href} className="overflow-hidden">
                      <motion.div variants={itemVariants}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className="group flex items-baseline gap-4 py-2"
                        >
                          <span className="w-6 text-caption tabular-nums text-ash-gray">0{i + 1}</span>
                          <span className={`text-[44px] leading-[1.1] tracking-[-0.04em] transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/45 group-active:text-white'}`}>
                            {l.label}
                          </span>
                          {isActive && (
                            <svg aria-hidden viewBox="0 0 10 10" className="h-3 w-3 shrink-0 self-center">
                              <polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1.3" />
                            </svg>
                          )}
                        </Link>
                      </motion.div>
                    </li>
                  )
                })}
              </motion.ul>

              <motion.div variants={fadeVariants} className="mt-auto pt-12">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Email</p>
                    <a href="mailto:info@weboldalas.hu" className="mt-2 block text-[15px] text-white">info@weboldalas.hu</a>
                  </div>
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Nyitvatartás</p>
                    <p className="mt-2 text-[15px] text-white">H–P: 9:00–18:00</p>
                  </div>
                </div>
                <Link href="/kapcsolat" onClick={() => setOpen(false)} className="void-button mt-8 w-full !min-h-[56px]">
                  Ajánlatot kérek
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
