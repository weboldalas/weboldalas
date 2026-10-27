import { Wallet, CalendarClock } from 'lucide-react'
import type { Locale } from '@/i18n/routes'
import { ui } from '@/i18n/ui'
import { BentoCard } from './BentoCard'
import { SectionHead, container } from './ui'

/** Payment block (no prices): one-off or instalments, quoted per project. */
export function PaymentOptions({ note, action, id = 'fizetes', locale = 'hu' }: { note?: React.ReactNode; action: React.ReactNode; id?: string; locale?: Locale }) {
  const t = ui(locale).payment
  const options = [
    { icon: Wallet, title: t.oneTitle, desc: t.oneDesc },
    { icon: CalendarClock, title: t.instTitle, desc: t.instDesc },
  ]
  return (
    <section id={id} className="void-section scroll-mt-20">
      <div className={container}>
        <SectionHead title={<>{t.titleStart}<span className="void-mark">{t.titleAccent}</span></>} label={t.label}>
          {note ?? t.note}
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
