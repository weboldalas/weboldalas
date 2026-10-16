'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type Design = {
  id: string
  name: string
  category: string
  categoryLabel: string
  desc: string
  tags: string[]
  features: string[]
}

const CATEGORIES = [
  { id: 'all', label: 'Összes' },
  { id: 'szallas', label: 'Szállás' },
  { id: 'etterem', label: 'Étterem' },
  { id: 'szepseg', label: 'Szépségipar' },
  { id: 'egeszseg', label: 'Egészségügy' },
  { id: 'szakember', label: 'Szakemberek' },
  { id: 'vallalkozas', label: 'Vállalkozás' },
  { id: 'webshop', label: 'Webshop' },
  { id: 'landing', label: 'Landing' },
]

const TAGS = [
  { id: 'foglalas', label: 'Foglalási rendszer' },
  { id: 'webshop', label: 'Webshop' },
  { id: 'crm', label: 'CRM' },
  { id: 'ajanlatkero', label: 'Ajánlatkérő' },
]

// accent per category, taken from the particle palette
const ACCENT: Record<string, string> = {
  szallas: '#60a5fa', etterem: '#ffb829', szepseg: '#f472b6', egeszseg: '#2dd4bf',
  szakember: '#a78bfa', vallalkozas: '#8052ff', webshop: '#e879f9', landing: '#ffb829',
}

/** Line-art wireframe preview; the layout varies a little with the design. */
function Wireframe({ accent, variant }: { accent: string; variant: number }) {
  const line = 'rgba(255,255,255,0.28)'
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" strokeWidth="1" aria-hidden>
      <rect x="8" y="8" width="304" height="184" rx="12" stroke={line} />
      <path d="M8 30 H312" stroke={line} />
      <circle cx="22" cy="19" r="3" stroke={line} /><circle cx="33" cy="19" r="3" stroke={line} /><circle cx="44" cy="19" r="3" stroke={line} />
      {variant % 2 === 0 ? (
        <>
          <path d="M26 58 H150 M26 72 H128" stroke="#fff" />
          <path d="M26 88 H140" stroke={line} />
          <rect x="26" y="104" width="62" height="18" rx="9" stroke={accent} />
          <rect x="176" y="46" width="118" height="84" rx="8" stroke={line} />
          <path d="M184 120 L210 92 L228 108 L246 96 L286 120" stroke={accent} />
        </>
      ) : (
        <>
          <rect x="26" y="44" width="268" height="62" rx="8" stroke={line} />
          <path d="M110 68 H210 M126 82 H194" stroke="#fff" />
          <rect x="132" y="92" width="56" height="8" rx="4" stroke={accent} />
        </>
      )}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={26 + i * 92} y="146" width="80" height="30" rx="6" stroke={line} />
          <path d={`M${34 + i * 92} 158 H${70 + i * 92}`} stroke={i === variant % 3 ? accent : line} />
        </g>
      ))}
    </svg>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full px-5 text-sm transition-colors ${active ? 'bg-white text-black' : 'text-ash-gray hover:text-white'}`}
    >
      {children}
    </button>
  )
}

export function DesignFilter({ designs }: { designs: Design[] }) {
  const [category, setCategory] = useState('all')
  const [tag, setTag] = useState<string | null>(null)

  const filtered = designs.filter(d => (category === 'all' || d.category === category) && (!tag || d.tags.includes(tag)))

  return (
    <div>
      <div className="flex flex-wrap gap-1" role="group" aria-label="Kategória">
        {CATEGORIES.map(c => <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>{c.label}</Pill>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1" role="group" aria-label="Funkció">
        <span className="mr-3 text-caption font-semibold uppercase tracking-nav-label text-saffron-spark">Funkció</span>
        {TAGS.map(t => <Pill key={t.id} active={tag === t.id} onClick={() => setTag(tag === t.id ? null : t.id)}>{t.label}</Pill>)}
      </div>

      <ul key={`${category}-${tag}`} className="void-fade mt-14 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d, i) => {
          const accent = ACCENT[d.category] ?? '#8052ff'
          return (
            <li key={d.id} className="group">
              <div className="aspect-[16/10] transition-transform duration-500 group-hover:-translate-y-1">
                <Wireframe accent={accent} variant={i} />
              </div>
              <p className="mt-6 text-caption font-semibold uppercase tracking-nav-label" style={{ color: accent }}>{d.categoryLabel}</p>
              <h3 className="mt-2 text-heading-2xs">{d.name}</h3>
              <p className="text-body font-extralight mt-2 text-silver-mist">{d.desc}</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ash-gray">
                {d.features.map(f => <span key={f}>{f}</span>)}
              </p>
              <Link href="/kapcsolat" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-ash-gray transition-colors hover:text-white">
                Ezt kérem <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="text-body font-extralight py-16 text-silver-mist">Nincs ilyen szűrésnek megfelelő dizájn. Egyedit is készítünk.</p>
      )}
    </div>
  )
}
