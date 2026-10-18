'use client'

import { useEffect, useRef } from 'react'

const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#2dd4bf', '#e879f9', '#60a5fa', '#a78bfa', '#f472b6']

/** Slowly drifting outlined triangles behind the mobile menu (runs only while mounted). */
export function MenuParticles({ count = 70 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0, h = 0
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const parts = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 3 + Math.random() * 5,
      r: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.004,
      vy: -(0.08 + Math.random() * 0.22),
      vx: (Math.random() - 0.5) * 0.08,
      a: 0.25 + Math.random() * 0.5,
      c: PALETTE[i % PALETTE.length],
    }))

    let raf = 0
    let last = performance.now()
    const draw = (t: number) => {
      const dt = Math.min(48, t - last) / 16
      last = t
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (const p of parts) {
        if (!reduce) {
          p.y += p.vy * dt; p.x += p.vx * dt; p.r += p.vr * dt
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        }
        ctx.globalAlpha = p.a
        ctx.strokeStyle = p.c
        ctx.beginPath()
        for (let k = 0; k < 3; k++) {
          const ang = p.r + (k * Math.PI * 2) / 3
          const px = p.x + Math.cos(ang) * p.s, py = p.y + Math.sin(ang) * p.s
          if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [count])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
