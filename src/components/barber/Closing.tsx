import Link from 'next/link'
import { barber } from '@/barber/config'
import { Reveal } from './Reveal'

export function Instagram() {
  return (
    <section className="border-y border-[var(--line)] py-20 sm:py-28">
      <a href={barber.instagram} target="_blank" rel="noreferrer" className="group wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-5">Friss munkák</p>
          <p className="serif text-[clamp(44px,8vw,120px)] italic leading-none transition-transform duration-700 group-hover:translate-x-3">
            {barber.instagramHandle}
          </p>
        </div>
        <span className="eyebrow flex items-center gap-3 !text-[var(--bone)]">
          Instagram <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
        </span>
      </a>
    </section>
  )
}

export function FinalCta({ nextSlot }: { nextSlot: string | null }) {
  return (
    <section className="relative overflow-hidden py-28 sm:py-44">
      <div className="wrap flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow eyebrow-brass mb-8">Szabad székek a következő 30 napra</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-[clamp(56px,11vw,176px)] font-extralight leading-[0.9] tracking-[-0.055em]">
            Foglalj
            <br />
            <span className="serif italic tracking-[-0.025em]">időpontot.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16} className="mt-12 flex flex-col items-center gap-5">
          <Link href="/barber/foglalas" className="btn btn-solid h-14 px-9">
            Szabad időpontok <span className="arrow">→</span>
          </Link>
          {nextSlot && <p className="text-[13px] text-[var(--muted)]">Legkorábban: {nextSlot}</p>}
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="wrap flex flex-col gap-6 text-[13px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="serif text-[18px] italic text-[var(--bone)]">VÁ</span>
          <span className="ml-3">© {new Date().getFullYear()} {barber.name} — Barber</span>
        </p>
        <div className="flex gap-6">
          <a href={`tel:${barber.phone.replace(/\s/g, '')}`} className="link">{barber.phone}</a>
          <a href={`mailto:${barber.email}`} className="link">{barber.email}</a>
          <Link href="/barber/admin" className="link">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
