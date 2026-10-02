'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion,
} from 'framer-motion'
import {
  ArrowRight, Scissors, Utensils, BedDouble, ShoppingBag, HardHat,
  Bell, Lock, Check, Smartphone, Sparkles, Star,
} from 'lucide-react'

type Widget = 'booking' | 'menu' | 'calendar' | 'cart' | 'lead'

const industries: {
  key: string
  word: string
  label: string
  icon: typeof Scissors
  brand: string
  domain: string
  accent: string
  accent2: string
  headline: string
  sub: string
  cta: string
  nav: string[]
  cards: string[]
  widget: Widget
  badge: string
  notif: { title: string; text: string }
}[] = [
  {
    key: 'fodraszat', word: 'fodrászatnak', label: 'Fodrászat', icon: Scissors,
    brand: 'Studio Bella', domain: 'studiobella.hu', accent: '#f43f5e', accent2: '#fb923c',
    headline: 'Új frizura, új önbizalom.', sub: 'Foglalj időpontot 30 másodperc alatt, telefonálás nélkül.',
    cta: 'Időpontot foglalok', nav: ['Szolgáltatások', 'Árak', 'Galéria'],
    cards: ['Női hajvágás', 'Festés', 'Balayage'], widget: 'booking', badge: 'Online időpontfoglalás',
    notif: { title: 'Új foglalás', text: 'Holnap 10:30 · Festés' },
  },
  {
    key: 'etterem', word: 'étteremnek', label: 'Étterem', icon: Utensils,
    brand: 'Bistro Tisza', domain: 'bistrotisza.hu', accent: '#f59e0b', accent2: '#ef4444',
    headline: 'Ízek, amikért visszajössz.', sub: 'Napi menü, asztalfoglalás és rendezvények egy helyen.',
    cta: 'Asztalt foglalok', nav: ['Étlap', 'Napi menü', 'Rendezvények'],
    cards: ['Napi menü', 'Borlap', 'Csapatépítő'], widget: 'menu', badge: 'Ma is nyitva 22-ig',
    notif: { title: 'Asztalfoglalás', text: 'Ma 19:00 · 4 fő' },
  },
  {
    key: 'panzio', word: 'panziónak', label: 'Szálláshely', icon: BedDouble,
    brand: 'Tópart Panzió', domain: 'topartpanzio.hu', accent: '#0ea5e9', accent2: '#22d3ee',
    headline: 'Pihenés a víz partján.', sub: 'Szabad szobák valós időben, közvetlen foglalással.',
    cta: 'Szobát foglalok', nav: ['Szobák', 'Wellness', 'Programok'],
    cards: ['Panoráma szoba', 'Wellness', 'Reggeli'], widget: 'calendar', badge: 'Közvetlen foglalás',
    notif: { title: 'Új foglalás', text: 'Júl. 12–15. · 2 fő' },
  },
  {
    key: 'webshop', word: 'webshopnak', label: 'Webshop', icon: ShoppingBag,
    brand: 'Forma Shop', domain: 'formashop.hu', accent: '#8b5cf6', accent2: '#ec4899',
    headline: 'Kézműves termékek, egy kattintásra.', sub: 'Gyors fizetés, házhoz szállítás, boldog vásárlók.',
    cta: 'Vásárlás', nav: ['Újdonságok', 'Bestseller', 'Akciók'],
    cards: ['Kerámia bögre', 'Lenvászon', 'Illatgyertya'], widget: 'cart', badge: 'Ingyenes szállítás',
    notif: { title: 'Új rendelés', text: '24 990 Ft · Bankkártya' },
  },
  {
    key: 'epitoipar', word: 'építőipari cégnek', label: 'Építőipar', icon: HardHat,
    brand: 'Alapkő Építő', domain: 'alapkoepito.hu', accent: '#10b981', accent2: '#84cc16',
    headline: 'Megbízható kivitelezés, határidőre.', sub: 'Kérj ingyenes felmérést, és hamarosan jelentkezünk.',
    cta: 'Felmérést kérek', nav: ['Munkáink', 'Szolgáltatások', 'Kapcsolat'],
    cards: ['Családi ház', 'Felújítás', 'Tetőfedés'], widget: 'lead', badge: '25 év tapasztalat',
    notif: { title: 'Új ajánlatkérés', text: 'Fürdőszoba felújítás' },
  },
]

const CYCLE_MS = 4200

