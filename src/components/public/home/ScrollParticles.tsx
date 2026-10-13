'use client'

import { useEffect, useRef } from 'react'
import { buildShape, mulberry32, type ShapeName } from './particleShapes'

/*
 * One fixed, full-viewport canvas of tiny outlined triangles that morphs between shapes on scroll.
 *
 * Anchors are plain elements on the page: <div data-particles="globe" />.
 * - A shape anchor draws its shape centred on the element (so it scrolls with the layout).
 * - data-particles="scatter" dissolves the cloud into a sparse ambient field across the viewport.
 * Between two anchors the cloud explodes outward and re-forms as the next shape.
 *
 * Performance: anchor positions are cached (re-measured only on resize / layout change), triangles are
 * batched into 32 paths per frame, DPR is capped, the loop stops when the tab is hidden, and
 * prefers-reduced-motion gets scroll-only redraws without the explosion.
 */

const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#2dd4bf', '#e879f9', '#60a5fa', '#a78bfa', '#f472b6']
const WEIGHTS = [5, 2, 1.5, 1.5, 1.2, 1.5, 3, 1]
const ALPHA_BUCKETS = [0.16, 0.38, 0.68, 1]
const SHAPES: ShapeName[] = ['globe', 'bulb', 'window', 'code', 'rocket', 'shield']

type Anchor = { shape: ShapeName | 'scatter'; top: number; left: number; w: number; h: number }

