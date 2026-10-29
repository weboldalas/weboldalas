import Link from 'next/link'
import { formatHuf, services } from '@/barber/config'
import { Reveal } from './Reveal'

export function Services() {
  return (
    <section id="szolgaltatasok" className="scroll-mt-20 py-24 sm:py-36">
      <div className="wrap">
        <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow eyebrow-brass mb-6">(02) — Szolgáltatások</p>
            <h2 className="text-[clamp(44px,7vw,104px)] font-extralight leading-[0.95] tracking-[-0.045em]">
              Amit a <span className="serif italic tracking-[-0.02em]">székben</span> kapsz.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[16px] leading-relaxed text-[var(--bone-dim)]">
              Minden szolgáltatás konzultációval indul és stylinggal zárul. Válassz, és nézd meg a szabad időpontokat.
            </p>
          </Reveal>
        </div>

        <ul className="border-b border-[var(--line)]">
          {services.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/barber/foglalas?szolgaltatas=${s.id}`}
                className="service-row grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 px-1 py-7 sm:grid-cols-[64px_1fr_160px_150px_120px] sm:gap-x-6 sm:px-4 sm:py-9"
              >
                <span className="service-meta text-[12px] tabular-nums tracking-[0.2em]">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="service-name serif block text-[clamp(32px,4.4vw,64px)] leading-none">{s.name}</span>
                  <span className="service-meta mt-3 block max-w-md text-[14px] leading-relaxed">{s.description}</span>
                </span>
                <span className="service-meta col-start-2 text-[14px] sm:col-start-auto">{s.durationMin} perc</span>
                <span className="col-start-3 row-start-1 text-right text-[18px] tabular-nums sm:col-start-auto sm:row-start-auto sm:text-left sm:text-[20px]">
                  {formatHuf(s.priceHuf)}
                </span>
                <span className="service-cta hidden text-right text-[11px] font-medium uppercase tracking-[0.2em] sm:block">Foglalás →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
