'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe, ShoppingBag, Calendar, LayoutTemplate, Users, Wrench, ArrowUpRight, Check, TrendingUp,
} from 'lucide-react'
import { SpotlightCard } from './SpotlightCard'

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
})

function CardHead({ icon: Icon, color, title, desc }: {
  icon: typeof Globe; color: string; title: string; desc: string
}) {
  return (
    <div className="relative z-10">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
          style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 group-hover:rotate-45 group-hover:border-white/25 group-hover:bg-white group-hover:text-black">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/50">{desc}</p>
    </div>
  )
}

export function BentoServices() {
  return (
    <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 md:grid-cols-6">
      {/* Responsive website — hero tile */}
      <motion.div {...reveal(0)} className="md:col-span-4">
        <Link href="/szolgaltatasok/bemutatkozo-weboldal" className="group block h-full">
          <SpotlightCard className="bento-card h-full min-h-[340px] p-7" rgb="14,165,233">
            <CardHead icon={Globe} color="#38bdf8" title="Bemutatkozó weboldal"
              desc="Az első benyomás számít. Gyors, mobilbarát oldal, ami bizalmat épít és ügyfelet hoz." />
            <DevicesIllustration />
          </SpotlightCard>
        </Link>
      </motion.div>

      {/* Webshop */}
      <motion.div {...reveal(1)} className="md:col-span-2">
        <Link href="/szolgaltatasok/webshop" className="group block h-full">
          <SpotlightCard className="bento-card h-full min-h-[340px] p-7" rgb="139,92,246">
            <CardHead icon={ShoppingBag} color="#a78bfa" title="Webshop"
              desc="Termék fel, rendelés be, pénz a számlán." />
            <CartIllustration />
          </SpotlightCard>
        </Link>
      </motion.div>

      {/* Booking */}
      <motion.div {...reveal(2)} className="md:col-span-2">
        <Link href="/szolgaltatasok/foglalasi-rendszer" className="group block h-full">
          <SpotlightCard className="bento-card h-full min-h-[320px] p-7" rgb="16,185,129">
            <CardHead icon={Calendar} color="#34d399" title="Foglalási rendszer"
              desc="Foglalás éjjel-nappal. Telefonálás nélkül." />
            <BookingIllustration />
          </SpotlightCard>
        </Link>
      </motion.div>

      {/* Landing */}
      <motion.div {...reveal(3)} className="md:col-span-2">
        <Link href="/szolgaltatasok/landing-page" className="group block h-full">
          <SpotlightCard className="bento-card h-full min-h-[320px] p-7" rgb="245,158,11">
            <CardHead icon={LayoutTemplate} color="#fbbf24" title="Landing page"
              desc="Egy oldal, egy cél: több érdeklődő a hirdetéseidből." />
            <ChartIllustration />
          </SpotlightCard>
        </Link>
      </motion.div>

      {/* CRM */}
      <motion.div {...reveal(4)} className="md:col-span-2">
        <Link href="/szolgaltatasok/crm" className="group block h-full">
          <SpotlightCard className="bento-card h-full min-h-[320px] p-7" rgb="244,63,94">
            <CardHead icon={Users} color="#fb7185" title="CRM rendszer"
              desc="Minden érdeklődő, ajánlat és ügyfél egy helyen. Semmi nem csúszik el." />
            <PipelineIllustration />
          </SpotlightCard>
        </Link>
      </motion.div>

      {/* Maintenance — wide tile */}
      <motion.div {...reveal(5)} className="md:col-span-6">
        <Link href="/szolgaltatasok/uzemeltetes" className="group block h-full">
          <SpotlightCard className="bento-card h-full p-7" rgb="148,163,184">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr]">
              <CardHead icon={Wrench} color="#cbd5e1" title="Üzemeltetés és karbantartás"
                desc="Frissítés, mentés, biztonság, support. Neked nem kell foglalkoznod vele. Nekünk ez a dolgunk." />
              <UptimeIllustration />
            </div>
          </SpotlightCard>
        </Link>
      </motion.div>
    </div>
  )
}

/* ============================ Illustrations ============================ */

