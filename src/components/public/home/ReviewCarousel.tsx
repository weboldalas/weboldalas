'use client'

import { useEffect, useState } from 'react'

type Review = { name: string; role: string; text: string }

const AUTO_MS = 8000

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setIndex(i => (i + 1) % reviews.length), AUTO_MS)
    return () => clearTimeout(t)
  }, [index, paused, reviews.length])

  const r = reviews[index]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure key={index} className="void-fade min-h-[16rem] sm:min-h-[14rem]">
        <blockquote className="max-w-4xl text-[1.75rem] font-extralight leading-[1.25] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
          „{r.text}”
        </blockquote>
        <figcaption className="mt-8 flex items-baseline gap-3">
          <span className="text-lg text-white">{r.name}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.025em] text-saffron">{r.role}</span>
        </figcaption>
      </figure>

      <div className="mt-10 flex items-center gap-3" role="tablist" aria-label="Vélemények">
        {reviews.map((rv, i) => (
          <button
            key={rv.name}
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1}. vélemény: ${rv.name}`}
            onClick={() => { setIndex(i); setPaused(true) }}
            className="group flex h-6 w-6 items-center justify-center"
          >
            <span className={`block h-2 w-2 rounded-full transition-colors duration-300 ${i === index ? 'bg-iris' : 'bg-white/20 group-hover:bg-white/50'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
