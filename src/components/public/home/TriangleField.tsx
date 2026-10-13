/*
 * Static, decorative outlined triangles rendered as inline SVG (server component, zero JS).
 * Deterministic (seeded) so server and client markup always match.
 */

const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#2dd4bf', '#e879f9', '#60a5fa', '#a78bfa']

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function triangle(x: number, y: number, s: number, rot: number) {
  const pts = [0, 120, 240].map(deg => {
    const a = ((deg + rot) * Math.PI) / 180
    return `${(x + Math.cos(a) * s).toFixed(1)},${(y + Math.sin(a) * s).toFixed(1)}`
  })
  return pts.join(' ')
}

/** Sparse scattered triangles, meant as an absolutely positioned background layer. */
export function TriangleField({ count = 26, seed = 1, className = '' }: { count?: number; seed?: number; className?: string }) {
  const rand = mulberry32(seed)
  const items = Array.from({ length: count }, () => ({
    x: rand() * 1000,
    y: rand() * 1000,
    s: 3 + rand() * 4,
    rot: rand() * 360,
    color: PALETTE[Math.floor(rand() * PALETTE.length)],
    o: 0.25 + rand() * 0.45,
  }))
  return (
    <svg aria-hidden viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {items.map((t, i) => (
        <polygon key={i} points={triangle(t.x, t.y, t.s, t.rot)} fill="none" stroke={t.color} strokeOpacity={t.o} strokeWidth={1}
          vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

/** A dense ring-shaped cluster of triangles, used as a static section visual. */
export function TriangleRing({ count = 420, seed = 3, className = '' }: { count?: number; seed?: number; className?: string }) {
  const rand = mulberry32(seed)
  const items = Array.from({ length: count }, () => {
    const a = rand() * Math.PI * 2
    // gaussian-ish spread around radius 300
    const spread = (rand() + rand() + rand() - 1.5) * 70
    const r = 300 + spread
    return {
      x: 500 + Math.cos(a) * r,
      y: 500 + Math.sin(a) * r * 0.82,
      s: 3 + rand() * 6,
      rot: rand() * 360,
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      o: 0.35 + rand() * 0.65,
    }
  })
  return (
    <svg aria-hidden viewBox="0 0 1000 1000" className={`h-full w-full ${className}`}>
      {items.map((t, i) => (
        <polygon key={i} points={triangle(t.x, t.y, t.s, t.rot)} fill="none" stroke={t.color} strokeOpacity={t.o} strokeWidth={1.4} />
      ))}
    </svg>
  )
}
