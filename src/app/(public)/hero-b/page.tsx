import { ParticlePage } from '@/components/public/void/ParticlePage'
import { HeroCentered } from '@/components/public/home/HeroCentered'

// temporary preview of an alternative homepage hero; not linked, not indexed
export const metadata = { title: 'Hero B (előnézet) | Weboldalas', robots: { index: false, follow: false } }

export default function HeroBPreview() {
  return (
    <ParticlePage>
      <HeroCentered />
      <section className="void-section" data-particles="none" />
    </ParticlePage>
  )
}
