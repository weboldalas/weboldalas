import { barber, dayNames, openingHours } from '@/barber/config'
import { Reveal } from './Reveal'

// Monday-first week, today highlighted (in shop time, passed from the server)
const order = [1, 2, 3, 4, 5, 6, 0]

export function Hours({ today }: { today: number }) {
  return (
    <section id="nyitvatartas" className="scroll-mt-20 bg-[var(--bone)] py-24 text-[var(--ink)] sm:py-36">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow !text-[#8a6a4a] mb-6">(03) — Nyitvatartás & helyszín</p>
          <h2 className="text-[clamp(44px,6.4vw,96px)] font-extralight leading-[0.95] tracking-[-0.045em]">
            Itt <span className="serif italic tracking-[-0.02em]">találsz.</span>
          </h2>
          <div className="mt-12 space-y-6 text-[17px] leading-relaxed">
            <p>
              {barber.address}
              <br />
              <span className="text-[#6b655c]">{barber.addressNote}</span>
            </p>
            <p className="flex flex-col gap-1">
              <a href={`tel:${barber.phone.replace(/\s/g, '')}`} className="w-fit underline decoration-black/20 underline-offset-[6px] transition hover:decoration-black">
                {barber.phone}
              </a>
              <a href={barber.instagram} target="_blank" rel="noreferrer" className="w-fit underline decoration-black/20 underline-offset-[6px] transition hover:decoration-black">
                {barber.instagramHandle}
              </a>
            </p>
            <a
              href={barber.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-3 rounded-full border border-black/20 px-6 text-[11px] font-medium uppercase tracking-[0.2em] transition hover:bg-[var(--ink)] hover:text-[var(--bone)]"
            >
              Útvonaltervezés ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-black/15">
            {order.map((d) => {
              const h = openingHours[d]
              const isToday = d === today
              return (
                <li key={d} className="flex items-baseline justify-between border-b border-black/15 py-5 sm:py-6">
                  <span className={`flex items-center gap-3 text-[20px] sm:text-[24px] ${isToday ? '' : 'text-black/55'}`}>
                    {isToday && <span className="h-2 w-2 rounded-full bg-[var(--brass)]" />}
                    <span className={isToday ? 'serif italic text-[26px] sm:text-[30px]' : ''}>{dayNames[d]}</span>
                    {isToday && <span className="eyebrow !text-[#8a6a4a]">Ma</span>}
                  </span>
                  <span className={`tabular-nums text-[18px] sm:text-[22px] ${h ? '' : 'text-black/35'}`}>
                    {h ? `${h.open} – ${h.close}` : 'Zárva'}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-[14px] text-[#6b655c]">Csak előzetes foglalással. Ha nincs szabad időpont, írj, és szólok, ha felszabadul egy.</p>
        </Reveal>
      </div>
    </section>
  )
}
