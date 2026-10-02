'use client'

import { MotionConfig } from 'framer-motion'

/** Respects the visitor's OS-level "reduce motion" setting for every framer animation below. */
export function HomeMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
