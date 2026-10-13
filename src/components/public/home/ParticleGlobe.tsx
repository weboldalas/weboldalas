'use client'

import { useEffect, useRef } from 'react'

/*
 * Slowly rotating organic sphere made of tiny outlined triangles.
 * Performance:
 * - one <canvas>, triangles batched into 32 paths per frame (8 colors × 4 alpha buckets)
 * - DPR capped at 2, fewer particles on small screens
 * - paused while off-screen or the tab is hidden; a single static frame for reduced motion
 */

const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#2dd4bf', '#e879f9', '#60a5fa', '#a78bfa', '#f472b6']
// Weighted so violet dominates and amber sparks
const WEIGHTS = [5, 2, 1.5, 1.5, 1.2, 1.5, 3, 1]
const ALPHA_BUCKETS = [0.18, 0.4, 0.7, 1]

type Particle = { x: number; y: number; z: number; color: number; size: number; rot: number; spin: number }

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickColor(r: number) {
  const total = WEIGHTS.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i] / total
    if (r <= acc) return i
  }
  return 0
}

function buildParticles(count: number, ambient: number): Particle[] {
  const rand = mulberry32(7)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const out: Particle[] = []

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const x = Math.cos(th) * r
    const z = Math.sin(th) * r
    // organic, lumpy radius + a little volume
    const lump = 1 + 0.16 * Math.sin(3 * x + 2 * y) + 0.11 * Math.sin(5 * z - 3 * y + 1.3) + 0.07 * Math.sin(7 * x * z)
    const depth = 0.78 + rand() * 0.22
    out.push({
      x: x * lump * depth,
      y: y * lump * depth * 0.92,
      z: z * lump * depth,
      color: pickColor(rand()),
      size: 2.2 + rand() * 3.2,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.03,
    })
  }

  // sparse ambient particles around the globe
  for (let i = 0; i < ambient; i++) {
    const a = rand() * Math.PI * 2
    const d = 1.35 + rand() * 0.9
    out.push({
      x: Math.cos(a) * d,
      y: (rand() - 0.5) * 2.2,
      z: Math.sin(a) * d,
      color: pickColor(rand()),
      size: 2 + rand() * 2.5,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.02,
    })
  }
  return out
}

export function ParticleGlobe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 768px)').matches
    const particles = buildParticles(small ? 700 : 1500, small ? 50 : 110)
    const buckets = PALETTE.length * ALPHA_BUCKETS.length

    let dpr = 1
    let width = 0
    let height = 0
    let angle = 0.6
    let pointerX = 0
    let pointerY = 0
    let easedX = 0
    let easedY = 0
    let raf = 0
    let visible = true

    function resize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      if (reduceMotion) draw()
    }

    function draw() {
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const R = Math.min(width, height) * 0.41
      const cx = width / 2
      const cy = height / 2
      easedX += (pointerX - easedX) * 0.04
      easedY += (pointerY - easedY) * 0.04

      const a = angle + easedX * 0.5
      const tilt = -0.32 + easedY * 0.25
      const cosA = Math.cos(a), sinA = Math.sin(a)
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt)

      const paths: Path2D[] = Array.from({ length: buckets }, () => new Path2D())

      for (const p of particles) {
        const x1 = p.x * cosA - p.z * sinA
        const z1 = p.x * sinA + p.z * cosA
        const y2 = p.y * cosT - z1 * sinT
        const z2 = p.y * sinT + z1 * cosT

        const persp = 3 / (3 - z2)
        const sx = cx + x1 * R * persp
        const sy = cy + y2 * R * persp
        if (sx < -10 || sy < -10 || sx > width + 10 || sy > height + 10) continue

        const depth = Math.min(Math.max((z2 + 1.4) / 2.8, 0), 1)
        const bucket = Math.min(ALPHA_BUCKETS.length - 1, Math.floor(depth * ALPHA_BUCKETS.length))
        const s = p.size * (0.6 + persp * 0.5)
        if (!reduceMotion) p.rot += p.spin

        const path = paths[p.color * ALPHA_BUCKETS.length + bucket]
        const c = Math.cos(p.rot) * s, d = Math.sin(p.rot) * s
        // equilateral triangle: vertices at 0°, 120°, 240°
        path.moveTo(sx + c, sy + d)
        path.lineTo(sx + (-0.5 * c - 0.866 * d), sy + (0.866 * c - 0.5 * d))
        path.lineTo(sx + (-0.5 * c + 0.866 * d), sy + (-0.866 * c - 0.5 * d))
        path.closePath()
      }

      ctx.lineWidth = 1
      ctx.lineJoin = 'round'
      for (let ci = 0; ci < PALETTE.length; ci++) {
        ctx.strokeStyle = PALETTE[ci]
        for (let ai = 0; ai < ALPHA_BUCKETS.length; ai++) {
          ctx.globalAlpha = ALPHA_BUCKETS[ai]
          ctx.stroke(paths[ci * ALPHA_BUCKETS.length + ai])
        }
      }
      ctx.globalAlpha = 1
    }

    function loop() {
      angle += 0.0016
      draw()
      raf = requestAnimationFrame(loop)
    }

    function start() {
      if (reduceMotion || raf || !visible || document.visibilityState !== 'visible') return
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    function onPointer(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      pointerX = e.clientX / window.innerWidth - 0.5
      pointerY = e.clientY / window.innerHeight - 0.5
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') start()
      else stop()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    if (reduceMotion) draw()
    else start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />
}