function pickColor(r: number) {
  const total = WEIGHTS.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i] / total
    if (r <= acc) return i
  }
  return 0
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 768px)').matches
    const N = small ? 750 : 1400

    // per-particle attributes
    const rand = mulberry32(42)
    const color = new Uint8Array(N)
    const size = new Float32Array(N)
    const rot = new Float32Array(N)
    const spin = new Float32Array(N)
    const dirX = new Float32Array(N)
    const dirY = new Float32Array(N)
    const scatterU = new Float32Array(N)
    const scatterV = new Float32Array(N)
    const scatterA = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      color[i] = pickColor(rand())
      size[i] = 2.2 + rand() * 3
      rot[i] = rand() * Math.PI * 2
      spin[i] = (rand() - 0.5) * 0.03
      const a = rand() * Math.PI * 2
      const m = 0.6 + rand() * 0.9
      dirX[i] = Math.cos(a) * m
      dirY[i] = Math.sin(a) * m
      scatterU[i] = rand()
      scatterV[i] = rand()
      // only a fraction of particles stays visible in the ambient field
      scatterA[i] = rand() < (small ? 0.16 : 0.28) ? 0.2 + rand() * 0.35 : 0
    }

    const shapes = {} as Record<ShapeName, Float32Array>
    SHAPES.forEach((s, i) => { shapes[s] = buildShape(s, N, 100 + i * 17) })

    let anchors: Anchor[] = []
    let pageBottom = Infinity
    let dpr = 1
    let vw = 0
    let vh = 0
    let raf = 0
    let pointerX = 0
    let pointerY = 0
    let easedX = 0
    let easedY = 0

    function measure() {
      const sy = window.scrollY
      anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-particles]')).map(el => {
        const r = el.getBoundingClientRect()
        return { shape: el.dataset.particles as Anchor['shape'], top: r.top + sy, left: r.left, w: r.width, h: r.height }
      })
      const page = canvas?.closest('.void-page')
      if (page) pageBottom = page.getBoundingClientRect().bottom + sy
    }

    function resize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(vh * dpr)
      measure()
      requestDraw()
    }

    // screen position + alpha of particle i for a given anchor
    const tmp = { x: 0, y: 0, a: 0, s: 0 }
    function place(anchor: Anchor, i: number, sy: number, cosA: number, sinA: number, cosT: number, sinT: number) {
      if (anchor.shape === 'scatter') {
        tmp.x = scatterU[i] * vw
        tmp.y = scatterV[i] * vh
        tmp.a = scatterA[i]
        tmp.s = 0.75
        return
      }
      const pts = shapes[anchor.shape]
      const R = Math.min(anchor.w, anchor.h, 640) * 0.42
      const cx = anchor.left + anchor.w / 2
      const cy = anchor.top + anchor.h / 2 - sy
      const x = pts[i * 3], y = pts[i * 3 + 1], z = pts[i * 3 + 2]
      const x1 = x * cosA - z * sinA
      const z1 = x * sinA + z * cosA
      const y2 = y * cosT - z1 * sinT
      const z2 = y * sinT + z1 * cosT
      const persp = 3 / (3 - z2)
      tmp.x = cx + x1 * R * persp
      tmp.y = cy + y2 * R * persp
      tmp.a = 0.16 + 0.84 * Math.min(1, Math.max(0, (z2 + 1.2) / 2.4))
      tmp.s = Math.min(1.3, Math.max(0.6, R / 230)) * (0.6 + persp * 0.5)
    }

    function draw(time: number) {
      if (!ctx || !anchors.length) return
      const sy = window.scrollY
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, vw, vh)

      // never paint over the footer below the page
      const clipBottom = pageBottom - sy
      if (clipBottom <= 0) return
      ctx.save()
      if (clipBottom < vh) {
        ctx.beginPath()
        ctx.rect(0, 0, vw, clipBottom)
        ctx.clip()
      }

      // which two anchors are we between?
      const pos = anchors.map(a => a.top + a.h / 2 - vh / 2)
      let ia = 0, ib = 0, t = 0
      if (sy >= pos[pos.length - 1]) { ia = ib = anchors.length - 1 }
      else if (sy > pos[0]) {
        for (let k = 0; k < pos.length - 1; k++) {
          if (sy < pos[k + 1]) { ia = k; ib = k + 1; t = smoothstep(0.22, 0.78, (sy - pos[k]) / (pos[k + 1] - pos[k])); break }
        }
      }
      const A = anchors[ia], B = anchors[ib]

      easedX += (pointerX - easedX) * 0.05
      easedY += (pointerY - easedY) * 0.05
      const osc = reduceMotion ? 0 : Math.sin(time * 0.00025) * 0.45
      const spinA = A.shape === 'globe' ? time * 0.00012 : osc
      const spinB = B.shape === 'globe' ? time * 0.00012 : osc
      // the globe is viewed slightly from above so its parallels read as ellipses
      const tiltA = (A.shape === 'globe' ? -0.42 : -0.15) + easedY * 0.2
      const tiltB = (B.shape === 'globe' ? -0.42 : -0.15) + easedY * 0.2
      const cAa = Math.cos(spinA + easedX * 0.5), sAa = Math.sin(spinA + easedX * 0.5)
      const cAb = Math.cos(spinB + easedX * 0.5), sAb = Math.sin(spinB + easedX * 0.5)
      const cTa = Math.cos(tiltA), sTa = Math.sin(tiltA)
      const cTb = Math.cos(tiltB), sTb = Math.sin(tiltB)

      const explodeR = (A.shape !== 'scatter' && B.shape !== 'scatter' && ia !== ib && !reduceMotion)
        ? Math.sin(Math.PI * t) * Math.min(A.w, A.h, 640) * 0.55
        : 0

      const paths: Path2D[] = Array.from({ length: PALETTE.length * ALPHA_BUCKETS.length }, () => new Path2D())

      for (let i = 0; i < N; i++) {
        place(A, i, sy, cAa, sAa, cTa, sTa)
        const ax = tmp.x, ay = tmp.y, aa = tmp.a, as = tmp.s
        let x = ax, y = ay, alpha = aa, s = as
        if (ia !== ib && t > 0) {
          place(B, i, sy, cAb, sAb, cTb, sTb)
          x = ax + (tmp.x - ax) * t + dirX[i] * explodeR
          y = ay + (tmp.y - ay) * t + dirY[i] * explodeR
          alpha = aa + (tmp.a - aa) * t
          s = as + (tmp.s - as) * t
        }
        if (alpha < 0.05 || x < -12 || y < -12 || x > vw + 12 || y > vh + 12) continue

        if (!reduceMotion) rot[i] += spin[i]
        const sz = size[i] * s
        const c = Math.cos(rot[i]) * sz, d = Math.sin(rot[i]) * sz
        const bucket = Math.min(ALPHA_BUCKETS.length - 1, Math.floor(alpha * ALPHA_BUCKETS.length))
        const path = paths[color[i] * ALPHA_BUCKETS.length + bucket]
        path.moveTo(x + c, y + d)
        path.lineTo(x - 0.5 * c - 0.866 * d, y + 0.866 * c - 0.5 * d)
        path.lineTo(x - 0.5 * c + 0.866 * d, y - 0.866 * c - 0.5 * d)
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
      ctx.restore()
    }

    function loop(time: number) {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    // reduced motion: draw only when something changed
    let pending = 0
    function requestDraw() {
      if (!reduceMotion || pending) return
      pending = requestAnimationFrame(() => { pending = 0; draw(0) })
    }

    function start() {
      if (reduceMotion || raf || document.visibilityState !== 'visible') return
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

    const ro = new ResizeObserver(() => { measure(); requestDraw() })
    ro.observe(document.body)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', requestDraw, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    document.fonts?.ready.then(() => { measure(); requestDraw() })

    resize()
    start()

    return () => {
      stop()
      cancelAnimationFrame(pending)
      ro.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', requestDraw)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}
