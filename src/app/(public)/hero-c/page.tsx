import { ParticlePage } from '@/components/public/void/ParticlePage'
import { HeroImmersive } from '@/components/public/home/HeroImmersive'

// temporary preview of an alternative homepage hero; not linked, not indexed
export const metadata = { title: 'Hero C (előnézet) | Weboldalas', robots: { index: false, follow: false } }

export default function HeroCPreview() {
  return (
    <ParticlePage>
      <HeroImmersive />
      <section id="tovabb" className="void-section" data-particles="none" />
    </ParticlePage>
  )
}
