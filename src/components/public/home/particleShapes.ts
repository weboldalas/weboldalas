/*
 * Point clouds for the scroll-morphing particle visual.
 * Every shape returns exactly `n` points as a flat Float32Array [x, y, z, x, y, z, …]
 * in a normalized space roughly within [-1, 1]. Screen y grows downwards, so "up" is negative y.
 */

export type ShapeName = 'globe' | 'bulb' | 'window' | 'code' | 'rocket' | 'shield'

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

/** Distribute `count` points along a polyline of segments, proportionally to length. */
function alongSegments(out: number[], segs: Seg[], count: number, rand: Rand, thickness = 0.03, depth = 0.08) {
  const lengths = segs.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1))
  const total = lengths.reduce((a, b) => a + b, 0)
  for (let i = 0; i < count; i++) {
    let d = rand() * total
    let k = 0
    while (k < segs.length - 1 && d > lengths[k]) { d -= lengths[k]; k++ }
    const [x1, y1, x2, y2] = segs[k]
    const t = lengths[k] ? d / lengths[k] : 0
    out.push(
      x1 + (x2 - x1) * t + (rand() - 0.5) * thickness * 2,
      y1 + (y2 - y1) * t + (rand() - 0.5) * thickness * 2,
      (rand() - 0.5) * depth * 2,
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

function circle(cx: number, cy: number, r: number, steps = 10): Seg[] {
  const segs: Seg[] = []
  for (let i = 0; i < steps; i++) {
    const a1 = (i / steps) * Math.PI * 2
    const a2 = ((i + 1) / steps) * Math.PI * 2
    segs.push([cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, cx + Math.cos(a2) * r, cy + Math.sin(a2) * r])
  }
  return segs
}

function globe(n: number, rand: Rand) {
  // Wireframe globe: meridians + parallels read instantly as "globe" while it rotates.
  const out: number[] = []
  const onSphere = (lat: number, lon: number, jitter = 0.012) => {
    const r = 1 + (rand() - 0.5) * jitter * 2
    out.push(Math.cos(lat) * Math.cos(lon) * r, -Math.sin(lat) * r, Math.cos(lat) * Math.sin(lon) * r)
  }
  const meridians = 9
  const parallels = [-60, -30, 0, 30, 60].map(d => (d * Math.PI) / 180)
  const lineShare = Math.round(n * 0.78)
  const perMeridian = Math.round((lineShare * 0.52) / meridians)
  for (let m = 0; m < meridians; m++) {
    const lon = (m / meridians) * Math.PI
    for (let k = 0; k < perMeridian; k++) {
      // full great circle through the poles
      const a = rand() * Math.PI * 2
      out.push(Math.cos(a) * Math.cos(lon), -Math.sin(a), Math.cos(a) * Math.sin(lon))
    }
  }
  const parallelBudget = lineShare - meridians * perMeridian
  const weights = parallels.map(lat => Math.cos(lat))
  const wSum = weights.reduce((a, b) => a + b, 0)
  parallels.forEach((lat, i) => {
    const count = Math.round((parallelBudget * weights[i]) / wSum)
    for (let k = 0; k < count; k++) onSphere(lat, rand() * Math.PI * 2, 0.008)
  })
  // sparse surface "cities"
  while (out.length / 3 < n) {
    const u = rand() * 2 - 1
    onSphere(Math.asin(u), rand() * Math.PI * 2, 0.03)
  }
  return out
}

function bulb(n: number, rand: Rand) {
  const out: number[] = []
  const glass = (y: number) => {
    if (y < 0.18) { const v = 0.62 * 0.62 - (y + 0.28) ** 2; return v > 0 ? Math.sqrt(v) : 0 }
    // neck: taper from the sphere edge to the base radius
    const top = Math.sqrt(Math.max(0, 0.62 * 0.62 - (0.18 + 0.28) ** 2))
    return top + (0.26 - top) * Math.min(1, (y - 0.18) / 0.27)
  }
  revolution(out, glass, -0.9, 0.45, Math.round(n * 0.62), rand, 0.62)
  // screw base with ridges
  revolution(out, y => 0.26 + 0.025 * Math.sin(y * 48), 0.45, 0.8, Math.round(n * 0.2), rand, 0.29)
  revolution(out, y => 0.24 * (1 - (y - 0.8) / 0.12), 0.8, 0.92, Math.round(n * 0.04), rand, 0.24)
  // filament
  alongSegments(out, [[-0.14, 0.2, -0.1, -0.25], [-0.1, -0.25, -0.03, -0.15], [-0.03, -0.15, 0.03, -0.25], [0.03, -0.25, 0.1, -0.15], [0.1, -0.15, 0.14, 0.2]],
    n - out.length / 3, rand, 0.012, 0.03)
  return out
}

function browserWindow(n: number, rand: Rand) {
  const out: number[] = []
  alongSegments(out, rect(-0.95, -0.65, 0.95, 0.65), Math.round(n * 0.32), rand, 0.015, 0.05)
  alongSegments(out, [[-0.95, -0.45, 0.95, -0.45]], Math.round(n * 0.1), rand, 0.01, 0.05)
  alongSegments(out, [...circle(-0.82, -0.55, 0.035, 6), ...circle(-0.7, -0.55, 0.035, 6), ...circle(-0.58, -0.55, 0.035, 6)], Math.round(n * 0.05), rand, 0.008, 0.03)
  alongSegments(out, rect(-0.8, -0.28, -0.05, 0.45), Math.round(n * 0.2), rand, 0.012, 0.05)
  alongSegments(out, [[0.08, -0.22, 0.8, -0.22], [0.08, -0.05, 0.7, -0.05], [0.08, 0.12, 0.62, 0.12], [0.08, 0.36, 0.42, 0.36], [0.42, 0.36, 0.42, 0.46], [0.42, 0.46, 0.08, 0.46], [0.08, 0.46, 0.08, 0.36]],
    n - out.length / 3, rand, 0.012, 0.05)
  return out
}

function code(n: number, rand: Rand) {
  const out: number[] = []
  alongSegments(out, [[-0.42, -0.55, -0.95, 0], [-0.95, 0, -0.42, 0.55], [0.42, -0.55, 0.95, 0], [0.95, 0, 0.42, 0.55]],
    Math.round(n * 0.7), rand, 0.035, 0.1)
  alongSegments(out, [[0.2, -0.72, -0.2, 0.72]], n - out.length / 3, rand, 0.035, 0.1)
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
  alongSegments(out, circle(0, -0.25, 0.1, 10).map(([a, b, c, d]) => [a, b, c, d] as Seg), Math.round(n * 0.05), rand, 0.01, 0.02)
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

function shield(n: number, rand: Rand) {
  const out: number[] = []
  const outline: Seg[] = [
    [-0.75, -0.72, 0, -0.9], [0, -0.9, 0.75, -0.72],
    [0.75, -0.72, 0.72, 0.05], [0.72, 0.05, 0.4, 0.6], [0.4, 0.6, 0, 0.92],
    [0, 0.92, -0.4, 0.6], [-0.4, 0.6, -0.72, 0.05], [-0.72, 0.05, -0.75, -0.72],
  ]
  alongSegments(out, outline, Math.round(n * 0.5), rand, 0.02, 0.06)
  alongSegments(out, outline.map(([a, b, c, d]) => [a * 0.82, b * 0.82, c * 0.82, d * 0.82] as Seg), Math.round(n * 0.2), rand, 0.012, 0.05)
  alongSegments(out, [[-0.35, 0.02, -0.08, 0.3], [-0.08, 0.3, 0.4, -0.3]], n - out.length / 3, rand, 0.035, 0.08)
  return out
}

const builders: Record<ShapeName, (n: number, rand: Rand) => number[]> = {
  globe, bulb, window: browserWindow, code, rocket, shield,
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
