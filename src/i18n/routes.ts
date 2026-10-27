/*
 * Public-site locales. Hungarian stays at the root (existing URLs); English lives under /en
 * with English slugs. Every public route is listed once here so links and the language
 * switcher always point at the matching page in the other language.
 */
export type Locale = 'hu' | 'en'
export const LOCALES: Locale[] = ['hu', 'en']

export const ROUTES = {
  home: { hu: '/', en: '/en' },
  services: { hu: '/szolgaltatasok', en: '/en/services' },
  website: { hu: '/szolgaltatasok/bemutatkozo-weboldal', en: '/en/services/website' },
  webshop: { hu: '/szolgaltatasok/webshop', en: '/en/services/webshop' },
  booking: { hu: '/szolgaltatasok/foglalasi-rendszer', en: '/en/services/booking-system' },
  landing: { hu: '/szolgaltatasok/landing-page', en: '/en/services/landing-page' },
  crm: { hu: '/szolgaltatasok/crm', en: '/en/services/crm' },
  erp: { hu: '/szolgaltatasok/erp', en: '/en/services/erp' },
  maintenance: { hu: '/szolgaltatasok/uzemeltetes', en: '/en/services/maintenance' },
  references: { hu: '/referenciak', en: '/en/references' },
  pricing: { hu: '/arak', en: '/en/pricing' },
  contact: { hu: '/kapcsolat', en: '/en/contact' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof ROUTES

/** Localised path for a route key, e.g. href('en', 'contact') → '/en/contact'. */
export function href(locale: Locale, key: RouteKey): string {
  return ROUTES[key][locale]
}

/** Reference detail pages keep the same slug in both languages. */
export function referenceHref(locale: Locale, slug: string): string {
  return `${ROUTES.references[locale]}/${slug}`
}

export function localeOf(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'hu'
}

/** The same page in the other language (falls back to that language's home page). */
export function switchPath(pathname: string, to: Locale): string {
  const from = localeOf(pathname)
  if (from === to) return pathname
  const clean = pathname.replace(/\/$/, '') || '/'
  for (const r of Object.values(ROUTES)) {
    if (r[from] === clean) return r[to]
  }
  const refBase = ROUTES.references[from] + '/'
  if (clean.startsWith(refBase)) return ROUTES.references[to] + '/' + clean.slice(refBase.length)
  return ROUTES.home[to]
}

/** `alternates` for page metadata: canonical + hreflang links for both languages. */
export function alternates(locale: Locale, key: RouteKey) {
  return {
    canonical: ROUTES[key][locale],
    languages: { hu: ROUTES[key].hu, en: ROUTES[key].en, 'x-default': ROUTES[key].hu },
  }
}
