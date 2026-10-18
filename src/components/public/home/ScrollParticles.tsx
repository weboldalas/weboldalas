'use client'

import { useEffect, useRef } from 'react'
import { buildShape, mulberry32, CHAT_DOTS, GEARS, PROGRESS_R, type ShapeName } from './particleShapes'

/*
 * One fixed, full-viewport canvas of tiny outlined triangles that morphs between shapes on scroll.
 *
 * Anchors are plain elements on the page: <div data-particles="devices" />.
 * - A shape anchor draws its shape centred on the element (so it scrolls with the layout).
 * - data-particles="scatter" dissolves the cloud into a sparse ambient field across the viewport.
 * - data-particles="none" fades the cloud out completely (sections whose own visuals need the focus).
 * Between two anchors the cloud explodes outward and re-forms as the next shape.
 *
 * Performance: anchor positions are cached (re-measured only on resize / layout change), triangles are
 * batched into 32 paths per frame, DPR is capped, the loop stops when the tab is hidden, and
 * prefers-reduced-motion gets scroll-only redraws without the explosion.
 */

const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#2dd4bf', '#e879f9', '#60a5fa', '#a78bfa', '#f472b6']
const WEIGHTS = [5, 2, 1.5, 1.5, 1.2, 1.5, 3, 1]
const ALPHA_BUCKETS = [0.16, 0.38, 0.68, 1]
const SHAPES: ShapeName[] = ['devices', 'chat', 'pen', 'progress', 'rocket', 'gears', 'plane', 'cart', 'calendar', 'target', 'funnel', 'tag', 'hub']

// Per-shape camera: tilt (view from above) and how it turns (continuous spin or gentle sway)
const VIEW: Record<ShapeName, { tilt: number; spin?: number; sway: number }> = {
  devices: { tilt: -0.3, sway: 0.45 },
  chat: { tilt: -0.12, sway: 0.4 },
  pen: { tilt: -0.1, sway: 0.3 },
  progress: { tilt: -0.1, sway: 0.35 },
  rocket: { tilt: -0.15, sway: 0.45 },
  gears: { tilt: -0.12, sway: 0.25 },
  plane: { tilt: -0.25, sway: 0.4 },
  cart: { tilt: -0.18, sway: 0.4 },
  calendar: { tilt: -0.12, sway: 0.3 },
  target: { tilt: -0.08, sway: 0.35 },
  funnel: { tilt: -0.12, sway: 0.35 },
  tag: { tilt: -0.1, sway: 0.4 },
  hub: { tilt: -0.14, sway: 0.35 },
}

// `at` = scroll position where this state is fully reached
type Anchor = { shape: ShapeName | 'scatter' | 'none'; top: number; left: number; w: number; h: number; at: number }

