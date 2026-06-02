import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { FadeIn } from '@/components/public/FadeIn'
import { ContactForm } from '@/components/public/ContactForm'

export const metadata = {
  title: 'Kapcsolat | Weboldalas',
  description: 'Vegye fel velünk a kapcsolatot! Ajánlatot kér, kérdése van? Szívesen segítünk.',
}

const contacts = [
  { icon: Phone, label: 'Telefon', value: '+36 30 123 4567', href: 'tel:+36301234567' },
  { icon: Mail, label: 'Email', value: 'info@weboldalas.hu', href: 'mailto:info@weboldalas.hu' },
  { icon: Clock, label: 'Nyitvatartás', value: 'H–P: 9:00–18:00', href: null },
  { icon: MapPin, label: 'Régió', value: 'Magyarország', href: null },
]

const promises = [
  '1 munkanapon belüli visszajelzés',
  'Ingyenes konzultáció',
  'Testre szabott ajánlat',
  'Nincs rejtett díj',
  'Magyar ügyfélszolgálat',
]

export default function KapcsolatPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #0ea5e9, transparent)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#38bdf8' }}>Lépj kapcsolatba</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Írj nekünk,{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #06b6d4)' }}>
                visszajelzünk
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Töltsd ki az alábbi űrlapot, és általában 1 munkanapon belül visszajelzünk.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

            {/* Form */}
            <FadeIn from="left">
              <div className="rounded-3xl p-8 lg:p-10"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="text-2xl font-bold text-white mb-2">Ajánlatot kérek</h2>
                <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Töltsd ki az alábbi mezőket, és visszajelzünk.
                </p>
                <ContactForm />
              </div>
            </FadeIn>

            {/* Info */}
            <FadeIn from="right">
              <div className="space-y-5">
                {/* Contact cards */}
                <div className="grid grid-cols-2 gap-3">
                  {contacts.map((c, i) => {
                    const Icon = c.icon
                    const content = (
                      <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.label}</div>
                        <div className="text-sm font-semibold text-white">{c.value}</div>
                      </div>
                    )
                    return c.href ? (
                      <a key={i} href={c.href}>{content}</a>
                    ) : (
                      <div key={i}>{content}</div>
                    )
                  })}
                </div>

                {/* Promise card */}
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
                  <h3 className="font-bold text-white mb-4">Amit ígérünk</h3>
                  <ul className="space-y-3">
                    {promises.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Testimonial */}
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.35)' }}>5.0 · Google értékelés</span>
                  </div>
                  <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    "Gyors, profi csapat. 1 héten belül élőben volt a weboldalunk, és azóta folyamatosan nőnek az online foglalásaink."
                  </p>
                  <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>— Kis Péter, Panzió tulajdonos</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
