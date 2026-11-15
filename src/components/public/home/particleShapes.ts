/*
 * Point clouds for the scroll-morphing particle visual.
 * Every shape returns exactly `n` points as a flat Float32Array [x, y, z, x, y, z, …]
 * in a normalized space roughly within [-1, 1]. Screen y grows downwards, so "up" is negative y.
 *
 * Story down the page: devices → chat → pen → progress ring → rocket → gears → paper plane.
 */

import { LION } from './lionPath'

export type ShapeName =
  | 'devices' | 'chat' | 'pen' | 'progress' | 'rocket' | 'gears' | 'plane'
  // sub-page heroes
  | 'cart' | 'calendar' | 'target' | 'funnel' | 'tag' | 'hub'
  // case-study heroes
  | 'cartridge' | 'log' | 'padel' | 'market' | 'sunrise' | 'lion'

export function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rand = () => number
type Seg = [number, number, number, number]
type Seg3 = [number, number, number, number, number, number]
type V3 = [number, number, number]

/** Distribute `count` points along 2D segments (at depth z), proportionally to length. */
function alongSegments(out: number[], segs: Seg[], count: number, rand: Rand, thickness = 0.03, depth = 0.08, z = 0) {
  along3D(out, segs.map(([x1, y1, x2, y2]) => [x1, y1, z, x2, y2, z] as Seg3), count, rand, thickness, depth)
}

/** Distribute `count` points along 3D segments, proportionally to length. */
function along3D(out: number[], segs: Seg3[], count: number, rand: Rand, thickness = 0.02, depth = 0.02) {
  const lengths = segs.map(([x1, y1, z1, x2, y2, z2]) => Math.hypot(x2 - x1, y2 - y1, z2 - z1))
  const total = lengths.reduce((a, b) => a + b, 0)
  for (let i = 0; i < count; i++) {
    let d = rand() * total
    let k = 0
    while (k < segs.length - 1 && d > lengths[k]) { d -= lengths[k]; k++ }
    const [x1, y1, z1, x2, y2, z2] = segs[k]
    const t = lengths[k] ? d / lengths[k] : 0
    out.push(
      x1 + (x2 - x1) * t + (rand() - 0.5) * thickness * 2,
      y1 + (y2 - y1) * t + (rand() - 0.5) * thickness * 2,
      z1 + (z2 - z1) * t + (rand() - 0.5) * depth * 2,
    )
  }
}

/** Random points on a 3D triangle (sparse surface fill). */
function onTriangle(out: number[], a: V3, b: V3, c: V3, count: number, rand: Rand) {
  for (let i = 0; i < count; i++) {
    let u = rand(), v = rand()
    if (u + v > 1) { u = 1 - u; v = 1 - v }
    out.push(
      a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v,
      a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v,
      a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v,
    )
  }
}

/** Points on a surface of revolution around the y axis, area-weighted by radius. */
function revolution(out: number[], profile: (y: number) => number, y0: number, y1: number, count: number, rand: Rand, rMax: number) {
  let made = 0
  let guard = 0
  while (made < count && guard < count * 50) {
    guard++
    const y = y0 + rand() * (y1 - y0)
    const r = profile(y)
    if (r <= 0 || rand() * rMax > r) continue
    const a = rand() * Math.PI * 2
    out.push(Math.cos(a) * r, y, Math.sin(a) * r)
    made++
  }
}

function rect(x0: number, y0: number, x1: number, y1: number): Seg[] {
  return [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]]
}

/** Rounded rectangle outline as short segments. */
function roundRect(x0: number, y0: number, x1: number, y1: number, r: number, steps = 5): Seg[] {
  const pts: [number, number][] = []
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (i / steps) * (Math.PI / 2)
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
  }
  corner(x1 - r, y0 + r, -Math.PI / 2)
  corner(x1 - r, y1 - r, 0)
  corner(x0 + r, y1 - r, Math.PI / 2)
  corner(x0 + r, y0 + r, Math.PI)
  return pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return [p[0], p[1], q[0], q[1]] as Seg })
}

function circle(cx: number, cy: number, r: number, steps = 12): Seg[] {
  const segs: Seg[] = []
  for (let i = 0; i < steps; i++) {
    const a1 = (i / steps) * Math.PI * 2
    const a2 = ((i + 1) / steps) * Math.PI * 2
    segs.push([cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r])
  }
  return segs
}

/* ------------------------------------------------------------------ */

