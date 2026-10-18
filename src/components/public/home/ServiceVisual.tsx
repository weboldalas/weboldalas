'use client'

import { useEffect, useRef } from 'react'

/*
 * Small line-art animations that explain each service (DESIGN.md: 1px outlines on black,
 * electric-iris / saffron-spark accents, no fills or cards).
 * Pure CSS animations; they only run while visible (the wrapper flips --sv-play),
 * and prefers-reduced-motion shows the static, fully drawn frame.
 */

export type ServiceKind = 'web' | 'shop' | 'booking' | 'landing' | 'crm' | 'ops' | 'erp'

const LINE = 'rgba(255,255,255,0.28)'
const IRIS = 'var(--color-electric-iris)'
const SAFFRON = 'var(--color-saffron-spark)'
const VERDANT = '#2dd4bf'

function Web() {
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      <rect x="20" y="14" width="240" height="132" rx="10" stroke={LINE} />
      <path d="M20 34 H260" stroke={LINE} />
      <circle cx="33" cy="24" r="3" stroke={LINE} /><circle cx="44" cy="24" r="3" stroke={LINE} /><circle cx="55" cy="24" r="3" stroke={LINE} />
      <path className="sv-draw" style={{ animationDelay: '0s' }} pathLength={1} d="M38 52 H150" stroke="#fff" />
      <path className="sv-draw" style={{ animationDelay: '0.25s' }} pathLength={1} d="M38 64 H126" stroke="#fff" />
      <path className="sv-draw" style={{ animationDelay: '0.5s' }} pathLength={1} d="M38 80 H118" stroke={LINE} />
      <rect className="sv-draw" style={{ animationDelay: '0.75s' }} pathLength={1} x="38" y="98" width="58" height="18" rx="9" stroke={IRIS} />
      <rect className="sv-draw" style={{ animationDelay: '1s' }} pathLength={1} x="168" y="48" width="74" height="72" rx="6" stroke={LINE} />
      <path className="sv-draw" style={{ animationDelay: '1.2s' }} pathLength={1} d="M176 108 L196 84 L210 98 L222 88 L234 108" stroke={SAFFRON} />
      <path className="sv-cursor" d="M0 0 L0 13 L4 10 L7 16 L9 15 L6 9 L11 9 Z" stroke="#fff" fill="#000" />
    </svg>
  )
}

function Shop() {
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      <path d="M86 60 H98 L112 118 H186 L198 74 H104" stroke={LINE} strokeLinejoin="round" />
      <circle cx="122" cy="132" r="6" stroke={LINE} /><circle cx="176" cy="132" r="6" stroke={LINE} />
      {[0, 1, 2].map(i => (
        <polygon key={i} className="sv-drop" style={{ animationDelay: `${i * 0.9}s` }}
          points={`${136 + i * 16},14 ${144 + i * 16},28 ${128 + i * 16},28`} stroke={[IRIS, SAFFRON, VERDANT][i]} />
      ))}
      <circle cx="200" cy="56" r="11" stroke={IRIS} />
      {['1', '2', '3'].map((n, i) => (
        <text key={n} className="sv-count" style={{ animationDelay: `${0.7 + i * 0.9}s` }} x="200" y="60" textAnchor="middle"
          fill="#fff" fontSize="11" fontFamily="inherit">{n}</text>
      ))}
    </svg>
  )
}

function Booking() {
  const cells = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) cells.push([58 + c * 24, 40 + r * 24])
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      <path d="M50 28 H230" stroke={LINE} />
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="16" height="16" rx="4" stroke={[3, 9, 17, 22].includes(i) ? 'rgba(255,255,255,0.1)' : LINE} />
      ))}
      <rect className="sv-pick" x="56" y="38" width="20" height="20" rx="6" stroke={IRIS} strokeWidth="1.5" />
      <path className="sv-check" pathLength={1} d="M134 92 L139 97 L148 86" stroke={SAFFRON} strokeWidth="1.5" />
    </svg>
  )
}

