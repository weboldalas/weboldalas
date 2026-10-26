'use client'

import Link from 'next/link'

function spotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** Card with a soft violet spotlight that follows the cursor (see .void-card). A link when `href` is set. */
export function BentoCard({ href, className = '', children }: { href?: string; className?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} onPointerMove={spotlight} className={`void-card group flex flex-col ${className}`}>
        {children}
      </Link>
    )
  }
  return (
    <div onPointerMove={spotlight} className={`void-card group flex flex-col ${className}`}>
      {children}
    </div>
  )
}
