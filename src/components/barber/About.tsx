import { barber } from '@/barber/config'
import { Reveal } from './Reveal'
import { ScrollWords } from './ScrollWords'

const values = [
  { n: '01', title: 'Konzultáció', text: 'Minden vágás előtt átbeszéljük, mit szeretnél, és mi illik az arcformádhoz.' },
  { n: '02', title: 'Időd van', text: 'Nem sietek. A foglalt idő a tiéd, a következő vendég nem ül a hátad mögött.' },
  { n: '03', title: 'Otthonra is', text: 'Megmutatom, hogyan formázd reggel két perc alatt, hogy holnap is így nézzen ki.' },
]

export function About() {
  return (
    <section id="rolam" className="scroll-mt-20 py-24 sm:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow eyebrow-brass mb-8">(01) — Rólam</p>
            {/* PLACEHOLDER — replace with a real portrait: next/image inside .photo-slot */}
            <div className="photo-slot aspect-[4/5] w-full max-w-[380px] rounded-[28px]">
              <span className="serif absolute -bottom-10 -left-2 text-[260px] italic leading-none text-[var(--bone)]/[0.07]">Á</span>
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <div>
                  <p className="serif text-[30px] italic leading-none">{barber.firstName}</p>
                  <p className="eyebrow mt-2">Barber · Tulajdonos</p>
                </div>
                <span className="eyebrow">Fotó</span>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8 lg:pt-16">
          <ScrollWords
            text={`Szia, ${barber.firstName} vagyok. ${barber.intro}`}
            className="text-[clamp(28px,3.6vw,52px)] font-light leading-[1.18] tracking-[-0.025em]"
          />
          <ul className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {values.map((v, i) => (
              <Reveal as="li" key={v.n} delay={i * 0.12} className="border-t border-[var(--line)] pt-6">
                <p className="eyebrow eyebrow-brass">{v.n}</p>
                <p className="serif mt-5 text-[30px] italic leading-none">{v.title}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--bone-dim)]">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
