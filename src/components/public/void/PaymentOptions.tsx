import { Wallet, CalendarClock } from 'lucide-react'
import { BentoCard } from './BentoCard'
import { SectionHead, container } from './ui'

const options = [
  { icon: Wallet, title: 'Egyben', desc: 'A teljes összeget egyszerre fizeted, az ajánlatban rögzített feltételekkel.' },
  { icon: CalendarClock, title: 'Részletben', desc: 'Az összeget több részletre bontjuk, a projekthez igazított ütemezéssel. A részleteket előre, az ajánlatban rögzítjük.' },
]

/** Payment block (no prices): one-off or instalments, quoted per project. */
export function PaymentOptions({ note, action, id = 'fizetes' }: { note?: React.ReactNode; action: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="void-section scroll-mt-20">
      <div className={container}>
        <SectionHead title={<>Egyben vagy <span className="void-mark">részletben.</span></>} label="Fizetés">
          {note ?? 'Nem dolgozunk sablonárakkal, mert minden projekt más. Egy rövid konzultáció után pontos, kötelezettségmentes ajánlatot küldünk.'}
        </SectionHead>
        <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:gap-5">
          {options.map(o => (
            <li key={o.title} className="void-reveal">
              <BentoCard className="h-full p-6 sm:p-8">
                <span className="void-icon"><o.icon className="h-5 w-5" strokeWidth={1.6} /></span>
                <h3 className="mt-6 text-subheading tracking-heading-sm sm:text-heading-sm">{o.title}</h3>
                <p className="text-body font-extralight mt-3 max-w-md text-silver-mist">{o.desc}</p>
              </BentoCard>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">{action}</div>
      </div>
    </section>
  )
}
