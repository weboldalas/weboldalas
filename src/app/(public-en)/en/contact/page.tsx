import { ContactView } from '@/components/public/views/ContactView'
import { CONTACT } from '@/content/contact'
import { alternates } from '@/i18n/routes'

export const metadata = { ...CONTACT.en.meta, alternates: alternates('en', 'contact') }

export default function ContactPageEn() {
  return <ContactView locale="en" />
}
