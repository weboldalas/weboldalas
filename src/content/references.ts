import { REFERENCES, type Reference } from '@/app/(public)/referenciak/references'
import { REFERENCES_EN } from './references.en'
import type { Locale } from '@/i18n/routes'

/** Case studies in the given language (same slugs and order in both). */
export function getReferences(locale: Locale): Reference[] {
  return locale === 'en' ? REFERENCES_EN : REFERENCES
}
