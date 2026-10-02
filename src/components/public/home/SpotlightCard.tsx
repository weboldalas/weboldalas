'use client'

import { useRef } from 'react'

/**
 * Card with a cursor-following glow border + soft inner light.
 * `rgb` is a comma separated RGB triplet, e.g. "14,165,233".
 */
export function SpotlightCard({
  children,
  className = '',
  rgb = '14,165,233',
}: {
  children: React.ReactNode
  className?: string
  rgb?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`spotlight-card ${className}`}
      style={{ '--spot': rgb } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