/** Laptop (screen + keyboard deck) with a phone standing in front: "sites that work on every device". */
function devices(n: number, rand: Rand) {
  const out: number[] = []
  // screen, leaning back slightly
  const sz = (y: number) => (y - 0.12) * 0.22
  const screen = (segs: Seg[], count: number, th = 0.012) =>
    along3D(out, segs.map(([x1, y1, x2, y2]) => [x1, y1, sz(y1), x2, y2, sz(y2)] as Seg3), count, rand, th, 0.01)
  screen(roundRect(-1, -0.78, 0.42, 0.12, 0.05), Math.round(n * 0.2))
  screen([[-0.9, -0.62, 0.32, -0.62]], Math.round(n * 0.04))
  screen(rect(-0.86, -0.5, -0.3, -0.06), Math.round(n * 0.07))
  screen([[-0.18, -0.48, 0.26, -0.48], [-0.18, -0.36, 0.18, -0.36], [-0.18, -0.24, 0.22, -0.24], [-0.18, -0.1, 0.02, -0.1]], Math.round(n * 0.07))
  // keyboard deck (horizontal plane at y = 0.16, coming toward the viewer)
  const deckY = 0.16
  along3D(out, [
    [-1.06, deckY, 0, 0.48, deckY, 0], [0.48, deckY, 0, 0.54, deckY, 0.52],
    [0.54, deckY, 0.52, -1.12, deckY, 0.52], [-1.12, deckY, 0.52, -1.06, deckY, 0],
  ], Math.round(n * 0.15), rand, 0.01, 0.01)
  const rows: Seg3[] = []
  for (let r = 0; r < 4; r++) {
    const z = 0.08 + r * 0.06
    rows.push([-0.98 - z * 0.08, deckY, z, 0.42 + z * 0.08, deckY, z])
  }
  along3D(out, rows, Math.round(n * 0.1), rand, 0.008, 0.008)
  along3D(out, [[-0.5, deckY, 0.36, -0.06, deckY, 0.36], [-0.06, deckY, 0.36, -0.05, deckY, 0.48], [-0.05, deckY, 0.48, -0.51, deckY, 0.48], [-0.51, deckY, 0.48, -0.5, deckY, 0.36]],
    Math.round(n * 0.04), rand, 0.008, 0.008)
  // phone in front, right
  const pz = 0.5
  alongSegments(out, roundRect(0.58, -0.42, 0.98, 0.42, 0.07), Math.round(n * 0.16), rand, 0.01, 0.01, pz)
  alongSegments(out, [[0.72, -0.34, 0.84, -0.34]], Math.round(n * 0.02), rand, 0.008, 0.008, pz)
  alongSegments(out, [[0.65, -0.2, 0.9, -0.2], [0.65, -0.1, 0.84, -0.1], ...rect(0.65, 0.02, 0.91, 0.24), [0.7, 0.32, 0.86, 0.32]],
    n - out.length / 3, rand, 0.008, 0.008, pz)
  return out
}

/** Puffy speech bubble with three "typing" dots (dots animate at runtime, see CHAT_DOTS). */
export const CHAT_DOTS: [number, number][] = [[-0.38, -0.14], [0, -0.14], [0.38, -0.14]]

function chat(n: number, rand: Rand) {
  const out: number[] = []
  const outline: Seg[] = [...roundRect(-0.95, -0.7, 0.95, 0.42, 0.32, 7)]
  // tail
  outline.push([-0.62, 0.42, -0.72, 0.82], [-0.72, 0.82, -0.3, 0.42])
  // two layers give the bubble thickness
  alongSegments(out, outline, Math.round(n * 0.3), rand, 0.015, 0.01, 0.12)
  alongSegments(out, outline, Math.round(n * 0.22), rand, 0.015, 0.01, -0.12)
  // sparse side wall
  for (let i = 0; i < Math.round(n * 0.08); i++) {
    const s = outline[Math.floor(rand() * outline.length)]
    const t = rand()
    out.push(s[0] + (s[2] - s[0]) * t, s[1] + (s[3] - s[1]) * t, (rand() - 0.5) * 0.24)
  }
  // dots (filled discs at the front)
  const rest = n - out.length / 3
  for (let i = 0; i < rest; i++) {
    const [cx, cy] = CHAT_DOTS[i % 3]
    const a = rand() * Math.PI * 2
    const r = 0.11 * Math.sqrt(rand())
    out.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.14)
  }
  return out
}

/** Vector pen tool drawing a Bézier curve with anchor points and handles. */
function pen(n: number, rand: Rand) {
  const out: number[] = []
  const dy = 0.06
  const nib: Seg[] = [
    [-0.17, -0.95 + dy, 0.17, -0.95 + dy], [0.17, -0.95 + dy, 0.17, -0.5 + dy], [-0.17, -0.5 + dy, -0.17, -0.95 + dy],
    [-0.17, -0.5 + dy, -0.34, -0.12 + dy], [-0.34, -0.12 + dy, 0, 0.26 + dy], [0, 0.26 + dy, 0.34, -0.12 + dy], [0.34, -0.12 + dy, 0.17, -0.5 + dy],
    [-0.17, -0.5 + dy, 0.17, -0.5 + dy],
  ]
  alongSegments(out, nib, Math.round(n * 0.26), rand, 0.012, 0.01, 0.06)
  alongSegments(out, nib, Math.round(n * 0.16), rand, 0.012, 0.01, -0.06)
  alongSegments(out, [[0, -0.12 + dy, 0, 0.24 + dy], ...circle(0, -0.18 + dy, 0.06, 8)], Math.round(n * 0.06), rand, 0.008, 0.02)
  // cubic Bézier passing under the pen tip
  const P0: [number, number] = [-1, 0.72], C1: [number, number] = [-0.5, 0.05], C2: [number, number] = [0.45, 0.95], P3: [number, number] = [1, 0.3]
  const bez = (t: number) => {
    const u = 1 - t
    return [
      u * u * u * P0[0] + 3 * u * u * t * C1[0] + 3 * u * t * t * C2[0] + t * t * t * P3[0],
      u * u * u * P0[1] + 3 * u * u * t * C1[1] + 3 * u * t * t * C2[1] + t * t * t * P3[1],
    ]
  }
  const curve: Seg[] = []
  for (let i = 0; i < 24; i++) { const a = bez(i / 24), b = bez((i + 1) / 24); curve.push([a[0], a[1], b[0], b[1]]) }
  alongSegments(out, curve, Math.round(n * 0.24), rand, 0.01, 0.02)
  // handles + anchors
  alongSegments(out, [[P0[0], P0[1], C1[0], C1[1]], [P3[0], P3[1], C2[0], C2[1]]], Math.round(n * 0.08), rand, 0.006, 0.01)
  alongSegments(out, [...rect(P0[0] - 0.05, P0[1] - 0.05, P0[0] + 0.05, P0[1] + 0.05), ...rect(P3[0] - 0.05, P3[1] - 0.05, P3[0] + 0.05, P3[1] + 0.05),
    ...circle(C1[0], C1[1], 0.04, 6), ...circle(C2[0], C2[1], 0.04, 6)], n - out.length / 3, rand, 0.006, 0.01)
  return out
}

