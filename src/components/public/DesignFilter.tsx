'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'Összes' },
  { id: 'szallas', label: 'Szállás' },
  { id: 'etterem', label: 'Étterem' },
  { id: 'szepseg', label: 'Szépségipar' },
  { id: 'egeszseg', label: 'Egészségügy' },
  { id: 'szakember', label: 'Szakemberek' },
  { id: 'vallalkozas', label: 'Vállalkozás' },
  { id: 'webshop', label: 'Webshop' },
]

const TAGS = [
  { id: 'foglalas', label: '📅 Foglalási rendszer' },
  { id: 'webshop', label: '🛍️ Webshop' },
  { id: 'crm', label: '👥 CRM' },
  { id: 'ajanlatkero', label: '📝 Ajánlatkérő' },
]

export function DesignFilter({ designs }: { designs: any[] }) {
  const [category, setCategory] = useState('all')
  const [tag, setTag] = useState<string | null>(null)

  const filtered = designs.filter(d => {
    const catMatch = category === 'all' || d.category === category
    const tagMatch = !tag || d.tags.includes(tag)
    return catMatch && tagMatch
  })

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={category === c.id
              ? { background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {TAGS.map(t => (
          <button
            key={t.id}
            onClick={() => setTag(tag === t.id ? null : t.id)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={tag === t.id
              ? { background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.4)' }
              : { background: 'transparent', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map(design => (
            <motion.div
              key={design.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Preview area */}
              <div className={`h-44 bg-gradient-to-br ${design.color} flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <span className="text-5xl">{design.emoji}</span>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-semibold text-white/80 bg-black/25 px-2 py-0.5 rounded-full">
                    {design.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{design.name}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{design.desc}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {design.features.slice(0, 3).map((f: string) => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {f}
                    </span>
                  ))}
                </div>

                <Link href="/kapcsolat"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                  Ezt kérem <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="text-4xl mb-4">🔍</div>
          <p>Nincs ilyen szűrési feltételnek megfelelő dizájn.</p>
        </div>
      )}
    </div>
  )
}
