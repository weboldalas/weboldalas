import { Inter_Tight } from 'next/font/google'

// Free substitute for PP Neue Montreal (see DESIGN.md). latin-ext is needed for ő / ű.
export const voidFont = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-void',
  display: 'swap',
})