/** Progress ring that fills to 100% and then shows a check mark (fill + check animate at runtime). */
export const PROGRESS_R = 0.78

function progress(n: number, rand: Rand) {
  const out: number[] = []
  // ring band: two edges + sparse fill, with a little depth
  const ringCount = Math.round(n * 0.78)
  for (let i = 0; i < ringCount; i++) {
    const a = rand() * Math.PI * 2
    const band = rand()
    const r = band < 0.36 ? PROGRESS_R - 0.06 : band < 0.72 ? PROGRESS_R + 0.06 : PROGRESS_R + (rand() - 0.5) * 0.12
    out.push(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 0.08)
  }
  // check mark in the middle
  alongSegments(out, [[-0.34, 0.02, -0.08, 0.28], [-0.08, 0.28, 0.38, -0.26]], n - out.length / 3, rand, 0.03, 0.05)
  return out
}

function rocket(n: number, rand: Rand) {
  const out: number[] = []
  const body = (y: number) => {
    if (y < -0.5) return 0.3 * Math.sqrt(Math.max(0, (y + 0.95) / 0.45)) // ogive nose
    if (y < 0.4) return 0.3
    return 0.3 - (y - 0.4) * 0.4
  }
  revolution(out, body, -0.95, 0.55, Math.round(n * 0.6), rand, 0.3)
  // window
  alongSegments(out, circle(0, -0.25, 0.1, 10), Math.round(n * 0.05), rand, 0.01, 0.02)
  // fins
  alongSegments(out, [[-0.3, 0.15, -0.6, 0.6], [-0.6, 0.6, -0.24, 0.55], [0.3, 0.15, 0.6, 0.6], [0.6, 0.6, 0.24, 0.55]], Math.round(n * 0.15), rand, 0.02, 0.05)
  // flame (loose cone)
  const rest = n - out.length / 3
  for (let i = 0; i < rest; i++) {
    const t = rand()
    const r = (1 - t) * 0.2 * Math.sqrt(rand())
    const a = rand() * Math.PI * 2
    out.push(Math.cos(a) * r, 0.62 + t * 0.45, Math.sin(a) * r)
  }
  return out
}

/** Two meshing gears; they spin at runtime around these centres (see GEARS). */
export const GEARS = [
  { cx: -0.34, cy: 0.12, r: 0.5, teeth: 10 },
  { cx: 0.5, cy: -0.34, r: 0.3, teeth: 6 },
] as const

function gearOutline(cx: number, cy: number, r: number, teeth: number, depth = 0.09): Seg[] {
  const pts: [number, number][] = []
  const steps = teeth * 8
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const phase = ((a / (Math.PI * 2)) * teeth) % 1
    const tooth = phase < 0.45 ? 1 : 0 // flat-topped teeth
    const rr = r + tooth * depth
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  return pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return [p[0], p[1], q[0], q[1]] as Seg })
}

function gears(n: number, rand: Rand) {
  const out: number[] = []
  GEARS.forEach((g, gi) => {
    const share = gi === 0 ? 0.62 : 0.38
    const budget = Math.round(n * share)
    const outline = gearOutline(g.cx, g.cy, g.r, g.teeth)
    alongSegments(out, outline, Math.round(budget * 0.32), rand, 0.008, 0.01, 0.07)
    alongSegments(out, outline, Math.round(budget * 0.24), rand, 0.008, 0.01, -0.07)
    alongSegments(out, [...circle(g.cx, g.cy, g.r * 0.62, 18), ...circle(g.cx, g.cy, g.r * 0.2, 10)], Math.round(budget * 0.24), rand, 0.008, 0.06)
    const spokes: Seg[] = []
    for (let s = 0; s < 5; s++) {
      const a = (s / 5) * Math.PI * 2
      spokes.push([g.cx + Math.cos(a) * g.r * 0.2, g.cy + Math.sin(a) * g.r * 0.2, g.cx + Math.cos(a) * g.r * 0.62, g.cy + Math.sin(a) * g.r * 0.62])
    }
    const take = gi === 0 ? Math.round(budget * 0.2) : n - out.length / 3
    alongSegments(out, spokes, take, rand, 0.012, 0.05)
  })
  return out
}

