import Link from 'next/link'
import Image from 'next/image'

const services = [
  { label: 'Bemutatkozó weboldal', href: '/szolgaltatasok/bemutatkozo-weboldal' },
  { label: 'Webshop', href: '/szolgaltatasok/webshop' },
  { label: 'Landing Page', href: '/szolgaltatasok/landing-page' },
  { label: 'Foglalási rendszer', href: '/szolgaltatasok/foglalasi-rendszer' },
  { label: 'CRM', href: '/szolgaltatasok/crm' },
  { label: 'Üzemeltetés', href: '/szolgaltatasok/uzemeltetes' },
]

const pages = [
  { href: '/', label: 'Főoldal' },
  { href: '/szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/referenciak', label: 'Referenciák' },
  { href: '/arak', label: 'Árak' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
]

export function PublicFooter() {
  return (
    <footer style={{ background: '#05050c', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={120} height={16} className="mb-5" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Modern weboldalak, webshopok és online rendszerek vállalkozásoknak. Egyszerű indulás, átlátható folyamat és folyamatos támogatás.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Magyar csapat · Magyar support</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Oldalak</h3>
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
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Szolgáltatások</h3>
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
            © {new Date().getFullYear()} Weboldalas. Minden jog fenntartva.
          </p>
          <Link
            href="/kapcsolat"
            className="text-xs px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
          >
            Ajánlatot kérek →
          </Link>
        </div>
      </div>
    </footer>
  )
}
