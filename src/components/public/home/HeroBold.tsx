import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'

/*
 * Bold, type-driven hero. Pure server component: zero client JS.
 * All motion is CSS (transform/opacity only) so it stays smooth on low-end phones.
 */

const services = ['Weboldal', 'Webshop', 'Foglalási rendszer', 'Landing page', 'CRM', 'Üzemeltetés', 'Karbantartás', 'SEO alapok']

function Marquee({ items, reverse = false, variant }: { items: string[]; reverse?: boolean; variant: 'solid' | 'dark' }) {
  // Two identical halves -> seamless -50% loop
  const row = [...items, ...items]
  return (
    <div className={`marquee-band ${variant === 'solid' ? 'marquee-solid' : 'marquee-dark'}`}>
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        {[0, 1].map(half => (
          <div key={half} aria-hidden={half === 1} className="flex shrink-0 items-center">
            {row.map((s, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="marquee-item">{s}</span>
                <span className="marquee-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroBold() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      {/* Background: static gradients + grain, no blur filters */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 85% 20%, rgba(14,165,233,0.22), transparent 70%), radial-gradient(50% 45% at 10% 75%, rgba(168,85,247,0.20), transparent 70%), radial-gradient(40% 35% at 60% 100%, rgba(236,72,153,0.14), transparent 70%)' }} />
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="hero-grain absolute inset-0" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* Rotating stamp */}
        <Link href="/kapcsolat" aria-label="Ajánlatkérés"
          className="hero-in group absolute right-4 top-2 hidden h-40 w-40 items-center justify-center sm:right-6 lg:right-8 lg:flex xl:h-48 xl:w-48"
          style={{ animationDelay: '600ms' }}>
          <svg viewBox="0 0 200 200" className="stamp-spin absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text className="fill-white/70 text-[15px] font-bold uppercase tracking-[0.32em]">
              <textPath href="#stamp-circle">Weboldal havidíjjal ✦ 10 nap alatt ✦ </textPath>
            </text>
          </svg>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110 xl:h-20 xl:w-20">
            <ArrowRight className="h-6 w-6 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          </span>
        </Link>

        {/* Giant type */}
        <h1 className="hero-type select-none font-extrabold uppercase leading-[0.94] tracking-[-0.045em]">
          <span className="sr-only">Gyors, szép és megtérülő weboldalak vállalkozásoknak.</span>
          <span aria-hidden className="hero-line">
            <span className="line-up block text-white" style={{ animationDelay: '0ms' }}>Gyors.</span>
          </span>
          <span aria-hidden className="hero-line">
            <span className="line-up hero-ghost block" style={{ animationDelay: '90ms' }}>Szép.</span>
          </span>
          <span aria-hidden className="hero-line">
            <span className="line-up hero-gradient block" style={{ animationDelay: '180ms' }}>Megtérül.</span>
          </span>
        </h1>

        {/* Copy + CTA */}
        <div className="hero-in mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between" style={{ animationDelay: '320ms' }}>
          <p className="max-w-xl text-xl leading-relaxed text-white/65 sm:text-2xl">
            Weboldalt, webshopot és foglalási rendszert építünk vállalkozásoknak.
            <span className="text-white"> Havidíjjal. 10 nap alatt.</span>
          </p>
          <div className="flex flex-col gap-5 lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/kapcsolat" className="btn-primary btn-lg group">
                Kezdjük
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/referenciak" className="btn-ghost btn-lg">
                Munkáink
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/45">
              <span><span className="font-bold text-white">19 990 Ft</span>/hó-tól</span>
              <span className="h-4 w-px bg-white/15" />
              <span><span className="font-bold text-white">22+</span> elégedett ügyfél</span>
            </div>
          </div>
        </div>

        <a href="#tovabb" className="hero-in mt-10 hidden items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.25em] text-white/35 transition-colors hover:text-white/70 lg:flex"
          style={{ animationDelay: '500ms' }}>
          <ArrowDown className="scroll-bob h-4 w-4" /> Görgess
        </a>
      </div>

      {/* Crossing service bands */}
      <div aria-hidden className="relative mt-14 h-36 sm:h-44">
        <div className="absolute inset-x-[-5%] top-6 -rotate-[4deg]">
          <Marquee items={services} variant="dark" reverse />
        </div>
        <div className="absolute inset-x-[-5%] top-10 rotate-[3deg]">
          <Marquee items={services} variant="solid" />
        </div>
      </div>
      <span id="tovabb" className="sr-only" />
    </section>
  )
}
