import type { Locale } from '@/i18n/routes'

export type ContactContent = {
  meta: { title: string; description: string }
  label: string
  title: string
  accent: string
  intro: string
  send: string
  formLabel: string
  formTitle: string
  detailsLabel: string
  details: { label: string; value: string; href: string | null }[]
  promisesLabel: string
  promises: string[]
}

const hu: ContactContent = {
  meta: { title: 'Kapcsolat | Weboldalas', description: 'Ajánlatot kérnél, vagy kérdésed van? Írj nekünk, szívesen segítünk.' },
  label: 'Kapcsolat',
  title: 'Írj nekünk.',
  accent: 'nekünk.',
  intro: 'Töltsd ki az űrlapot, és általában 1 munkanapon belül jelentkezünk egy konkrét javaslattal.',
  send: 'Üzenet küldése',
  formLabel: 'Ajánlatkérés',
  formTitle: 'Mesélj a projektedről.',
  detailsLabel: 'Elérhetőségek',
  details: [
    { label: 'Telefon', value: '+36 30 123 4567', href: 'tel:+36301234567' },
    { label: 'Email', value: 'info@weboldalas.hu', href: 'mailto:info@weboldalas.hu' },
    { label: 'Nyitvatartás', value: 'H–P: 9:00–18:00', href: null },
    { label: 'Régió', value: 'Magyarország', href: null },
  ],
  promisesLabel: 'Amit vállalunk',
  promises: ['1 munkanapon belüli visszajelzés', 'Ingyenes konzultáció', 'Testre szabott ajánlat', 'Nincs rejtett díj', 'Magyar ügyfélszolgálat'],
}

const en: ContactContent = {
  meta: { title: 'Contact | Weboldalas', description: 'Want a quote or have a question? Write to us, we’re happy to help.' },
  label: 'Contact',
  title: 'Write to us.',
  accent: 'us.',
  intro: 'Fill in the form and we’ll usually get back to you within one business day with a concrete proposal.',
  send: 'Send a message',
  formLabel: 'Request a quote',
  formTitle: 'Tell us about your project.',
  detailsLabel: 'Contact details',
  details: [
    { label: 'Phone', value: '+36 30 123 4567', href: 'tel:+36301234567' },
    { label: 'Email', value: 'info@weboldalas.hu', href: 'mailto:info@weboldalas.hu' },
    { label: 'Office hours', value: 'Mon–Fri: 9:00–18:00 (CET)', href: null },
    { label: 'Location', value: 'Hungary', href: null },
  ],
  promisesLabel: 'What we commit to',
  promises: ['A reply within one business day', 'Free consultation', 'A tailored quote', 'No hidden fees'],
}

export const CONTACT: Record<Locale, ContactContent> = { hu, en }
