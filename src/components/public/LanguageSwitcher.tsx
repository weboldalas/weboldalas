'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, localeOf, switchPath } from '@/i18n/routes'

/** HU | EN pill; each option links to the same page in that language. */
export function LanguageSwitcher({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const current = localeOf(pathname)
  return (
    <div role="group" aria-label={current === 'en' ? 'Language' : 'Nyelv'} className={`inline-flex items-center rounded-full border border-white/10 bg-[#0b0b0e] p-0.5 ${className}`}>
      {LOCALES.map(l => {
        const active = l === current
        return (
          <Link
            key={l}
            href={switchPath(pathname, l)}
            hrefLang={l}
            lang={l}
            onClick={onNavigate}
            aria-current={active ? 'true' : undefined}
            className={`flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 text-[12px] font-semibold uppercase tracking-wide transition-colors ${active ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}
          >
            {l}
          </Link>
        )
      })}
    </div>
  )
}
