import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { LOGOS, type PartnerLogo } from './logos'
import { referenceHref, type Locale } from '@/i18n/routes'

function Tile({ logo, locale, caseStudy }: { logo: PartnerLogo; locale: Locale; caseStudy: string }) {
  const body = (
    <>
      <span className={`logo-chip logo-tile logo-${logo.tone} block`}>
        <span className="relative block h-full w-full" style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}>
          <Image src={logo.src} alt={logo.alt} fill sizes="(min-width: 1024px) 240px, 45vw" unoptimized={logo.src.endsWith('.svg')} className="object-contain" />
        </span>
      </span>
      <span className="mt-3 flex min-h-7 items-center justify-between gap-2 px-1">
        <span className="truncate text-sm text-silver-mist transition-colors group-hover:text-white">{logo.alt}</span>
        {logo.reference && <span className="void-chip hidden shrink-0 !min-h-6 !px-2.5 !text-[11px] sm:inline-flex">{caseStudy}</span>}
        {logo.reference && <ArrowUpRight aria-label={caseStudy} className="h-4 w-4 shrink-0 text-saffron-spark sm:hidden" />}
        {!logo.reference && logo.url && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ash-gray transition-colors group-hover:text-white" />}
      </span>
    </>
  )
  if (logo.reference) {
    return <Link href={referenceHref(locale, logo.reference)} className="client-tile group block">{body}</Link>
  }
  if (logo.url) {
    return <a href={logo.url} target="_blank" rel="noopener noreferrer" className="client-tile group block">{body}</a>
  }
  return <div className="client-tile group block">{body}</div>
}

/** Every client logo as a grid; tiles with a case study or a live site link there. Data: ./logos.ts */
export function ClientGrid({ locale, caseStudy }: { locale: Locale; caseStudy: string }) {
  // case studies first, then the rest in list order
  const sorted = [...LOGOS.filter(l => l.reference), ...LOGOS.filter(l => !l.reference)]
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {sorted.map(logo => (
        <li key={logo.src} className="void-reveal">
          <Tile logo={logo} locale={locale} caseStudy={caseStudy} />
        </li>
      ))}
    </ul>
  )
}
