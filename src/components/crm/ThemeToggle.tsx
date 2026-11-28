'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'crm-theme'

/** Runs before paint (inlined in the admin layout) so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`

export function ThemeToggle({ withLabel = false, className = 'crm-icon-btn' }: { withLabel?: boolean; className?: string }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Sync with the value the init script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode */ }
  }

  const label = theme === 'dark' ? 'Világos mód' : 'Sötét mód'
  return (
    <button type="button" onClick={toggle} className={className} aria-label={label} title={label}>
      {theme === 'dark' ? <Sun /> : <Moon />}
      {withLabel && <span>{label}</span>}
    </button>
  )
}
