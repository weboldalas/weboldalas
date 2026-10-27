import Link from 'next/link'
import Image from 'next/image'
import { href, type Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'
import { servicesNav } from './servicesNav'

export function PublicFooter({ locale = 'hu' }: { locale?: Locale }) {
  const t = ui(locale)
  const services = servicesNav(locale)
  const pages = [
    { href: href(locale, 'home'), label: t.nav.home },
    { href: href(locale, 'services'), label: t.nav.services },
    { href: href(locale, 'references'), label: t.nav.references },
    { href: href(locale, 'contact'), label: t.nav.contact },
  ]
  return (
    <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={120} height={16} className="mb-5" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.footer.team}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.footer.pages}</h3>
            <ul className="space-y-3">
              {pages.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="footer-link text-sm">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.footer.services}</h3>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="footer-link text-sm">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Weboldalas. {t.footer.rights}
          </p>
          <Link href={href(locale, 'contact')} className="footer-link text-sm">
            {t.footer.cta}
          </Link>
        </div>
      </div>
    </footer>
  )
}