export function HeroShowcase() {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const active = industries[index]

  // Auto-cycle industries until the visitor picks one
  useEffect(() => {
    if (!autoplay || reduceMotion) return
    const t = setTimeout(() => setIndex(i => (i + 1) % industries.length), CYCLE_MS)
    return () => clearTimeout(t)
  }, [index, autoplay, reduceMotion])

  // Mouse-driven tilt + spotlight
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    if (reduceMotion) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onPointerLeave() {
    mx.set(0)
    my.set(0)
  }

  function select(i: number) {
    setAutoplay(false)
    setIndex(i)
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="hero-section relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28"
    >
      {/* ===== Background layers ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0" />
        <div className="hero-spotlight absolute inset-0" />
        <motion.div
          className="absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-[140px] home-anim aurora-a"
          animate={{ background: `radial-gradient(closest-side, ${active.accent}55, transparent)` }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full blur-[120px] opacity-40 home-anim aurora-b"
          style={{ background: 'radial-gradient(closest-side, #0ea5e9, transparent)' }} />
        <div className="absolute bottom-0 -right-40 h-[460px] w-[460px] rounded-full blur-[130px] opacity-30 home-anim aurora-c"
          style={{ background: 'radial-gradient(closest-side, #8b5cf6, transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#08080f]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Copy ===== */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-sm text-white/70 backdrop-blur"
          >
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-2.5 py-0.5 text-xs font-bold text-white">
              <Sparkles className="h-3 w-3" /> 19 990 Ft/hó-tól
            </span>
            <span className="whitespace-nowrap">Indulás 5–10 nap alatt</span>
          </motion.div>

          <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            <span className="sr-only">Prémium weboldal vállalkozásoknak, nagy kezdő költségek nélkül.</span>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="block"
            >
              Prémium weboldal
            </motion.span>
            <span aria-hidden className="relative block h-[1.15em] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active.key}
                  initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 block bg-clip-text pb-2 text-transparent"
                  style={{ backgroundImage: `linear-gradient(100deg, ${active.accent}, ${active.accent2} 60%, #ffffff)` }}
                >
                  {active.word}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55 sm:text-xl"
          >
            Gyönyörű, gyors és mobilbarát weboldal, ami bizalmat épít és új ügyfeleket hoz.
            Több százezer forintos beruházás helyett <span className="text-white/85">kiszámítható havi díjjal</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/kapcsolat" className="btn-primary group w-full sm:w-auto">
              Ingyenes ajánlatot kérek
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/referenciak" className="btn-ghost w-full sm:w-auto">
              Munkáink megtekintése
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {[0, 1, 2, 3, 4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </span>
              Elégedett ügyfelek
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span>Nincs rejtett költség</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span>Magyar csapat és support</span>
          </motion.div>
        </div>

        {/* ===== Industry picker ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex justify-center"
        >
          <div
            role="tablist"
            aria-label="Válassz iparágat az előnézethez"
            className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur"
          >
            {industries.map((ind, i) => {
              const Icon = ind.icon
              const isActive = i === index
              return (
                <button
                  key={ind.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => select(i)}
                  className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/45 hover:text-white/80'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="industry-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${ind.accent}33, ${ind.accent2}22)`, boxShadow: `inset 0 0 0 1px ${ind.accent}55` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" style={{ color: isActive ? ind.accent : undefined }} />
                  <span className="relative">{ind.label}</span>
                  {isActive && autoplay && !reduceMotion && (
                    <motion.span
                      key={`progress-${index}`}
                      className="absolute bottom-0 left-0 h-[2px]"
                      style={{ background: ind.accent }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ===== Live browser mockup ===== */}
        <div className="relative mx-auto mt-8 max-w-5xl [perspective:1600px]">
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
              {/* glow under the frame */}
              <motion.div
                aria-hidden
                className="absolute -inset-x-10 -bottom-10 top-10 -z-10 rounded-[3rem] blur-3xl"
                animate={{ background: `linear-gradient(90deg, ${active.accent}44, ${active.accent2}33)` }}
                transition={{ duration: 0.8 }}
              />
              <BrowserFrame industry={active} />

              {/* Floating notification */}
              <div className="pointer-events-none absolute -right-3 top-32 hidden sm:block lg:-right-16" style={{ transform: 'translateZ(60px)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.key}
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex w-60 items-center gap-3 rounded-2xl border border-white/10 bg-[#11111b]/90 p-3 shadow-2xl backdrop-blur-xl"
                  >
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${active.accent}, ${active.accent2})` }}>
                      <Bell className="h-4 w-4 text-white" />
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#11111b] bg-emerald-400" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{active.notif.title}</span>
                      <span className="block truncate text-xs text-white/50">{active.notif.text}</span>
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating phone */}
              <div className="pointer-events-none absolute -bottom-16 -left-4 hidden md:block lg:-left-28" style={{ transform: 'translateZ(90px)' }}>
                <PhoneMock industry={active} />
              </div>

              {/* Floating quality chip */}
              <div className="pointer-events-none absolute -bottom-6 right-6 hidden sm:block" style={{ transform: 'translateZ(40px)' }}>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#11111b]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
                  <div className="flex -space-x-1">
                    {['Mobilbarát', 'SEO', 'SSL'].map(t => (
                      <span key={t} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#11111b] bg-emerald-500">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white/70">Mobilbarát · SEO · SSL</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

type Industry = (typeof industries)[number]

function BrowserFrame({ industry }: { industry: Industry }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d16] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] sm:rounded-3xl">
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-2 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-white/50">
          <Lock className="h-3 w-3 shrink-0 text-emerald-400" />
          <AnimatePresence mode="wait">
            <motion.span
              key={industry.domain}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate"
            >
              {industry.domain}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="hidden w-[52px] sm:block" />
      </div>

      {/* site */}
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={industry.key}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <MockSite industry={industry} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
})

function MockSite({ industry: ind }: { industry: Industry }) {
  const Icon = ind.icon
  return (
    <div className="relative flex h-full flex-col overflow-hidden p-4 sm:p-7"
      style={{ background: `radial-gradient(120% 90% at 85% 0%, ${ind.accent}30, transparent 55%), radial-gradient(90% 80% at 0% 100%, ${ind.accent2}1f, transparent 60%), #0b0b13` }}>
      {/* nav */}
      <motion.div {...rise(0.05)} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8"
            style={{ background: `linear-gradient(135deg, ${ind.accent}, ${ind.accent2})` }}>
            <Icon className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
          </span>
          <span className="text-sm font-bold text-white sm:text-base">{ind.brand}</span>
        </div>
        <div className="hidden items-center gap-5 text-xs text-white/50 sm:flex">
          {ind.nav.map(n => <span key={n}>{n}</span>)}
          <span className="rounded-full px-3 py-1.5 font-semibold text-white" style={{ background: ind.accent }}>
            Kapcsolat
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:hidden">
          <span className="h-0.5 w-4 rounded bg-white/60" />
          <span className="h-0.5 w-4 rounded bg-white/60" />
        </div>
      </motion.div>

      {/* hero */}
      <div className="mt-6 grid flex-1 items-center gap-5 sm:mt-4 sm:grid-cols-[1.15fr_1fr] sm:gap-8">
        <div>
          <motion.div {...rise(0.12)} className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:text-xs"
            style={{ borderColor: `${ind.accent}55`, color: ind.accent, background: `${ind.accent}14` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ind.accent }} /> {ind.badge}
          </motion.div>
          <motion.h3 {...rise(0.18)} className="text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            {ind.headline}
          </motion.h3>
          <motion.p {...rise(0.24)} className="mt-2 text-xs leading-relaxed text-white/55 sm:mt-3 sm:text-sm">
            {ind.sub}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-4 flex items-center gap-2 sm:mt-6">
            <span className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg sm:text-sm"
              style={{ background: `linear-gradient(135deg, ${ind.accent}, ${ind.accent2})`, boxShadow: `0 10px 30px -8px ${ind.accent}` }}>
              {ind.cta}
            </span>
            <span className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 sm:text-sm">
              Részletek
            </span>
          </motion.div>
        </div>

        <motion.div {...rise(0.32)} className="w-full sm:max-w-[300px] sm:justify-self-end">
          <MockWidget industry={ind} />
        </motion.div>
      </div>

      {/* cards */}
      <div className="mt-4 hidden grid-cols-3 gap-3 sm:grid">
        {ind.cards.map((c, i) => (
          <motion.div key={c} {...rise(0.4 + i * 0.06)}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
            <span className="h-8 w-8 shrink-0 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${ind.accent}${['66', '44', '22'][i]}, ${ind.accent2}${['33', '55', '44'][i]})` }} />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-white/85">{c}</span>
              <span className="mt-1 block h-1.5 w-12 rounded bg-white/10" />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function MockWidget({ industry: ind }: { industry: Industry }) {
  const shell = 'rounded-2xl border border-white/10 bg-[#13131d]/90 p-3.5 shadow-2xl backdrop-blur sm:p-4'

  if (ind.widget === 'booking') {
    const slots = ['9:00', '10:30', '12:00', '13:30', '15:00', '16:30']
    return (
      <div className={shell}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Válassz időpontot</span>
          <span className="text-[10px] text-white/40">Holnap</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((s, i) => (
            <span key={s}
              className={`relative rounded-lg py-2 text-center text-[11px] font-semibold ${i === 1 ? 'text-white' : i === 3 ? 'text-white/25 line-through' : 'text-white/60'}`}
              style={i === 1 ? { background: ind.accent, boxShadow: `0 0 0 3px ${ind.accent}33` } : { background: 'rgba(255,255,255,0.05)' }}>
              {s}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
          <span className="text-[11px] text-white/60">Festés · 90 perc</span>
          <span className="text-[11px] font-bold text-white">14 900 Ft</span>
        </div>
      </div>
    )
  }

  if (ind.widget === 'menu') {
    const dishes = [['Gulyásleves', '2 490'], ['Rántott harcsa', '4 290'], ['Somlói galuska', '1 890']]
    return (
      <div className={shell}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Mai menü</span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${ind.accent}22`, color: ind.accent }}>Friss</span>
        </div>
        <div className="space-y-2">
          {dishes.map(([d, p]) => (
            <div key={d} className="flex items-center gap-2.5">
              <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${ind.accent}66, ${ind.accent2}44)` }} />
              <span className="flex-1 text-[11px] font-medium text-white/75">{d}</span>
              <span className="text-[11px] font-bold text-white">{p} Ft</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ind.widget === 'calendar') {
    return (
      <div className={shell}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Július</span>
          <span className="text-[10px] font-semibold text-emerald-400">● 3 szabad szoba</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 21 }).map((_, i) => {
            const day = i + 6
            const inRange = day >= 12 && day <= 15
            const edge = day === 12 || day === 15
            const busy = [8, 9, 19, 20, 24].includes(day)
            return (
              <span key={i}
                className={`flex aspect-square items-center justify-center rounded-md text-[10px] font-semibold ${busy ? 'text-white/20 line-through' : edge ? 'text-white' : inRange ? 'text-white/90' : 'text-white/50'}`}
                style={edge ? { background: ind.accent } : inRange ? { background: `${ind.accent}33` } : undefined}>
                {day}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (ind.widget === 'cart') {
    return (
      <div className={shell}>
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl"
          style={{ background: `linear-gradient(135deg, ${ind.accent}55, ${ind.accent2}44)` }}>
          <span className="absolute left-1/2 top-1/2 h-14 w-12 -translate-x-1/2 -translate-y-1/2 rounded-b-2xl rounded-t-md bg-white/85 shadow-xl" />
          <span className="absolute left-[58%] top-[42%] h-6 w-4 rounded-r-full border-4 border-white/85" />
          <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold" style={{ color: ind.accent }}>-20%</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Kerámia bögre</div>
            <div className="text-[11px] text-white/50"><s>7 490</s> · <span className="font-bold text-white">5 990 Ft</span></div>
          </div>
          <span className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white" style={{ background: ind.accent }}>Kosárba</span>
        </div>
      </div>
    )
  }

  // lead form
  return (
    <div className={shell}>
      <div className="mb-3 text-xs font-bold text-white">Ingyenes felmérés</div>
      <div className="space-y-2">
        {['Név', 'Telefonszám', 'Munka típusa'].map((f, i) => (
          <div key={f} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/40">
            {i === 2 ? <span className="text-white/80">Fürdőszoba felújítás</span> : f}
          </div>
        ))}
        <div className="rounded-lg py-2 text-center text-[11px] font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${ind.accent}, ${ind.accent2})` }}>
          Ajánlatot kérek
        </div>
      </div>
    </div>
  )
}

function PhoneMock({ industry: ind }: { industry: Industry }) {
  const Icon = ind.icon
  return (
    <div className="w-[150px] rounded-[2rem] border border-white/15 bg-[#0b0b13] p-1.5 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.9)]">
      <div className="relative overflow-hidden rounded-[1.6rem]"
        style={{ background: `radial-gradient(120% 70% at 80% 0%, ${ind.accent}55, transparent 60%), #0b0b13` }}>
        <div className="mx-auto mt-1.5 h-4 w-14 rounded-full bg-black" />
        <AnimatePresence mode="wait">
          <motion.div
            key={ind.key}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-2 p-3 pb-4"
          >
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md" style={{ background: ind.accent }}>
                <Icon className="h-2.5 w-2.5 text-white" />
              </span>
              <span className="text-[9px] font-bold text-white">{ind.brand}</span>
            </div>
            <div className="pt-2 text-[13px] font-extrabold leading-tight text-white">{ind.headline}</div>
            <div className="h-1.5 w-full rounded bg-white/10" />
            <div className="h-1.5 w-3/4 rounded bg-white/10" />
            <div className="mt-2 rounded-lg py-1.5 text-center text-[9px] font-bold text-white" style={{ background: ind.accent }}>
              {ind.cta}
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <span className="aspect-square rounded-lg" style={{ background: `${ind.accent}44` }} />
              <span className="aspect-square rounded-lg" style={{ background: `${ind.accent2}33` }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] text-white/40">
        <Smartphone className="h-2.5 w-2.5" /> Mobilon is tökéletes
      </div>
    </div>
  )
}
