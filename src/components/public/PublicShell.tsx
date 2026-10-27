import { PublicNav } from './PublicNav'
import { PublicFooter } from './PublicFooter'
import { HtmlLang } from './HtmlLang'
import { voidFont } from './home/fonts'
import type { Locale } from '@/i18n/routes'

/** Chrome for every public page (nav, footer, Void canvas) in the given language. */
export function PublicShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <div lang={locale} className={`${voidFont.variable} void-site min-h-screen bg-void font-ppneuemontreal text-bone-white antialiased`}>
      <HtmlLang locale={locale} />
      <PublicNav />
      <main>{children}</main>
      <PublicFooter locale={locale} />
    </div>
  )
}
