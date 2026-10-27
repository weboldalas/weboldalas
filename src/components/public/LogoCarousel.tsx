import Image from 'next/image'
import { LOGOS, type PartnerLogo } from './logos'

const ROWS = 3
// slightly different speeds so the rows never line up
const DURATION = [60, 72, 66]

function Chip({ logo, hidden }: { logo: PartnerLogo; hidden: boolean }) {
  return (
    <li className={`logo-chip logo-${logo.tone}`} aria-hidden={hidden || undefined}>
      <span className="relative block h-full w-full" style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}>
        <Image
          src={logo.src}
          alt={hidden ? '' : logo.alt}
          fill
          sizes="180px"
          unoptimized={logo.src.endsWith('.svg')}
          className="object-contain"
        />
      </span>
    </li>
  )
}

/** Partner logos in three marquee rows; the middle row runs the other way. Hover a logo for its colours. */
export function LogoCarousel() {
  // deal the logos into rows round-robin, so new logos spread evenly
  const rows = Array.from({ length: ROWS }, (_, r) => LOGOS.filter((_, i) => i % ROWS === r))
  return (
    <div className="logo-marquee space-y-3 sm:space-y-4">
      {rows.map((row, r) => {
        // repeat short rows so one loop is wider than any screen (≈12 chips ≈ 2500px), no gap at the end
        const reps = Math.max(1, Math.ceil(12 / Math.max(1, row.length)))
        const loop = Array.from({ length: reps }, () => row).flat()
        return (
        <div key={r} className="logo-row">
          <ul
            className="logo-track"
            style={{ animationDuration: `${DURATION[r % DURATION.length]}s`, animationDirection: r % 2 ? 'reverse' : 'normal' }}
          >
            {/* the loop twice, so the -50% animation is seamless; only the first copy of each logo is announced */}
            {[...loop, ...loop].map((logo, i) => <Chip key={i} logo={logo} hidden={i >= row.length} />)}
          </ul>
        </div>
        )
      })}
    </div>
  )
}
