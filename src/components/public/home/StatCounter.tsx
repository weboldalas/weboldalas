'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function StatCounter({
  to,
  prefix = '',
  suffix = '',
  duration = 1.6,
  format = true,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  format?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduceMotion])

  const shown = reduceMotion ? to : value
  const text = format ? shown.toLocaleString('hu-HU') : String(shown)

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{text}{suffix}
    </span>
  )
}
