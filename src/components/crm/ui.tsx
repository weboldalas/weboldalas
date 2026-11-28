import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { avatarColor, initials } from '@/lib/crm/format'
import type { Tone } from '@/lib/crm/status'

export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="crm-page-head">
      <div className="min-w-0">
        {eyebrow && <p className="crm-eyebrow">{eyebrow}</p>}
        <h1 className="crm-title">{title}</h1>
        {subtitle && <p className="crm-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="crm-head-actions">{actions}</div>}
    </div>
  )
}

export function StatusBadge({ label, tone = 'neutral', dot = true }: { label: string; tone?: Tone; dot?: boolean }) {
  const toneClass = tone === 'neutral' ? '' : `is-${tone}`
  return <span className={`crm-badge ${toneClass} ${dot ? '' : 'no-dot'}`}>{label}</span>
}

export function Avatar({ name, size }: { name: string; size?: 'sm' | 'lg' }) {
  return (
    <span className={`crm-avatar ${size ? `is-${size}` : ''}`} style={{ background: avatarColor(name) }} aria-hidden="true">
      {initials(name)}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: { href: string; label: string } }) {
  return (
    <div className="crm-empty">
      <span><Icon size={20} /></span>
      <strong>{title}</strong>
      {text && <p>{text}</p>}
      {action && <Link href={action.href} className="crm-btn crm-btn-secondary crm-btn-sm">{action.label}</Link>}
    </div>
  )
}

export function CardHeader({ title, icon: Icon, description, link }: { title: string; icon?: LucideIcon; description?: string; link?: { href: string; label: string } }) {
  return (
    <div className="crm-card-head">
      <div className="min-w-0">
        <h2>{Icon && <Icon />}{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && <Link href={link.href} className="crm-card-link">{link.label}<ArrowRight /></Link>}
    </div>
  )
}

export function Delta({ value, suffix = '%' }: { value: number | null; suffix?: string }) {
  if (value === null || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  const cls = rounded > 0 ? 'is-up' : rounded < 0 ? 'is-down' : 'is-flat'
  return <span className={`crm-delta ${cls}`}>{rounded > 0 ? '+' : ''}{rounded}{suffix}</span>
}