function DevicesIllustration() {
  return (
    <div aria-hidden className="pointer-events-none relative mt-8 h-44 sm:h-48">
      {/* desktop */}
      <div className="absolute bottom-0 left-0 right-16 top-0 overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-[#0d0d16] transition-transform duration-500 group-hover:-translate-y-2 sm:right-28">
        <div className="flex gap-1 border-b border-white/[0.06] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-4 p-4">
          <div className="space-y-2">
            <div className="h-2 w-16 rounded bg-sky-400/60" />
            <div className="h-4 w-full rounded bg-white/15" />
            <div className="h-4 w-4/5 rounded bg-white/15" />
            <div className="h-2 w-3/5 rounded bg-white/[0.07]" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 rounded-md bg-gradient-to-r from-sky-500 to-cyan-400" />
              <div className="h-6 w-14 rounded-md border border-white/15" />
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-sky-500/40 via-cyan-400/20 to-transparent" />
        </div>
      </div>
      {/* phone */}
      <div className="absolute bottom-0 right-2 h-[92%] w-[88px] overflow-hidden rounded-t-[1.4rem] border border-b-0 border-white/15 bg-[#0d0d16] p-2 transition-transform delay-75 duration-500 group-hover:-translate-y-4 sm:right-6 sm:w-[100px]">
        <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-white/15" />
        <div className="space-y-1.5">
          <div className="h-12 rounded-lg bg-gradient-to-br from-sky-500/50 to-cyan-400/10" />
          <div className="h-2 w-full rounded bg-white/15" />
          <div className="h-2 w-3/4 rounded bg-white/10" />
          <div className="h-4 rounded-md bg-gradient-to-r from-sky-500 to-cyan-400" />
          <div className="grid grid-cols-2 gap-1">
            <div className="h-8 rounded bg-white/[0.06]" />
            <div className="h-8 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CartIllustration() {
  return (
    <div aria-hidden className="pointer-events-none relative mt-8 space-y-2">
      {[['Kerámia bögre', '5 990', 'from-violet-500/60 to-fuchsia-500/30'], ['Illatgyertya', '3 490', 'from-fuchsia-500/50 to-pink-500/20']].map(([n, p, g], i) => (
        <div key={n}
          className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5 transition-transform duration-500 group-hover:translate-x-1"
          style={{ transitionDelay: `${i * 60}ms` }}>
          <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${g}`} />
          <span className="flex-1 text-xs font-medium text-white/70">{n}</span>
          <span className="text-xs font-bold text-white">{p} Ft</span>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
        <span>Fizetés</span>
        <span>9 480 Ft</span>
      </div>
    </div>
  )
}

function BookingIllustration() {
  const slots = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00']
  return (
    <div aria-hidden className="pointer-events-none mt-7 grid grid-cols-3 gap-1.5">
      {slots.map((s, i) => (
        <span key={s}
          className={`rounded-lg py-2 text-center text-xs font-semibold ${i === 4 ? 'slot-pulse bg-emerald-500 text-white' : i === 1 ? 'bg-white/[0.03] text-white/20 line-through' : 'bg-white/[0.05] text-white/55'}`}>
          {s}
        </span>
      ))}
      <span className="col-span-3 mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
        <Check className="h-3.5 w-3.5" strokeWidth={3} /> Visszaigazolás e-mailben elküldve
      </span>
    </div>
  )
}

function ChartIllustration() {
  const bars = [28, 36, 30, 48, 44, 62, 58, 80]
  return (
    <div aria-hidden className="pointer-events-none mt-7">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg font-extrabold text-white">Több érdeklődő</span>
        <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-bold text-amber-300">
          <TrendingUp className="h-3 w-3" /> konverzió
        </span>
      </div>
      <div className="flex h-20 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-t-md"
            style={{ background: i === bars.length - 1 ? 'linear-gradient(to top, #f59e0b, #fde68a)' : 'rgba(255,255,255,0.08)' }}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    </div>
  )
}

function PipelineIllustration() {
  const cols = [
    { t: 'Új', c: '#fb7185', n: 3 },
    { t: 'Ajánlat', c: '#fbbf24', n: 2 },
    { t: 'Nyert', c: '#34d399', n: 1 },
  ]
  return (
    <div aria-hidden className="pointer-events-none mt-7 grid grid-cols-3 gap-2">
      {cols.map((col, ci) => (
        <div key={col.t} className="rounded-xl bg-white/[0.03] p-2">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/45">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: col.c }} /> {col.t}
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: col.n }).map((_, i) => (
              <div key={i}
                className={`rounded-md border border-white/[0.06] bg-white/[0.05] p-1.5 ${ci === 1 && i === 0 ? 'pipeline-move' : ''}`}>
                <div className="h-1.5 w-full rounded bg-white/20" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function UptimeIllustration() {
  return (
    <div aria-hidden className="pointer-events-none">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-2 font-semibold text-white/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Minden rendszer működik
        </span>
        <span className="text-white/40">Utolsó mentés: ma 03:00</span>
      </div>
      <div className="flex h-10 items-end gap-[3px]">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i}
            className={`flex-1 rounded-sm ${i === 17 ? 'bg-amber-400/80' : 'bg-emerald-400/70'}`}
            style={{ height: `${70 + ((i * 37) % 30)}%` }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Napi mentés', 'SSL tanúsítvány', 'Frissítések', 'Biztonsági figyelés'].map(t => (
          <span key={t} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/60">
            <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} /> {t}
          </span>
        ))}
      </div>
    </div>
  )
}
