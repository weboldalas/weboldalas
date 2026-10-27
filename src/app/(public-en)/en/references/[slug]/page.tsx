import { notFound } from 'next/navigation'
import { ReferenceDetailView } from '@/components/public/views/ReferenceDetailView'
import { getReferences } from '@/content/references'
import { REFERENCES_PAGE } from '@/content/referencesPage'
import { referenceHref, ROUTES } from '@/i18n/routes'

const LOCALE = 'en' as const

export function generateStaticParams() {
  return getReferences(LOCALE).map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ref = getReferences(LOCALE).find(r => r.slug === slug)
  if (!ref) return {}
  return {
    title: REFERENCES_PAGE[LOCALE].detailTitle(ref.name),
    description: ref.tagline,
    alternates: {
      canonical: referenceHref(LOCALE, slug),
      languages: { hu: `${ROUTES.references.hu}/${slug}`, en: `${ROUTES.references.en}/${slug}`, 'x-default': `${ROUTES.references.hu}/${slug}` },
    },
  }
}

export default async function ReferenceDetailPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getReferences(LOCALE).some(r => r.slug === slug)) notFound()
  return <ReferenceDetailView locale={LOCALE} slug={slug} />
}
