import { type LucideIcon } from 'lucide-react'

const GRADIENTS: Record<string, string> = {
  blue:    'linear-gradient(135deg, #2563eb, #0ea5e9)',
  cyan:    'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  violet:  'linear-gradient(135deg, #7c3aed, #a855f7)',
  emerald: 'linear-gradient(135deg, #059669, #10b981)',
  amber:   'linear-gradient(135deg, #d97706, #f59e0b)',
  rose:    'linear-gradient(135deg, #e11d48, #f43f5e)',
  slate:   'linear-gradient(135deg, #475569, #64748b)',
  orange:  'linear-gradient(135deg, #ea580c, #f97316)',
  teal:    'linear-gradient(135deg, #0d9488, #14b8a6)',
  indigo:  'linear-gradient(135deg, #4f46e5, #6366f1)',
}

export function AppIcon({
  icon: Icon,
  color = 'cyan',
  size = 'md',
  className = '',
}: {
  icon: LucideIcon
  color?: keyof typeof GRADIENTS
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    sm:  { box: 36,  icon: 16, radius: 10 },
    md:  { box: 48,  icon: 22, radius: 14 },
    lg:  { box: 60,  icon: 28, radius: 17 },
    xl:  { box: 80,  icon: 36, radius: 22 },
  }
  const s = sizes[size]
  const gradient = GRADIENTS[color] ?? GRADIENTS.cyan

  return (
    <div
      className={`flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: s.box,
        height: s.box,
        borderRadius: s.radius,
        background: gradient,
        boxShadow: `0 4px 20px rgba(14,165,233,0.25)`,
      }}
    >
      <Icon size={s.icon} color="white" strokeWidth={1.8} />
    </div>
  )
}
