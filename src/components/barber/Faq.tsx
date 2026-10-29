import { faq } from '@/barber/config'
import { Reveal } from './Reveal'

export function Faq() {
  return (
    <section className="py-24 sm:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow eyebrow-brass mb-6">(04) — Kérdések</p>
          <h2 className="text-[clamp(40px,5vw,72px)] font-extralight leading-[0.95] tracking-[-0.045em]">
            Jó <span className="serif italic tracking-[-0.02em]">tudni.</span>
          </h2>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06}>
              <details className="group border-t border-[var(--line)] py-7 last:border-b">
                <summary className="flex items-center justify-between gap-6">
                  <span className="text-[20px] font-light sm:text-[24px]">{item.q}</span>
                  <span className="faq-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-[20px] font-extralight">
                    +
                  </span>
                </summary>
                <p className="max-w-xl pt-5 text-[16px] leading-relaxed text-[var(--bone-dim)]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