/** Folded paper plane with a dotted flight trail: "send us a message". */
function plane(n: number, rand: Rand) {
  const out: number[] = []
  const nose: V3 = [0.95, -0.42, 0]
  const tail: V3 = [-0.7, 0.02, 0]
  const wingL: V3 = [-0.86, 0.2, -0.72]
  const wingR: V3 = [-0.86, 0.2, 0.72]
  const keel: V3 = [-0.6, 0.38, 0]
  const edges: Seg3[] = [
    [...nose, ...wingL], [...nose, ...wingR], [...nose, ...tail], [...wingL, ...tail], [...wingR, ...tail], [...nose, ...keel], [...keel, ...tail],
  ]
  along3D(out, edges, Math.round(n * 0.5), rand, 0.01, 0.01)
  onTriangle(out, nose, wingL, tail, Math.round(n * 0.1), rand)
  onTriangle(out, nose, wingR, tail, Math.round(n * 0.1), rand)
  onTriangle(out, nose, keel, tail, Math.round(n * 0.08), rand)
  // dotted trail curving back from the tail
  const rest = n - out.length / 3
  for (let i = 0; i < rest; i++) {
    const t = (Math.floor(rand() * 8) + 1) / 9
    const px = -0.8 - 0.2 * t
    const py = 0.3 + 0.6 * t + 0.1 * Math.sin(Math.PI * t)
    out.push(px + (rand() - 0.5) * 0.04, py + (rand() - 0.5) * 0.04, (rand() - 0.5) * 0.04)
  }
  // three-quarter view from slightly above, so both wings are visible
  const yaw = 0.7, pitch = 0.6
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i], y = out[i + 1], z = out[i + 2]
    const x1 = x * cy - z * sy
    const z1 = x * sy + z * cy
    out[i] = x1
    out[i + 1] = y * cp - z1 * sp
    out[i + 2] = y * sp + z1 * cp
  }
  return out
}

/* ---------------------------- sub-page shapes ---------------------------- */

/** Shopping cart with products dropping in (webshop). */
function cart(n: number, rand: Rand) {
  const out: number[] = []
  const basket: Seg[] = [
    [-1, -0.62, -0.78, -0.62], [-0.78, -0.62, -0.56, 0.32], [-0.56, 0.32, 0.66, 0.32], [0.66, 0.32, 0.86, -0.36], [0.86, -0.36, -0.7, -0.36],
  ]
  alongSegments(out, basket, Math.round(n * 0.3), rand, 0.012, 0.01, 0.12)
  alongSegments(out, basket, Math.round(n * 0.2), rand, 0.012, 0.01, -0.12)
  // basket grid
  alongSegments(out, [[-0.36, -0.36, -0.28, 0.32], [0.04, -0.36, 0.04, 0.32], [0.44, -0.36, 0.36, 0.32], [-0.64, -0.02, 0.76, -0.02]], Math.round(n * 0.12), rand, 0.008, 0.1)
  // wheels
  alongSegments(out, [...circle(-0.42, 0.56, 0.12, 12), ...circle(0.52, 0.56, 0.12, 12)], Math.round(n * 0.12), rand, 0.01, 0.04)
  // products hovering above the basket
  const items: [number, number, number][] = [[-0.28, -0.82, 0.16], [0.18, -0.95, 0.13], [0.55, -0.74, 0.11]]
  items.forEach(([cx, cy, r], k) => {
    const take = k < 2 ? Math.round(n * 0.08) : n - out.length / 3
    alongSegments(out, k === 1 ? circle(cx, cy, r, 10) : rect(cx - r, cy - r, cx + r, cy + r), take, rand, 0.01, 0.03)
  })
  return out
}

/** Month calendar with a highlighted booking (booking system). */
function calendar(n: number, rand: Rand) {
  const out: number[] = []
  alongSegments(out, roundRect(-0.95, -0.78, 0.95, 0.85, 0.08), Math.round(n * 0.22), rand, 0.01, 0.02)
  alongSegments(out, [[-0.95, -0.48, 0.95, -0.48]], Math.round(n * 0.06), rand, 0.01, 0.02)
  // binder rings
  alongSegments(out, [[-0.5, -0.92, -0.5, -0.64], [0.5, -0.92, 0.5, -0.64]], Math.round(n * 0.05), rand, 0.012, 0.03)
  // day cells 7×4
  const cells: Seg[] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const x = -0.82 + c * 0.24, y = -0.36 + r * 0.29
    if (r === 2 && c === 4) continue
    cells.push(...rect(x, y, x + 0.12, y + 0.12))
  }
  alongSegments(out, cells, Math.round(n * 0.45), rand, 0.006, 0.02)
  // the booked day: ring + check
  const bx = -0.82 + 4 * 0.24 + 0.06, by = -0.36 + 2 * 0.29 + 0.06
  alongSegments(out, [...circle(bx, by, 0.16, 14), [bx - 0.07, by, bx - 0.01, by + 0.06], [bx - 0.01, by + 0.06, bx + 0.08, by - 0.06]],
    n - out.length / 3, rand, 0.01, 0.06)
  return out
}

