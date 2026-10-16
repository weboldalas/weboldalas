import { ContactForm } from '@/components/public/ContactForm'
import { ParticlePage } from '@/components/public/void/ParticlePage'
import { PageHero } from '@/components/public/void/PageHero'
import { Label, TriangleBullet, container } from '@/components/public/void/ui'

export const metadata = {
  title: 'Kapcsolat | Weboldalas',
  description: 'Ajánlatot kérnél, vagy kérdésed van? Írj nekünk, szívesen segítünk.',
}

const contacts = [
  { label: 'Telefon', value: '+36 30 123 4567', href: 'tel:+36301234567' },
  { label: 'Email', value: 'info@weboldalas.hu', href: 'mailto:info@weboldalas.hu' },
  { label: 'Nyitvatartás', value: 'H–P: 9:00–18:00', href: null },
  { label: 'Régió', value: 'Magyarország', href: null },
]

const promises = [
  '1 munkanapon belüli visszajelzés',
  'Ingyenes konzultáció',
  'Testre szabott ajánlat',
  'Nincs rejtett díj',
  'Magyar ügyfélszolgálat',
]

export default async function KapcsolatPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // prefill from the pricing calculator (?szolgaltatas=…&terv=…)
  const sp = await searchParams
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 160) ?? ''
  const interest = one(sp.szolgaltatas)
  const plan = one(sp.terv)
  return (
    <ParticlePage>
      <PageHero
        label="Kapcsolat"
        title="Írj nekünk."
        shape="plane"
        actions={<a href="#urlap" className="void-button">Üzenet küldése</a>}
      >
        Töltsd ki az űrlapot, és általában 1 munkanapon belül jelentkezünk egy konkrét javaslattal.
      </PageHero>

      <section id="urlap" className="void-section scroll-mt-20" data-particles="none">
        <div className={`${container} grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24`}>
          <div className="void-reveal">
            <Label>Ajánlatkérés</Label>
            <h2 className="mt-5 text-heading-sm sm:text-heading">Mesélj a vállalkozásodról.</h2>
            <div className="mt-10">
              <ContactForm initialInterest={interest} initialMessage={plan ? `Kalkulátor: ${plan}\n\n` : ''} />
            </div>
          </div>

          <div className="void-reveal space-y-14 lg:pt-4">
            <div>
              <Label>Elérhetőségek</Label>
              <dl className="mt-6 space-y-6">
                {contacts.map(c => (
                  <div key={c.label}>
                    <dt className="text-caption text-ash-gray">{c.label}</dt>
                    <dd className="mt-1 text-heading-2xs">
                      {c.href ? <a href={c.href} className="transition-colors hover:text-electric-iris">{c.value}</a> : c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Label>Amit vállalunk</Label>
              <ul className="mt-6 space-y-3">
                {promises.map(p => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-bone-white"><TriangleBullet /> {p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </ParticlePage>
  )
}
