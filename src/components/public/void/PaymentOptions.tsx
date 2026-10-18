import { SectionHead, container } from './ui'

const options = [
  { n: '01', title: 'Egyben', desc: 'A teljes összeget egyszerre fizeted, az ajánlatban rögzített feltételekkel.' },
  { n: '02', title: 'Részletben', desc: 'Az összeget több részletre bontjuk, a projekthez igazított ütemezéssel. A részleteket előre, az ajánlatban rögzítjük.' },
]

/** Payment block (no prices): one-off or instalments, quoted per project. */
export function PaymentOptions({ note, action, id = 'fizetes' }: { note?: React.ReactNode; action: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="void-section scroll-mt-20">
      <div className={container}>
        <SectionHead title="Egyben vagy részletben." label="Fizetés">
          {note ?? 'Nem dolgozunk sablonárakkal, mert minden projekt más. Egy rövid konzultáció után pontos, kötelezettségmentes ajánlatot küldünk.'}
        </SectionHead>
        <ul className="mt-12 grid gap-x-16 gap-y-10 sm:mt-16 md:grid-cols-2">
          {options.map(o => (
            <li key={o.n} className="void-reveal">
              <span className="text-caption text-ash-gray">{o.n}</span>
              <h3 className="mt-3 text-subheading tracking-heading-sm sm:text-heading-sm">{o.title}</h3>
              <p className="text-body font-extralight mt-3 max-w-md text-silver-mist">{o.desc}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">{action}</div>
      </div>
    </section>
  )
}
