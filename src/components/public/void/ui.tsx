import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** Small uppercase saffron label above body copy (DESIGN.md "Section label"). */
export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-caption font-semibold uppercase tracking-nav-label text-saffron-spark sm:text-nav-label ${className}`}>{children}</p>
}

/** Secondary action: bare text link with an arrow. */
export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-11 items-center gap-2 text-sm text-ash-gray transition-colors hover:text-white">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

/** Outlined triangle bullet in electric iris. */
export function TriangleBullet() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0">
      <polygon points="5,1 9,9 1,9" fill="none" stroke="var(--color-electric-iris)" strokeWidth="1.3" />
    </svg>
  )
}

/** Two-column section headline block: big headline left, label + body right. */
export function SectionHead({ title, label, children }: { title: React.ReactNode; label: string; children?: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <h2 className="void-reveal text-heading-sm sm:text-heading lg:text-heading-lg">{title}</h2>
      <div className="void-reveal lg:pt-4">
        <Label>{label}</Label>
        {children && <div className="text-body font-extralight mt-4 text-silver-mist">{children}</div>}
      </div>
    </div>
  )
}

export const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8'