/** Bullseye with an arrow in the centre (landing page: one goal). */
function target(n: number, rand: Rand) {
  const out: number[] = []
  ;[0.9, 0.64, 0.38].forEach((r, k) => alongSegments(out, circle(0, 0, r, 40), Math.round(n * [0.26, 0.2, 0.14][k]), rand, 0.012, 0.03, -0.04 * k))
  // centre disc
  for (let i = 0; i < Math.round(n * 0.1); i++) {
    const a = rand() * Math.PI * 2, r = 0.12 * Math.sqrt(rand())
    out.push(Math.cos(a) * r, Math.sin(a) * r, 0.04)
  }
  // arrow coming from the upper right
  along3D(out, [
    [0.02, -0.02, 0.06, 0.7, -0.7, 0.36],
    // fletching
    [0.7, -0.7, 0.36, 0.84, -0.66, 0.38], [0.7, -0.7, 0.36, 0.66, -0.84, 0.38],
    [0.62, -0.62, 0.32, 0.76, -0.58, 0.34], [0.62, -0.62, 0.32, 0.58, -0.76, 0.34],
  ],
    n - out.length / 3, rand, 0.01, 0.01)
  return out
}

/** Sales funnel chart: leads drop in on top, three narrowing stages, a won client at the bottom (CRM). */
function funnel(n: number, rand: Rand) {
  const out: number[] = []
  const bands: Seg[] = [
    ...trap(-0.62, -0.24, 0.92, 0.68),
    ...trap(-0.14, 0.22, 0.6, 0.38),
    ...trap(0.32, 0.62, 0.3, 0.12),
  ]
  alongSegments(out, bands, Math.round(n * 0.36), rand, 0.012, 0.01, 0.06)
  alongSegments(out, bands, Math.round(n * 0.24), rand, 0.012, 0.01, -0.06)
  // leads waiting above the funnel
  const leads: [number, number][] = [[-0.5, -0.86], [-0.18, -0.94], [0.16, -0.84], [0.48, -0.92]]
  leads.forEach(([x, y]) => alongSegments(out, circle(x, y, 0.055, 8), Math.round(n * 0.035), rand, 0.008, 0.03))
  // won client: a ring with a check mark
  alongSegments(out, circle(0, 0.84, 0.1, 12), Math.round(n * 0.07), rand, 0.008, 0.03)
  const rest = n - out.length / 3
  alongSegments(out, [[-0.045, 0.84, -0.01, 0.875], [-0.01, 0.875, 0.05, 0.8]], rest, rand, 0.008, 0.02)
  return out
}

/** Trapezoid outline from y0 (half-width w0) to y1 (half-width w1). */
function trap(y0: number, y1: number, w0: number, w1: number): Seg[] {
  return [[-w0, y0, w0, y0], [w0, y0, w1, y1], [w1, y1, -w1, y1], [-w1, y1, -w0, y0]]
}

/** Price tag on a string (pricing). */
function tag(n: number, rand: Rand) {
  const out: number[] = []
  const body: Seg[] = [[-0.55, -0.55, 0.65, -0.55], [0.65, -0.55, 0.95, 0], [0.95, 0, 0.65, 0.55], [0.65, 0.55, -0.55, 0.55], [-0.55, 0.55, -0.55, -0.55]]
  alongSegments(out, body, Math.round(n * 0.32), rand, 0.012, 0.01, 0.06)
  alongSegments(out, body, Math.round(n * 0.22), rand, 0.012, 0.01, -0.06)
  alongSegments(out, circle(0.6, 0, 0.09, 12), Math.round(n * 0.08), rand, 0.008, 0.04)
  // "Ft" lines inside
  alongSegments(out, [[-0.36, -0.24, 0.26, -0.24], [-0.36, 0, 0.12, 0], [-0.36, 0.24, 0.3, 0.24]], Math.round(n * 0.18), rand, 0.012, 0.03)
  // string
  const rest = n - out.length / 3
  for (let i = 0; i < rest; i++) {
    const t = rand()
    out.push(0.6 + t * 0.35 + Math.sin(t * 6) * 0.04, -t * 0.9, (rand() - 0.5) * 0.02)
  }
  return out
}

/** ERP: a central core connected to the company's departments (modules around it). */
function hub(n: number, rand: Rand) {
  const out: number[] = []
  // core
  alongSegments(out, roundRect(-0.26, -0.2, 0.26, 0.2, 0.06), Math.round(n * 0.16), rand, 0.01, 0.01, 0.05)
  alongSegments(out, roundRect(-0.26, -0.2, 0.26, 0.2, 0.06), Math.round(n * 0.08), rand, 0.01, 0.01, -0.05)
  alongSegments(out, [[-0.14, -0.06, 0.14, -0.06], [-0.14, 0.06, 0.06, 0.06]], Math.round(n * 0.06), rand, 0.01, 0.02)
  // six modules on a hexagon, each linked to the core
  const mods: Seg[] = []
  const links: Seg[] = []
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 3
    const cx = Math.cos(a) * 0.78, cy = Math.sin(a) * 0.66
    mods.push(...roundRect(cx - 0.15, cy - 0.1, cx + 0.15, cy + 0.1, 0.04, 3))
    const sx = Math.cos(a) * 0.3, sy = Math.sin(a) * 0.24
    links.push([sx, sy, cx - Math.cos(a) * 0.17, cy - Math.sin(a) * 0.12])
  }
  alongSegments(out, mods, Math.round(n * 0.44), rand, 0.01, 0.02)
  const rest = n - out.length / 3
  alongSegments(out, links, rest, rand, 0.006, 0.01)
  return out
}