// Morph pacing: wider window = calmer transitions; tau smooths fast scrolling over time.
const MORPH_FROM = 0.12
const MORPH_TO = 0.88
const SMOOTH_TAU_MS = 260
const STAGGER = 0.35
const EXPLODE = 0.16

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
    const delay = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      color[i] = pickColor(rand())
      size[i] = 2.2 + rand() * 3
      rot[i] = rand() * Math.PI * 2
      spin[i] = (rand() - 0.5) * 0.03
      const a = rand() * Math.PI * 2
      const m = 0.6 + rand() * 0.9
      dirX[i] = Math.cos(a) * m
      dirY[i] = Math.sin(a) * m
      delay[i] = rand() * STAGGER
      scatterU[i] = rand()
      scatterV[i] = rand()
      // only a fraction of particles stays visible in the ambient field
      scatterA[i] = rand() < (small ? 0.16 : 0.28) ? 0.2 + rand() * 0.35 : 0
    }

    const shapes = {} as Record<ShapeName, Float32Array>
    SHAPES.forEach((s, i) => { shapes[s] = buildShape(s, N, 100 + i * 17) })

    // sub-parts that animate in place (found by position, since point order is shuffled)
    const chatDot = new Int8Array(N).fill(-1)
    const gearOf = new Uint8Array(N)
    // progress ring: clockwise position 0..1 from 12 o'clock, or -1 for the check mark
    const ringPos = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const c = shapes.chat
      const cx = c[i * 3], cy = c[i * 3 + 1], cz = c[i * 3 + 2]
      CHAT_DOTS.forEach(([dx, dy], k) => { if (cz > 0.13 && Math.hypot(cx - dx, cy - dy) < 0.14) chatDot[i] = k })
      const g = shapes.gears
      const d0 = Math.hypot(g[i * 3] - GEARS[0].cx, g[i * 3 + 1] - GEARS[0].cy) - GEARS[0].r
      const d1 = Math.hypot(g[i * 3] - GEARS[1].cx, g[i * 3 + 1] - GEARS[1].cy) - GEARS[1].r
      gearOf[i] = d0 <= d1 ? 0 : 1
      const px = shapes.progress[i * 3], py = shapes.progress[i * 3 + 1]
      ringPos[i] = Math.hypot(px, py) > PROGRESS_R - 0.2 ? ((Math.atan2(px, -py) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) : -1
    }

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
    let progress = -1
    let lastTime = 0
    let now = 0

    function measure() {
      const sy = window.scrollY
      const vhNow = window.innerHeight
      const list: Anchor[] = []
      document.querySelectorAll<HTMLElement>('[data-particles]').forEach(el => {
        const r = el.getBoundingClientRect()
        const a = { shape: el.dataset.particles as Anchor['shape'], top: r.top + sy, left: r.left, w: r.width, h: r.height, at: 0 }
        if (a.shape === 'none') {
          // hold "empty" for the whole section: gone before it enters, back only after it leaves
          list.push({ ...a, at: a.top - vhNow * 0.8 }, { ...a, at: a.top + a.h - vhNow * 0.2 })
        } else {
          list.push({ ...a, at: a.top + a.h / 2 - vhNow / 2 })
        }
      })
      // keep every state reachable: a shape at the very top (mobile heroes sit above the viewport centre)
      // would otherwise get a negative `at` and start the page half-exploded; same for the bottom end
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vhNow)
      let prev = 0
      for (const a of list) {
        a.at = Math.max(prev, Math.min(maxScroll, Math.max(0, a.at)))
        prev = a.at
      }
      anchors = list
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

    // 6 s loop: fill 0→100% (eased), check fades in and holds, then everything eases back for the next run
    const prog = { fill: 1, check: 1, glow: 1 }
    function updateProgress() {
      if (reduceMotion) { prog.fill = 1; prog.check = 1; prog.glow = 1; return }
      const t = (now % 6000) / 6000
      const f = Math.min(1, t / 0.58)
      prog.fill = f * f * (3 - 2 * f)
      prog.check = smoothstep(0.58, 0.66, t) * (1 - smoothstep(0.86, 0.94, t))
      prog.glow = 1 - smoothstep(0.9, 1, t)
    }

    // screen position + alpha of particle i for a given anchor
    const tmp = { x: 0, y: 0, a: 0, s: 0 }
    function place(anchor: Anchor, i: number, sy: number, cosA: number, sinA: number, cosT: number, sinT: number) {
      if (anchor.shape === 'scatter' || anchor.shape === 'none') {
        tmp.x = scatterU[i] * vw
        tmp.y = scatterV[i] * vh
        tmp.a = anchor.shape === 'none' ? 0 : scatterA[i]
        tmp.s = 0.75
        return
      }
      const pts = shapes[anchor.shape]
      const R = Math.min(anchor.w, anchor.h, 640) * 0.42
      const cx = anchor.left + anchor.w / 2
      const cy = anchor.top + anchor.h / 2 - sy
      let x = pts[i * 3], y = pts[i * 3 + 1]
      const z = pts[i * 3 + 2]
      // living details
      if (!reduceMotion) {
        if (anchor.shape === 'chat' && chatDot[i] >= 0) {
          y -= 0.07 * Math.max(0, Math.sin(now * 0.006 - chatDot[i] * 0.9))
        } else if (anchor.shape === 'gears') {
          const g = GEARS[gearOf[i]]
          const a0 = now * 0.0005
          const a = gearOf[i] === 0 ? a0 : -a0 * (GEARS[0].teeth / GEARS[1].teeth) + Math.PI / GEARS[1].teeth
          const ca = Math.cos(a), sa = Math.sin(a)
          const lx = x - g.cx, ly = y - g.cy
          x = g.cx + lx * ca - ly * sa
          y = g.cy + lx * sa + ly * ca
        }
      }
      const x1 = x * cosA - z * sinA
      const z1 = x * sinA + z * cosA
      const y2 = y * cosT - z1 * sinT
      const z2 = y * sinT + z1 * cosT
      const persp = 3 / (3 - z2)
      tmp.x = cx + x1 * R * persp
      tmp.y = cy + y2 * R * persp
      tmp.a = 0.16 + 0.84 * Math.min(1, Math.max(0, (z2 + 1.2) / 2.4))
      tmp.s = Math.min(1.3, Math.max(0.6, R / 230)) * (0.6 + persp * 0.5)
      if (anchor.shape === 'progress') {
        const rp = ringPos[i]
        if (rp < 0) tmp.a *= prog.check
        else if (rp <= prog.fill) {
          tmp.a = Math.max(tmp.a, 0.75) * prog.glow + 0.18 * (1 - prog.glow)
          if (prog.fill < 1 && prog.fill - rp < 0.025) tmp.s *= 1.7 // bright head of the fill
        } else tmp.a = 0.18
      }
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

      // continuous progress through the anchors (k + morph fraction), with a hold around each anchor
      const pos = anchors.map(a => a.at)
      let target = 0
      if (sy >= pos[pos.length - 1]) target = anchors.length - 1
      else if (sy > pos[0]) {
        for (let k = 0; k < pos.length - 1; k++) {
          if (sy < pos[k + 1]) { target = k + smoothstep(MORPH_FROM, MORPH_TO, (sy - pos[k]) / Math.max(1, pos[k + 1] - pos[k])); break }
        }
      }
      // ease the displayed progress toward the scroll target, so fast flicks glide instead of jumping
      const dt = lastTime ? Math.min(64, time - lastTime) : 16
      lastTime = time
      if (progress < 0 || reduceMotion) progress = target
      else progress += (target - progress) * (1 - Math.exp(-dt / SMOOTH_TAU_MS))
      if (Math.abs(target - progress) < 0.0005) progress = target

      const ia = Math.min(anchors.length - 1, Math.floor(progress))
      const ib = Math.min(anchors.length - 1, ia + 1)
      const t = progress - ia
      const A = anchors[ia], B = anchors[ib]

      easedX += (pointerX - easedX) * 0.05
      easedY += (pointerY - easedY) * 0.05
      now = time
      updateProgress()
      const view = (k: Anchor['shape']) => (k === 'scatter' || k === 'none') ? VIEW.rocket : VIEW[k]
      const turn = (k: Anchor['shape']) => {
        if (reduceMotion) return 0
        const v = view(k)
        return v.spin ? time * v.spin : Math.sin(time * 0.00025) * v.sway
      }
      const spinA = turn(A.shape)
      const spinB = turn(B.shape)
      const tiltA = view(A.shape).tilt + easedY * 0.2
      const tiltB = view(B.shape).tilt + easedY * 0.2
      const cAa = Math.cos(spinA + easedX * 0.5), sAa = Math.sin(spinA + easedX * 0.5)
      const cAb = Math.cos(spinB + easedX * 0.5), sAb = Math.sin(spinB + easedX * 0.5)
      const cTa = Math.cos(tiltA), sTa = Math.sin(tiltA)
      const cTb = Math.cos(tiltB), sTb = Math.sin(tiltB)

      const solid = (k: Anchor['shape']) => k !== 'scatter' && k !== 'none'
      const explodeR = (solid(A.shape) && solid(B.shape) && ia !== ib && !reduceMotion)
        ? Math.min(A.w, A.h, 640) * EXPLODE
        : 0

      const paths: Path2D[] = Array.from({ length: PALETTE.length * ALPHA_BUCKETS.length }, () => new Path2D())

      for (let i = 0; i < N; i++) {
        place(A, i, sy, cAa, sAa, cTa, sTa)
        const ax = tmp.x, ay = tmp.y, aa = tmp.a, as = tmp.s
        let x = ax, y = ay, alpha = aa, s = as
        if (ia !== ib && t > 0) {
          // staggered, eased per-particle progress: the cloud flows instead of snapping all at once
          let ti = Math.min(1, Math.max(0, (t - delay[i]) / (1 - STAGGER)))
          ti = ti * ti * (3 - 2 * ti)
          place(B, i, sy, cAb, sAb, cTb, sTb)
          const burst = explodeR * Math.sin(Math.PI * ti)
          x = ax + (tmp.x - ax) * ti + dirX[i] * burst
          y = ay + (tmp.y - ay) * ti + dirY[i] * burst
          alpha = aa + (tmp.a - aa) * ti
          s = as + (tmp.s - as) * ti
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