function Landing() {
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      {[30, 56, 80, 104, 130].map((y, i) => (
        <path key={y} className="sv-flow" style={{ animationDelay: `${i * 0.35}s` }}
          d={`M18 ${y} C 110 ${y}, 120 80, 186 80`} stroke={i % 2 ? SAFFRON : IRIS} strokeDasharray="6 10" />
      ))}
      {[30, 56, 80, 104, 130].map(y => <path key={`b${y}`} d={`M18 ${y} C 110 ${y}, 120 80, 186 80`} stroke="rgba(255,255,255,0.08)" />)}
      <rect className="sv-pulse" x="188" y="66" width="76" height="28" rx="14" stroke={IRIS} />
      <path d="M212 80 H236 M230 74 L236 80 L230 86" stroke="#fff" />
    </svg>
  )
}

function Crm() {
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      {[0, 1, 2].map(c => (
        <g key={c}>
          <path d={`M${30 + c * 80} 26 H${90 + c * 80}`} stroke={[IRIS, SAFFRON, VERDANT][c]} />
          {[0, 1].map(r => <rect key={r} x={30 + c * 80} y={40 + r * 30 + (c === 0 ? 30 : 0)} width="60" height="22" rx="5" stroke={LINE} />)}
        </g>
      ))}
      <g className="sv-move">
        <rect x="30" y="40" width="60" height="22" rx="5" stroke="#fff" />
        <path d="M38 51 H70" stroke="#fff" />
      </g>
    </svg>
  )
}

function Ops() {
  const beat = 'M10 96 H70 L82 96 L90 70 L100 122 L110 50 L120 104 L128 96 H190 L200 96 L208 74 L216 112 L224 96 H270'
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      <path d={beat} stroke="rgba(255,255,255,0.12)" />
      <path className="sv-beat" pathLength={1} d={beat} stroke={IRIS} strokeWidth="1.5" strokeDasharray="0.22 0.78" />
      <circle className="sv-blink" cx="30" cy="34" r="4" fill={VERDANT} />
      <text x="42" y="38" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="inherit" letterSpacing="0.5">ONLINE</text>
      <path d="M210 28 L224 34 V44 C224 52 218 56 210 60 C202 56 196 52 196 44 V34 Z" stroke={LINE} />
      <path className="sv-check" pathLength={1} d="M204 43 L209 48 L217 39" stroke={SAFFRON} />
    </svg>
  )
}

function Erp() {
  // departments around one shared core; data keeps flowing between them
  const mods = [
    { x: 30, y: 22, t: 'Pénzügy' }, { x: 30, y: 68, t: 'Raktár' }, { x: 30, y: 114, t: 'Beszerzés' },
    { x: 190, y: 22, t: 'Értékesítés' }, { x: 190, y: 68, t: 'Gyártás' }, { x: 190, y: 114, t: 'HR' },
  ]
  return (
    <svg viewBox="0 0 280 160" className="h-full w-full" fill="none" strokeWidth="1">
      {mods.map((m, i) => {
        const left = m.x < 140
        const d = `M${left ? m.x + 60 : m.x} ${m.y + 12} C ${left ? 112 : 168} ${m.y + 12}, ${left ? 104 : 176} 80, ${left ? 112 : 168} 80`
        return (
          <g key={m.t}>
            <path d={d} stroke="rgba(255,255,255,0.1)" />
            <path className="sv-flow" style={{ animationDelay: `${i * 0.27}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }} d={d} stroke={[IRIS, SAFFRON, VERDANT][i % 3]} strokeDasharray="4 12" />
            <rect x={m.x} y={m.y} width="60" height="24" rx="6" stroke={LINE} />
            <text x={m.x + 30} y={m.y + 15.5} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="inherit">{m.t}</text>
          </g>
        )
      })}
      <rect className="sv-pulse" x="112" y="62" width="56" height="36" rx="9" stroke={IRIS} strokeWidth="1.5" />
      <text x="140" y="84" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="inherit" letterSpacing="1">ERP</text>
    </svg>
  )
}

const visuals: Record<ServiceKind, () => React.ReactElement> = {
  web: Web, shop: Shop, booking: Booking, landing: Landing, crm: Crm, ops: Ops, erp: Erp,
}

export function ServiceVisual({ kind, className = '' }: { kind: ServiceKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      el.style.setProperty('--sv-play', e.isIntersecting ? 'running' : 'paused')
    }, { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Visual = visuals[kind]
  return (
    <div ref={ref} aria-hidden className={`sv ${className}`}>
      <Visual />
    </div>
  )
}
