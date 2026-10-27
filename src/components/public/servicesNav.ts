import { Globe, ShoppingBag, Calendar, LayoutTemplate, Users, Boxes, Wrench, type LucideIcon } from 'lucide-react'
import { href, type Locale, type RouteKey } from '@/i18n/routes'
import { ui } from '@/i18n/ui'

const ITEMS: { key: RouteKey & keyof ReturnType<typeof ui>['services']; icon: LucideIcon }[] = [
  { key: 'website', icon: Globe },
  { key: 'webshop', icon: ShoppingBag },
  { key: 'booking', icon: Calendar },
  { key: 'landing', icon: LayoutTemplate },
  { key: 'crm', icon: Users },
  { key: 'erp', icon: Boxes },
  { key: 'maintenance', icon: Wrench },
]

/** Services as shown in the navigation (desktop mega menu, mobile menu, footer). */
export function servicesNav(locale: Locale) {
  const t = ui(locale).services
  return ITEMS.map(i => ({ href: href(locale, i.key), label: t[i.key].label, desc: t[i.key].desc, icon: i.icon }))
}
