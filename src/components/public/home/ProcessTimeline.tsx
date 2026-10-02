'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MessagesSquare, PenTool, Code2, Rocket } from 'lucide-react'

const steps = [
  { icon: MessagesSquare, when: '1. nap', title: 'Beszéljünk', color: '#38bdf8',
    desc: 'Egy kötetlen beszélgetésen megismerjük a vállalkozásodat, a céljaidat és azt, mire van szükséged.' },
  { icon: PenTool, when: '2–3. nap', title: 'Megtervezzük', color: '#a78bfa',
    desc: 'Összerakjuk az oldal felépítését, a szövegek irányát és a márkádhoz illő, modern dizájnt.' },
  { icon: Code2, when: '4–8. nap', title: 'Elkészítjük', color: '#34d399',
    desc: 'Lefejlesztjük a weboldalt, beállítjuk a funkciókat, és minden eszközön alaposan teszteljük.' },
  { icon: Rocket, when: '5–10. nap', title: 'Élesítjük', color: '#fbbf24',
    desc: 'Elindul az oldal. Utána is veled maradunk: karbantartás, módosítások, fejlesztések.' },
]

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      {/* rail */}
      <div className="absolute bottom-6 left-6 top-6 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        className="absolute bottom-6 left-6 top-6 w-px origin-top md:left-1/2 md:-translate-x-1/2"
        style={{ scaleY, background: 'linear-gradient(to bottom, #38bdf8, #a78bfa, #34d399, #fbbf24)' }}
      />

      <div className="space-y-8 md:-space-y-8">
        {steps.map((s, i) => {
          const Icon = s.icon
          const right = i % 2 === 1
          return (
            <div key={s.title} className="relative grid items-center md:grid-cols-2 md:gap-16">
              {/* node */}
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute left-6 top-6 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-[#0d0d16] md:left-1/2 md:top-1/2"
                style={{ boxShadow: `0 0 0 6px #08080f, 0 0 30px ${s.color}66` }}
              >
                <Icon className="h-5 w-5" style={{ color: s.color }} />
              </motion.span>

              <motion.div
                initial={{ opacity: 0, x: right ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`pl-16 md:pl-0 ${right ? 'md:col-start-2' : 'md:text-right'}`}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7">
                  <span
                    className={`pointer-events-none absolute -top-6 select-none text-[7rem] font-black leading-none text-white/[0.04] ${right ? 'right-4' : 'right-4 md:left-4 md:right-auto'}`}>
                    0{i + 1}
                  </span>
                  <span className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: `${s.color}1a`, color: s.color }}>
                    {s.when}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/50">{s.desc}</p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
