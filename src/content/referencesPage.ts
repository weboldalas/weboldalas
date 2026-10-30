import type { Locale } from '@/i18n/routes'

const hu = {
  meta: { title: 'Referenciáink | Weboldalas', description: 'Elkészült weboldalak és projektek: nézd meg, mit építettünk ügyfeleinknek.' },
  detailTitle: (name: string) => `${name} – Referencia | Weboldalas`,
  label: 'Referenciák',
  title: 'Nem ígérjük. Megmutatjuk.',
  accent: 'Megmutatjuk.',
  intro: 'Minden projekt egyedi, a cél mégis ugyanaz: olyan weboldal, amit az ügyfél szeret használni.',
  projects: 'Projektek',
  similar: 'Hasonlót szeretnék',
  ctaTitle: 'Te jöhetsz.',
  ctaText: 'Mesélj a projektedről, és megmutatjuk, mit építenénk neked.',
  ctaButton: 'Beszéljünk',
  all: 'Összes referencia',
  visit: 'Weboldal megtekintése',
  about: 'A projektről',
  challenge: 'A kihívás',
  whatWeDid: 'Amit csináltunk',
  features: 'Funkciók',
  featuresTitle: 'Főbb funkciók.',
  outcome: 'Eredmény',
  next: 'Következő projekt',
  clientsLabel: 'Ügyfeleink',
  clientsTitle: 'Akiknek már dolgoztunk.',
  clientsText: 'Webshopok, vállalati oldalak, turisztikai portálok és egyedi rendszerek. Néhányukról részletes esettanulmányt is írtunk.',
  caseStudy: 'Esettanulmány',
}

type Strings = typeof hu

const en: Strings = {
  meta: { title: 'Our work | Weboldalas', description: 'Websites and projects we have delivered: see what we built for our clients.' },
  detailTitle: (name: string) => `${name} – Case study | Weboldalas`,
  label: 'Our work',
  title: 'We don’t promise. We show.',
  accent: 'We show.',
  intro: 'Every project is different, but the goal is always the same: a website the client enjoys using.',
  projects: 'Projects',
  similar: 'I want something similar',
  ctaTitle: 'You could be next.',
  ctaText: 'Tell us about your project and we’ll show you what we would build for you.',
  ctaButton: 'Let’s talk',
  all: 'All case studies',
  visit: 'Visit the website',
  about: 'About the project',
  challenge: 'The challenge',
  whatWeDid: 'What we did',
  features: 'Features',
  featuresTitle: 'Key features.',
  outcome: 'Outcome',
  next: 'Next project',
  clientsLabel: 'Clients',
  clientsTitle: 'Who we have worked with.',
  clientsText: 'Webshops, company websites, tourism portals and custom systems. For some of them we have written a detailed case study.',
  caseStudy: 'Case study',
}

export const REFERENCES_PAGE: Record<Locale, Strings> = { hu, en }
