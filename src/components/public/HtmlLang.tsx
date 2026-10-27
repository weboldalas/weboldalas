'use client'

import { useEffect } from 'react'
import type { Locale } from '@/i18n/routes'

/** The root <html lang> is shared with the admin app; keep it in sync with the public page language. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
