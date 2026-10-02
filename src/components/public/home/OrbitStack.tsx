'use client'

import Image from 'next/image'
import {
  Globe, ShieldCheck, DatabaseBackup, RefreshCw, Search, BarChart3, Mail, Gauge,
} from 'lucide-react'

const inner = [
  { icon: Globe, label: 'Domain', color: '#38bdf8' },
  { icon: ShieldCheck, label: 'SSL', color: '#34d399' },
  { icon: DatabaseBackup, label: 'Mentés', color: '#a78bfa' },
  { icon: RefreshCw, label: 'Frissítés', color: '#fbbf24' },
]

const outer = [
  { icon: Search, label: 'SEO', color: '#f472b6' },
  { icon: BarChart3, label: 'Analitika', color: '#22d3ee' },
  { icon: Mail, label: 'E-mail', color: '#fb923c' },
  { icon: Gauge, label: 'Sebesség', color: '#4ade80' },
]

function Ring({
  items, radius, duration, reverse = false, offset = 0,
}: {
  items: typeof inner; radius: string; duration: number; reverse?: boolean; offset?: number
}) {
  return (
    <div
      className="orbit-ring home-anim absolute inset-0"
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      {items.map((it, i) => {
        const Icon = it.icon
        const angle = offset + (360 / items.length) * i
        return (
          <div
            key={it.label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(${radius}) rotate(${-angle}deg)` }}
          >
            <div
              className="orbit-ring home-anim -translate-x-1/2 -translate-y-1/2"
              style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'normal' : 'reverse' }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#11111b] shadow-xl sm:h-14 sm:w-14"
                  style={{ boxShadow: `0 10px 30px -10px ${it.color}88, inset 0 1px 0 rgba(255,255,255,0.06)` }}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: it.color }} />
                </span>
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/60 backdrop-blur">
                  {it.label}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function OrbitStack() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[460px]" style={{ containerType: 'inline-size' }}>
      {/* rings */}
      <div className="absolute inset-[18%] rounded-full border border-dashed border-white/10" />
      <div className="absolute inset-[2%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[30%] rounded-full bg-sky-500/10 blur-3xl" />

      <Ring items={inner} radius="30cqw" duration={36} offset={20} />
      <Ring items={outer} radius="43cqw" duration={52} reverse offset={65} />

      {/* core */}
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-[#0f172a] to-[#0b0b13] shadow-[0_0_80px_rgba(14,165,233,0.35)] sm:h-28 sm:w-28">
        <span className="core-pulse home-anim absolute inset-0 rounded-[1.75rem] border border-sky-400/40" />
        <Image src="/weboldalas-logo.svg" alt="" width={84} height={12} className="w-[70%]" />
      </div>
    </div>
  )
}
