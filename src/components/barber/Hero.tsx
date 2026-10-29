import Link from 'next/link'
import { barber } from '@/barber/config'
import { RotatingBadge } from './RotatingBadge'

type Props = {
  status: { open: boolean; label: string }
  nextSlot: string | null
}

export function Hero({ status, nextSlot }: Props) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between pt-28 pb-10 sm:pb-14">
      <div className="wrap flex items-start justify-between gap-6">
        <p className="eyebrow fade-in" style={{ animationDelay: '0.9s' }}>
          Barber <span className="text-[var(--brass)]">·</span> Egyszemélyes szalon
        </p>
        <p className="eyebrow fade-in flex items-center gap-2.5" style={{ animationDelay: '1s' }}>
          <span className="relative flex h-2 w-2">
            {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
            <span className={`relative h-2 w-2 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-[var(--muted)]'}`} />
          </span>
          {status.label}
        </p>
      </div>

      <div className="wrap relative">
        <h1 className="select-none">
          {/* size lives on .reveal-line so its em-based accent padding scales with the text */}
          <span className="reveal-line text-[clamp(56px,15.4vw,232px)] font-extralight uppercase leading-[0.86] tracking-[-0.055em]">
            <span style={{ animationDelay: '0.1s' }}>
              Vágvölgyi
            </span>
          </span>
          <span className="mt-1 flex items-end justify-between gap-6 sm:mt-0">
            <span className="fade-in hidden max-w-[300px] pb-6 text-[15px] leading-relaxed text-[var(--bone-dim)] md:block" style={{ animationDelay: '1.1s' }}>
              {barber.tagline}
            </span>
            <span className="reveal-line serif ml-auto text-[clamp(72px,17vw,260px)] italic leading-[0.86] tracking-[-0.03em]">
              <span style={{ animationDelay: '0.25s' }}>
                Ákos<span className="not-italic text-[var(--brass)]">.</span>
              </span>
            </span>
          </span>
        </h1>
        <div className="mt-8 flex justify-end xl:hidden">
          <RotatingBadge className="relative w-[112px] text-[var(--bone-dim)] sm:w-[128px]" />
        </div>

        <RotatingBadge className="fade-in absolute top-0 right-[clamp(20px,4vw,48px)] hidden w-[150px] text-[var(--bone-dim)] xl:grid" />
      </div>

      <div className="wrap fade-in flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: '1.2s' }}>
        <p className="max-w-[320px] text-[15px] leading-relaxed text-[var(--bone-dim)] md:hidden">{barber.tagline}</p>
        <div className="hidden items-center gap-5 sm:flex">
          <div className="h-24 w-[18px]">
            <div className="pole" aria-hidden />
          </div>
          <p className="eyebrow max-w-[150px] leading-[1.8]">Görgess lejjebb</p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          {nextSlot && (
            <p className="text-[13px] text-[var(--muted)]">
              Következő szabad időpont: <span className="text-[var(--bone)]">{nextSlot}</span>
            </p>
          )}
          <Link href="/barber/foglalas" className="btn btn-solid">
            Időpontot foglalok <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