/** Sealant cartridge loaded in a caulking gun, lying diagonally (Helkem case study). */
function cartridge(n: number, rand: Rand) {
  const out: number[] = []
  const R = 0.27
  // cartridge: body, back cap, shoulder and tapered nozzle
  revolution(out, (y) => (y >= -0.42 ? R : 0), -0.42, 0.85, Math.round(n * 0.28), rand, R)
  for (let i = 0, m = Math.round(n * 0.04); i < m; i++) {
    const r = 0.07 + Math.sqrt(rand()) * (R - 0.07), t = rand() * Math.PI * 2
    out.push(Math.cos(t) * r, -0.42, Math.sin(t) * r)
  }
  revolution(out, () => 0.07, -0.56, -0.42, Math.round(n * 0.03), rand, 0.07)
  revolution(out, (y) => 0.016 + ((y + 1.12) / 0.56) * 0.05, -1.12, -0.56, Math.round(n * 0.09), rand, 0.066)
  for (const y of [-0.1, 0.5]) {
    const ring = circle(0, 0, R + 0.005, 28).map(([x1, z1, x2, z2]) => [x1, y, z1, x2, y, z2] as Seg3)
    along3D(out, ring, Math.round(n * 0.035), rand, 0.006, 0.006)
  }
  // gun: front and rear plates
  for (const [y, r0, m] of [[-0.47, 0.08, 0.05], [0.9, 0, 0.05]] as const) {
    for (let i = 0, k = Math.round(n * m); i < k; i++) {
      const r = r0 + Math.sqrt(rand()) * (0.33 - r0), t = rand() * Math.PI * 2
      out.push(Math.cos(t) * r, y + (rand() - 0.5) * 0.02, Math.sin(t) * r)
    }
  }
  // open half-tube cradle on the handle side
  for (let i = 0, k = Math.round(n * 0.12); i < k; i++) {
    const t = (rand() - 0.5) * Math.PI, r = 0.315
    out.push(Math.cos(t) * r, -0.47 + rand() * 1.37, Math.sin(t) * r)
  }
  // plunger rod with its pull ring
  alongSegments(out, [[0.1, 0.9, 0.1, 1.55]], Math.round(n * 0.05), rand, 0.012, 0.012)
  alongSegments(out, circle(0.1, 1.63, 0.08, 14), Math.round(n * 0.03), rand, 0.01, 0.012)
  // pistol grip and trigger
  const quad = (pts: [number, number][]): Seg[] => pts.map(([x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return [x, y, x2, y2] })
  alongSegments(out, quad([[0.32, 0.84], [1.02, 1.04], [0.98, 1.2], [0.32, 1.0]]), Math.round(n * 0.08), rand, 0.01, 0.06)
  alongSegments(out, quad([[0.32, 0.64], [1.0, 0.82], [0.96, 0.93], [0.32, 0.76]]), Math.round(n * 0.06), rand, 0.01, 0.05)
  // centre, shrink to fit, lay diagonally
  const a = 0.75, c = Math.cos(a), sn = Math.sin(a), k = 0.86
  for (let i = 0; i < out.length; i += 3) {
    const x = (out[i] - 0.35) * k, y = (out[i + 1] - 0.26) * k
    out[i] = x * c - y * sn
    out[i + 1] = x * sn + y * c
    out[i + 2] *= k
  }
  return out
}

/** Timber log with end-grain rings on its cut face, lying diagonally (Sztanfa case study). */
function log(n: number, rand: Rand) {
  const out: number[] = []
  const R = 0.4, y0 = -0.85, y1 = 0.85
  // bark: slightly wavy cylinder surface
  for (let i = 0, m = Math.round(n * 0.3); i < m; i++) {
    const t = rand() * Math.PI * 2, y = y0 + rand() * (y1 - y0)
    const r = R * (1 + 0.035 * Math.sin(t * 7 + y * 5))
    out.push(Math.cos(t) * r, y, Math.sin(t) * r)
  }
  // front cut face: concentric growth rings, slightly off-centre
  for (let k = 1; k <= 7; k++) {
    const r = (k / 7) * R * 0.98
    const ring = circle(0.02, 0.015, r, 40).map(([x1, z1, x2, z2]) => [x1, y0, z1, x2, y0, z2] as Seg3)
    along3D(out, ring, Math.round(n * (0.035 + k * 0.011)), rand, 0.006, 0.006)
  }
  for (let i = 0, m = Math.round(n * 0.06); i < m; i++) {
    const r = Math.sqrt(rand()) * R, t = rand() * Math.PI * 2
    out.push(Math.cos(t) * r, y0, Math.sin(t) * r)
  }
  // back face rim
  const rim = circle(0, 0, R, 40).map(([x1, z1, x2, z2]) => [x1, y1, z1, x2, y1, z2] as Seg3)
  along3D(out, rim, Math.round(n * 0.05), rand, 0.008, 0.008)
  // tip the cut face toward the viewer, then lay diagonally
  const b = -0.6, cb = Math.cos(b), sb = Math.sin(b), a = 0.85, ca = Math.cos(a), sa = Math.sin(a)
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i], y = out[i + 1], z = out[i + 2]
    const y2 = y * cb - z * sb, z2 = y * sb + z * cb
    out[i] = x * ca - y2 * sa
    out[i + 1] = x * sa + y2 * ca
    out[i + 2] = z2
  }
  return out
}

