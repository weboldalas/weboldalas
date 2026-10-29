import Link from 'next/link'

// Circular text that slowly spins around a static arrow. Pure SVG + CSS.
export function RotatingBadge({ className = '' }: { className?: string }) {
  const text = 'IDŐPONTFOGLALÁS · ONLINE · BÁRMIKOR · '
  return (
    <Link
      href="/barber/foglalas"
      aria-label="Időpontfoglalás"
      className={`group grid aspect-square place-items-center rounded-full ${className}`}
    >
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="barber-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="currentColor" style={{ fontSize: 15.2, letterSpacing: '0.24em', fontWeight: 500 }}>
          <textPath href="#barber-badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="grid h-[42%] w-[42%] place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--brass)]">
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 -rotate-45 transition-transform duration-500 group-hover:rotate-0" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden>
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  )
}
