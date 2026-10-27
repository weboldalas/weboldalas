'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { MenuParticles } from './MenuParticles'
import { SERVICES_NAV } from './servicesNav'

const EASE = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const

const links = [
  { href: '/', label: 'Főoldal' },
  { href: '/szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/referenciak', label: 'Referenciák' },
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

  // desktop mega menu for "Szolgáltatások": opens on hover/focus/click, closes with a short delay
  const [mega, setMega] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openMega = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMega(true) }
  const closeMega = () => { if (megaTimer.current) clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(false), 140) }
  useEffect(() => {
    if (!mega) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMega(false) }
    // a tap/click outside the trigger and the panel closes it (touch screens have no mouseleave)
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (!t?.closest('#mega-services, [aria-controls="mega-services"]')) setMega(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown) }
  }, [mega])

  // mobile: services sub-list
  const [subOpen, setSubOpen] = useState(false)

  // Close menu on route change (render-time state adjustment instead of an effect)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setMega(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 isolate transition-[background-color] duration-300"
      style={{
        // Void design: solid black, no blur, no border
        background: open ? 'transparent' : scrolled ? '#000' : 'transparent',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={160} height={22} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              const base = `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white/90'}`
              if (l.href === '/szolgaltatasok') {
                return (
                  <div key={l.href} onMouseEnter={openMega} onMouseLeave={closeMega} onFocus={openMega} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMega() }}>
                    <button
                      type="button"
                      onClick={openMega}
                      aria-expanded={mega}
                      aria-controls="mega-services"
                      className={`${base} inline-flex items-center gap-1.5 ${mega ? 'text-white' : ''}`}
                    >
                      {l.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${mega ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )
              }
              return (
                <Link key={l.href} href={l.href} className={base}>
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

        {/* Desktop mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              id="mega-services"
              key="mega"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute inset-x-4 top-full hidden origin-top pt-2 sm:inset-x-6 md:block lg:inset-x-8"
            >
              <div className="grid grid-cols-[1fr_300px] gap-2 rounded-[28px] border border-white/10 bg-[#0b0b0e] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(128,82,255,0.35)]">
                <ul className="grid grid-cols-2 gap-1 p-2">
                  {SERVICES_NAV.map((sv, i) => {
                    const Icon = sv.icon
                    const active = pathname === sv.href
                    return (
                      <motion.li key={sv.href} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.3, ease: EASE_OUT }}>
                        <Link href={sv.href} onClick={() => setMega(false)} className={`group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-white/[0.05] ${active ? 'bg-white/[0.05]' : ''}`}>
                          <span className="void-icon shrink-0 transition-colors group-hover:border-electric-iris/70 group-hover:bg-electric-iris/20"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-[15px] font-medium text-white">
                              {sv.label}
                              {sv.href.endsWith('/erp') && <span className="void-pill-tag !px-2 !py-0.5 !text-[10px]">Új</span>}
                            </span>
                            <span className="mt-0.5 block text-[13px] text-ash-gray">{sv.desc}</span>
                          </span>
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
                <div className="flex flex-col justify-between rounded-[22px] border border-white/[0.07] bg-[#111116] p-6">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Konzultáció</p>
                    <p className="mt-3 text-heading-2xs text-white">Beszéljük át.</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ash-gray">Elmondod, mit szeretnél elérni, mi pedig javaslunk hozzá egy megoldást. Az első konzultáció ingyenes.</p>
                  </div>
                  <div className="mt-6 space-y-1">
                    <Link href="/kapcsolat" onClick={() => setMega(false)} className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/[0.05]">
                      Beszéljünk <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/szolgaltatasok" onClick={() => setMega(false)} className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ash-gray transition-colors hover:bg-white/[0.05] hover:text-white">
                      Összes szolgáltatás <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                      <motion.div variants={itemVariants} className="relative">
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
                        {l.href === '/szolgaltatasok' && (
                          <button
                            type="button"
                            onClick={() => setSubOpen(v => !v)}
                            aria-expanded={subOpen}
                            aria-label="Szolgáltatások listája"
                            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/70"
                          >
                            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${subOpen ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </motion.div>
                      {l.href === '/szolgaltatasok' && (
                        <AnimatePresence initial={false}>
                          {subOpen && (
                            <motion.ul
                              key="sub"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: EASE_OUT }}
                              className="overflow-hidden pl-10"
                            >
                              {SERVICES_NAV.map(sv => {
                                const Icon = sv.icon
                                return (
                                  <li key={sv.href}>
                                    <Link href={sv.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 text-[17px] text-white/70 active:text-white">
                                      <Icon className="h-4 w-4 text-[#b9a3ff]" strokeWidth={1.6} />
                                      {sv.label}
                                    </Link>
                                  </li>
                                )
                              })}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
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
