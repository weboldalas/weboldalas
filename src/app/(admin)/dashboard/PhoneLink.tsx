'use client'

import { Phone } from 'lucide-react'

export function PhoneLink({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${phone}`}
      onClick={e => e.stopPropagation()}
      className="ml-auto shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
      style={{ color: 'oklch(0.68 0.18 145)' }}
    >
      <Phone className="h-3.5 w-3.5" />
    </a>
  )
}
