'use client'

import Link from 'next/link'

/** Link card with a soft violet spotlight that follows the cursor (see .void-card). */
export function BentoCard({ href, className = '', children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onPointerMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={`void-card group flex flex-col ${className}`}
    >
      {children}
    </Link>
  )
}
