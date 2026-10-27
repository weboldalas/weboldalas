import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { GhostLink } from '@/components/public/void/ui'

const steps = ['Tervezés', 'Fejlesztés', 'Üzemeltetés']

/** Concept C: the team photo fills the first screen, violet-tinted, with the headline on top. */
export function HeroImmersive() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <Image
        src="/images/csapat.webp"
        alt="A Weboldalas csapata munka közben, két laptop előtt"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[60%_35%]"
      />
      {/* violet tint + scrims so the white type always reads */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#8052ff] opacity-25 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/45" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/80 to-transparent" />

      <div className="mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <Link href="/szolgaltatasok/erp" className="void-pill void-in self-start !bg-[#0b0b0e]/80">
          <span className="void-pill-tag">Új</span>
          ERP rendszerek
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h1 className="text-heading sm:text-heading-lg xl:text-display">
              <span className="block">Weboldalak.</span>
              <span className="block">Webshopok.</span>
              <span className="block"><span className="void-mark">Rendszerek.</span></span>
            </h1>
            <p className="void-in text-body mt-6 max-w-xl font-extralight text-white/80" style={{ animationDelay: '120ms' }}>
              Egyéni vállalkozóknak, KKV-knak és nagyvállalatoknak tervezünk, fejlesztünk és üzemeltetünk weboldalakat, webshopokat és egyedi rendszereket. Egy összegben vagy részletekben fizetve.
            </p>
            <div className="void-in mt-8 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: '180ms' }}>
              <Link href="/kapcsolat" className="void-button">Ajánlatot kérek</Link>
              <GhostLink href="/referenciak">Munkáink</GhostLink>
            </div>
          </div>

          {/* the process at a glance */}
          <ol className="void-in hidden gap-3 lg:grid" style={{ animationDelay: '240ms' }}>
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b0b0e]/80 px-5 py-4">
                <span className="text-caption tabular-nums text-ash-gray">0{i + 1}</span>
                <span className="text-heading-2xs">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <a href="#tovabb" className="mt-10 hidden items-center gap-2 self-start text-sm text-white/60 transition-colors hover:text-white sm:inline-flex">
          <ArrowDown className="h-4 w-4 animate-bounce" /> Görgess tovább
        </a>
      </div>
    </section>
  )
}
