import { Plus } from 'lucide-react'

/** FAQ list on native <details> (no JS, no boxes). */
export function VoidFaq({ faqs, name = 'faq' }: { faqs: { q: string; a: string }[]; name?: string }) {
  return (
    <div>
      {faqs.map((f, i) => (
        <details key={f.q} name={name} open={i === 0} className="void-faq group py-5 sm:py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-xl leading-snug tracking-[-0.02em] text-white sm:text-heading-2xs">
            {f.q}
            <Plus className="mt-1 h-5 w-5 shrink-0 text-ash-gray transition-transform duration-300 group-open:rotate-45 group-open:text-saffron-spark" />
          </summary>
          <p className="text-body font-extralight mt-4 max-w-2xl text-silver-mist">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