/** Perforated padel racket with a ball (Nádas Padel Club case study). */
function padel(n: number, rand: Rand) {
  const out: number[] = []
  const cy = 0.32, rx = 0.46, ry = 0.52
  // head outline (thick rim on both faces)
  const head: Seg[] = []
  for (let i = 0; i < 48; i++) {
    const a1 = (i / 48) * Math.PI * 2, a2 = ((i + 1) / 48) * Math.PI * 2
    head.push([Math.cos(a1) * rx, cy + Math.sin(a1) * ry, Math.cos(a2) * rx, cy + Math.sin(a2) * ry])
  }
  alongSegments(out, head, Math.round(n * 0.2), rand, 0.014, 0.05)
  // face: sparse fill + perforation holes in a grid
  for (let i = 0, m = Math.round(n * 0.16); i < m; i++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 0.94
    out.push(Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, (rand() - 0.5) * 0.02)
  }
  const holes: Seg[] = []
  for (let gx = -3; gx <= 3; gx++) {
    for (let gy = -3; gy <= 3; gy++) {
      const x = gx * 0.11 + (gy % 2 ? 0.055 : 0), y = cy + gy * 0.11
      if ((x / (rx * 0.8)) ** 2 + ((y - cy) / (ry * 0.8)) ** 2 > 1) continue
      holes.push(...circle(x, y, 0.028, 8))
    }
  }
  alongSegments(out, holes, Math.round(n * 0.26), rand, 0.004, 0.012)
  // throat and handle
  alongSegments(out, [[-0.16, cy - ry * 0.93, -0.05, -0.38], [0.16, cy - ry * 0.93, 0.05, -0.38]], Math.round(n * 0.06), rand, 0.012, 0.04)
  revolution(out, () => 0.055, -0.95, -0.38, Math.round(n * 0.12), rand, 0.055)
  // ball, beside the racket head
  const bx = 0.62, by = 0.78, br = 0.12
  for (let i = 0, m = Math.round(n * 0.1); i < m; i++) {
    const u = rand() * 2 - 1, t = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u)
    out.push(bx + Math.cos(t) * s * br, by + u * br, Math.sin(t) * s * br)
  }
  // lean the racket diagonally and recentre
  const a = -0.5, c = Math.cos(a), sn = Math.sin(a)
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i] - 0.1, y = out[i + 1] - 0.05
    out[i] = x * c - y * sn
    out[i + 1] = x * sn + y * c
  }
  return out
}

/** Open market pavilion with a zigzag gable roof on columns (Csabai Piac case study). */
function market(n: number, rand: Rand) {
  const out: number[] = []
  const xs = [-0.9, -0.3, 0.3, 0.9], peaks = [-0.6, 0, 0.6]
  const yv = 0.12, yp = 0.42, z0 = -0.45, z1 = 0.45, yg = -0.62
  // roof planes (sparse fill) and roof edges
  const roofEdges: Seg3[] = []
  for (let g = 0; g < 3; g++) {
    const l = xs[g], r = xs[g + 1], p = peaks[g]
    for (const [xa, xb] of [[l, p], [p, r]]) {
      const ya = xa === p ? yp : yv, yb = xb === p ? yp : yv
      onTriangle(out, [xa, ya, z0], [xb, yb, z0], [xb, yb, z1], Math.round(n * 0.045), rand)
      onTriangle(out, [xa, ya, z0], [xb, yb, z1], [xa, ya, z1], Math.round(n * 0.045), rand)
      roofEdges.push([xa, ya, z0, xb, yb, z0], [xa, ya, z1, xb, yb, z1])
    }
    roofEdges.push([p, yp, z0, p, yp, z1])
  }
  for (const x of xs) roofEdges.push([x, yv, z0, x, yv, z1])
  along3D(out, roofEdges, Math.round(n * 0.22), rand, 0.008, 0.008)
  // columns under the valleys, front and back
  const cols: Seg3[] = []
  for (const x of xs) for (const z of [z0 + 0.05, z1 - 0.05]) cols.push([x, yv, z, x, yg, z])
  along3D(out, cols, Math.round(n * 0.12), rand, 0.01, 0.01)
  // market stalls: low counters under each gable
  const stalls: Seg3[] = []
  for (const p of peaks) {
    for (const z of [-0.18, 0.18]) {
      const a = p - 0.18, b = p + 0.18, h = yg + 0.2
      stalls.push([a, h, z - 0.08, b, h, z - 0.08], [a, h, z + 0.08, b, h, z + 0.08], [a, h, z - 0.08, a, h, z + 0.08], [b, h, z - 0.08, b, h, z + 0.08])
      stalls.push([a, h, z - 0.08, a, yg, z - 0.08], [b, h, z - 0.08, b, yg, z - 0.08])
    }
  }
  along3D(out, stalls, Math.round(n * 0.1), rand, 0.006, 0.006)
  // ground outline
  along3D(out, [[-1, yg, z0 - 0.1, 1, yg, z0 - 0.1], [-1, yg, z1 + 0.1, 1, yg, z1 + 0.1], [-1, yg, z0 - 0.1, -1, yg, z1 + 0.1], [1, yg, z0 - 0.1, 1, yg, z1 + 0.1]], Math.round(n * 0.06), rand, 0.006, 0.006)
  // turn three-quarter and look slightly down from above
  const a = -0.55, ca = Math.cos(a), sa = Math.sin(a), b = -0.32, cb = Math.cos(b), sb = Math.sin(b)
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i] * 0.9, y = out[i + 1] * 0.9 + 0.05, z = out[i + 2] * 0.9
    const x2 = x * ca + z * sa, z2 = -x * sa + z * ca
    out[i] = x2
    out[i + 1] = -(y * cb - z2 * sb) // screen y points down
    out[i + 2] = y * sb + z2 * cb
  }
  return out
}

