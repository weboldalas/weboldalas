import { ScrollParticles } from '@/components/public/home/ScrollParticles'

/**
 * Page wrapper for the public site: black canvas + the scroll-morphing particle cloud.
 * Put `data-particles="<shape|scatter|none>"` on elements inside to control the cloud.
 */
export function ParticlePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="void-page relative overflow-x-clip bg-void text-bone-white [&>section]:relative [&>section]:z-10">
      <ScrollParticles />
      {children}
    </div>
  )
}
