import Link from 'next/link'
import { barber } from '@/barber/config'

const links = [
  { href: '/barber#szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/barber#rolam', label: 'Rólam' },
  { href: '/barber#nyitvatartas', label: 'Nyitvatartás' },
]

export function Nav({ showCta = true }: { showCta?: boolean }) {
  return (
    // difference blending keeps the bar readable over dark and light sections
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="wrap flex h-20 items-center justify-between text-[#f2ede4]">
        <Link href="/barber" className="group flex items-baseline gap-3" aria-label={`${barber.name} — főoldal`}>
          <span className="serif text-[28px] italic leading-none">VÁ</span>
          <span className="eyebrow hidden !text-[#f2ede4]/70 sm:inline">{barber.name}</span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="eyebrow !text-[#f2ede4]/70 transition-colors hover:!text-[#f2ede4]">
              {l.label}
            </Link>
          ))}
        </nav>
        {showCta ? (
          <Link
            href="/barber/foglalas"
            className="flex h-11 items-center rounded-full border border-[#f2ede4]/40 px-5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors hover:bg-[#f2ede4] hover:text-black"
          >
            Foglalás
          </Link>
        ) : (
          <Link href="/barber" className="eyebrow !text-[#f2ede4]/70 hover:!text-[#f2ede4]">
            ← Vissza
          </Link>
        )}
      </div>
    </header>
  )
}
