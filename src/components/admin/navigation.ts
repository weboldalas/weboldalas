import {
  LayoutDashboard, Building2, FolderKanban, CheckSquare, Users, FileText, FileSignature,
  Receipt, Repeat, Wallet, Settings, UserPlus, FilePlus, Plus, type LucideIcon,
} from 'lucide-react'

export type NavRoute = { href: string; label: string; description: string; icon: LucideIcon }

export const navigationGroups: { label: string; routes: NavRoute[] }[] = [
  { label: 'Munkaterület', routes: [
    { href: '/dashboard', label: 'Áttekintés', description: 'Pénzügyek és teendők egy pillantásra', icon: LayoutDashboard },
    { href: '/partners', label: 'Partnerek', description: 'Partnerek, kapcsolattartók és minden adatuk', icon: Building2 },
    { href: '/projects', label: 'Projektek', description: 'Futó és lezárt projektek', icon: FolderKanban },
    { href: '/tasks', label: 'Feladatok', description: 'Teendők és határidők', icon: CheckSquare },
  ] },
  { label: 'Értékesítés', routes: [
    { href: '/leads', label: 'Érdeklődők', description: 'Értékesítési folyamat és visszahívások', icon: Users },
    { href: '/offers', label: 'Ajánlatok', description: 'Árajánlatok készítése és követése', icon: FileText },
    { href: '/contracts', label: 'Szerződések', description: 'Szerződések és aláírások', icon: FileSignature },
  ] },
  { label: 'Pénzügy', routes: [
    { href: '/invoices', label: 'Számlák', description: 'Kintlévőségek és befizetések számlánként', icon: Receipt },
    { href: '/subscriptions', label: 'Havidíjak', description: 'Fix havi bevételt hozó csomagok', icon: Repeat },
    { href: '/payments', label: 'Befizetések', description: 'Beérkezett és várható befizetések', icon: Wallet },
  ] },
  { label: 'Rendszer', routes: [
    { href: '/settings', label: 'Beállítások', description: 'Cégadatok, aláírás, dokumentumok', icon: Settings },
  ] },
]

export const adminRoutes = navigationGroups.flatMap(group => group.routes)

export const quickActions: NavRoute[] = [
  { href: '/partners/new', label: 'Új partner', description: 'Partner és kapcsolattartó', icon: Building2 },
  { href: '/invoices/new', label: 'Új számla', description: 'Kintlévőség rögzítése', icon: Receipt },
  { href: '/offers/new', label: 'Új ajánlat', description: 'Árajánlat készítése', icon: FilePlus },
  { href: '/projects/new', label: 'Új projekt', description: 'Projekt partnerhez', icon: FolderKanban },
  { href: '/leads/new', label: 'Új érdeklődő', description: 'Érdeklődő rögzítése', icon: UserPlus },
  { href: '/tasks/new', label: 'Új feladat', description: 'Teendő és határidő', icon: Plus },
]

export function findRoute(pathname: string) {
  return adminRoutes.find(route => pathname === route.href || pathname.startsWith(`${route.href}/`))
}
