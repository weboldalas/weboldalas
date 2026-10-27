import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, PenTool, Code2, ShieldCheck } from 'lucide-react'
import { GhostLink } from '@/components/public/void/ui'

const floats = [
  { icon: PenTool, label: 'Tervezés', className: 'left-4 top-4 sm:left-8 sm:top-8', delay: '0s' },
  { icon: Code2, label: 'Fejlesztés', className: 'right-4 top-1/3 sm:right-8', delay: '1.2s' },
  { icon: ShieldCheck, label: 'Üzemeltetés', className: 'bottom-16 left-6 sm:bottom-20 sm:left-[18%]', delay: '2.4s' },
]

/** Concept B: centred headline, wide cinematic team photo with floating service chips. */
export function HeroCentered() {
  return (
    <section>
      <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-32">
        <Link href="/szolgaltatasok/erp" className="void-pill void-in">
          <span className="void-pill-tag">Új</span>
          ERP rendszerek
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <h1 className="mx-auto mt-8 max-w-4xl text-heading sm:text-heading-lg">
          Weboldalak, webshopok és <span className="void-mark">rendszerek</span>, ketten, személyesen.
        </h1>

        <p className="void-in text-body font-extralight mx-auto mt-6 max-w-2xl text-silver-mist sm:mt-8" style={{ animationDelay: '120ms' }}>
          Egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak tervezünk, fejlesztünk és üzemeltetünk, az első beszélgetéstől az élesítésen túl is. Egy összegben vagy részletekben fizetve.
        </p>

        <div className="void-in mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:mt-10" style={{ animationDelay: '180ms' }}>
          <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
          <GhostLink href="/referenciak">Munkáink</GhostLink>
        </div>

        <figure className="void-in relative mt-12 sm:mt-16" style={{ animationDelay: '260ms' }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src="/images/csapat.webp"
              alt="A Weboldalas csapata munka közben, két laptop előtt"
              fill
              priority
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="object-cover object-[55%_38%]"
            />
          </div>
          {floats.map(f => (
            <span key={f.label} className={`void-float void-pill absolute !hidden !bg-[#0b0b0e] !pl-1.5 sm:!inline-flex ${f.className}`} style={{ animationDelay: f.delay }}>
              <span className="void-icon !h-7 !w-7 !rounded-full"><f.icon className="h-3.5 w-3.5" strokeWidth={1.8} /></span>
              {f.label}
            </span>
          ))}
          <figcaption className="void-pill absolute bottom-4 right-4 !bg-[#0b0b0e] sm:bottom-6 sm:right-6">
            <span className="void-pill-dot" aria-hidden />
            Ketten csináljuk, az elejétől a végéig
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