/** Sun rising over waves, after the bath's logo (Árpád Fürdő case study). Screen y points down. */
function sunrise(n: number, rand: Rand) {
  const out: number[] = []
  // sun: glowing disc with a crisp rim, sitting on the waterline
  const cx = 0, cy = -0.18, R = 0.42
  const rim = circle(cx, cy, R, 60).filter(([, y1, , y2]) => y1 < 0.17 && y2 < 0.17)
  alongSegments(out, rim, Math.round(n * 0.16), rand, 0.01, 0.05)
  for (let i = 0, m = Math.round(n * 0.22); i < m; i++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.94
    const y = cy + Math.sin(a) * r
    if (y > 0.16) continue // the sea hides the bottom of the sun
    out.push(cx + Math.cos(a) * r, y, (rand() - 0.5) * 0.06)
  }
  // short rays around the upper half
  const rays: Seg[] = []
  for (let k = 0; k < 9; k++) {
    const a = Math.PI + (k / 8) * Math.PI
    rays.push([cx + Math.cos(a) * (R + 0.08), cy + Math.sin(a) * (R + 0.08), cx + Math.cos(a) * (R + 0.2), cy + Math.sin(a) * (R + 0.2)])
  }
  alongSegments(out, rays, Math.round(n * 0.1), rand, 0.008, 0.03)
  // three rolling waves in front of the sun, each a little deeper and wider
  for (let w = 0; w < 3; w++) {
    const y0 = 0.2 + w * 0.2, amp = 0.06, half = 0.85 + w * 0.08, z = 0.12 + w * 0.12
    const segs: Seg3[] = []
    for (let i = 0; i < 40; i++) {
      const x1 = -half + (i / 40) * 2 * half, x2 = -half + ((i + 1) / 40) * 2 * half
      const f = (x: number) => y0 - amp * Math.sin(x * 6.5 + w * 1.3)
      segs.push([x1, f(x1), z, x2, f(x2), z])
    }
    along3D(out, segs, Math.round(n * (0.15 - w * 0.01)), rand, 0.014, 0.03)
  }
  return out
}

/** Roar's geometric lion head: the logo's line art, with the muzzle pushed toward the viewer. */
function lion(n: number, rand: Rand) {
  const out: number[] = []
  const segs: Seg[] = LION.map(([x1, y1, x2, y2]) => [x1 * 1.02, y1 * 1.02 + 0.02, x2 * 1.02, y2 * 1.02 + 0.02])
  alongSegments(out, segs, n, rand, 0.006, 0.006)
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i], y = out[i + 1]
    out[i + 2] += 0.14 * Math.max(0, 1 - (x * x) / 0.55 - ((y - 0.15) * (y - 0.15)) / 0.9)
  }
  return out
}

const builders: Record<ShapeName, (n: number, rand: Rand) => number[]> = {
  devices, chat, pen, progress, rocket, gears, plane,
  cart, calendar, target, funnel, tag, hub,
  cartridge,
  log,
  padel,
  market,
  sunrise,
  lion,
}

export function buildShape(name: ShapeName, n: number, seed: number): Float32Array {
  const pts = builders[name](n, mulberry32(seed))
  // pad / trim to exactly n points
  const arr = new Float32Array(n * 3)
  const have = pts.length / 3
  for (let i = 0; i < n; i++) {
    const src = (i < have ? i : i % Math.max(1, have)) * 3
    arr[i * 3] = pts[src] ?? 0
    arr[i * 3 + 1] = pts[src + 1] ?? 0
    arr[i * 3 + 2] = pts[src + 2] ?? 0
  }
  // shuffle so morphs scatter instead of sliding in order
  const rand = mulberry32(seed * 31 + 7)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    for (let k = 0; k < 3; k++) {
      const t = arr[i * 3 + k]
      arr[i * 3 + k] = arr[j * 3 + k]
      arr[j * 3 + k] = t
    }
  }
  return arr
}
