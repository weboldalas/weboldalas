import { services } from '@/barber/config'

export function Marquee() {
  const words = [...services.map((s) => s.short), 'Precízió', 'Nyugalom']
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="serif px-8 text-[clamp(56px,9vw,128px)] italic leading-none sm:px-12">{w}</span>
          <span className="h-2 w-2 rounded-full bg-[var(--brass)]" />
        </span>
      ))}
    </div>
  )
  return (
    <section aria-hidden className="relative overflow-hidden border-y border-[var(--line)] py-8 sm:py-10">
      <div className="marquee">
        {row}
        {row}
      </div>
      <div className="marquee marquee-reverse mt-4 opacity-100">
        <div className="outline-text flex">
          {row}
          {row}
        </div>
      </div>
    </section>
  )
}
