import type { ShapeName } from '@/components/public/home/particleShapes'

/** Renders the title with one accent phrase underlined by an animated violet stroke (DESIGN.md). */
function Accented({ title, accent }: { title: string; accent?: string }) {
  if (!accent || !title.includes(accent)) return <>{title}</>
  const i = title.indexOf(accent)
  return <>{title.slice(0, i)}<span className="void-mark">{accent}</span>{title.slice(i + accent.length)}</>
}

/** Sub-page hero: status pill, display headline, body + actions on the left; a particle shape forms on the right. */
export function PageHero({
  label, title, accent, children, actions, shape, back,
}: {
  label: string
  title: string
  /** part of the title that gets the animated underline */
  accent?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  shape: ShapeName
  back?: React.ReactNode
}) {
  // long headlines (service pages) stay one step smaller so the hero fits the first screen
  const long = title.length > 28
  return (
    <section>
      <div className="mx-auto grid min-h-[86svh] max-w-[1280px] content-center gap-2 px-4 pb-12 pt-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-0 lg:px-8 lg:pb-20 lg:pt-24">
        <div data-particles={shape} aria-hidden className="h-[34svh] min-h-[230px] lg:order-2 lg:h-[min(680px,78svh)]" />
        <div className="lg:order-1">
          {back && <div className="mb-6">{back}</div>}
          <span className="void-pill void-in">
            <span className="void-pill-dot" aria-hidden />
            {label}
          </span>
          <h1 className={`mt-6 text-heading sm:text-heading-lg ${long ? '' : 'xl:text-display'}`}>
            <Accented title={title} accent={accent} />
          </h1>
          {children && <div className="void-in text-body font-extralight mt-6 max-w-[520px] text-silver-mist" style={{ animationDelay: '100ms' }}>{children}</div>}
          {actions && <div className="void-in mt-8 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: '160ms' }}>{actions}</div>}
        </div>
      </div>
    </section>
  )
}
