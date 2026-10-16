/*
 * Point clouds for the scroll-morphing particle visual.
 * Every shape returns exactly `n` points as a flat Float32Array [x, y, z, x, y, z, …]
 * in a normalized space roughly within [-1, 1]. Screen y grows downwards, so "up" is negative y.
 *
 * Story down the page: devices → chat → pen → progress ring → rocket → gears → paper plane.
 */

export type ShapeName = 'devices' | 'chat' | 'pen' | 'progress' | 'rocket' | 'gears' | 'plane'

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

const builders: Record<ShapeName, (n: number, rand: Rand) => number[]> = {
  devices, chat, pen, progress, rocket, gears, plane,
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
