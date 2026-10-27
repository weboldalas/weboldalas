import { Globe, ShoppingBag, Calendar, LayoutTemplate, Users, Boxes, Wrench, type LucideIcon } from 'lucide-react'

/** Services as shown in the navigation (desktop mega menu + mobile menu). */
export const SERVICES_NAV: { href: string; label: string; desc: string; icon: LucideIcon }[] = [
  { href: '/szolgaltatasok/bemutatkozo-weboldal', label: 'Bemutatkozó weboldal', desc: 'A céged online névjegye', icon: Globe },
  { href: '/szolgaltatasok/webshop', label: 'Webshop', desc: 'Online bolt fizetéssel, rendeléskezeléssel', icon: ShoppingBag },
  { href: '/szolgaltatasok/foglalasi-rendszer', label: 'Foglalási rendszer', desc: 'Online időpontfoglalás a weboldaladon', icon: Calendar },
  { href: '/szolgaltatasok/landing-page', label: 'Landing page', desc: 'Egy oldal kampányokhoz, hirdetésekhez', icon: LayoutTemplate },
  { href: '/szolgaltatasok/crm', label: 'CRM rendszer', desc: 'Érdeklődők, ajánlatok, ügyfelek egy helyen', icon: Users },
  { href: '/szolgaltatasok/erp', label: 'ERP rendszer', desc: 'Az egész cég működése egy rendszerben', icon: Boxes },
  { href: '/szolgaltatasok/uzemeltetes', label: 'Üzemeltetés', desc: 'Tárhely, frissítések, mentések, támogatás', icon: Wrench },
]
