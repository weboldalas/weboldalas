import { LayoutDashboard, Users, Briefcase, CreditCard, Settings, ListTodo, CheckSquare, RefreshCw, FileSignature, UserPlus, Plus, FilePlus } from 'lucide-react'

export const navigationGroups = [
  { label: 'Munkaterület', routes: [
    { href: '/dashboard', label: 'Áttekintés', description: 'Napi teendők és üzleti összefoglaló', icon: LayoutDashboard },
    { href: '/tasks', label: 'Feladatok', description: 'Teendők, határidők és projektfeladatok', icon: CheckSquare },
  ] },
  { label: 'Ügyfélkapcsolatok', routes: [
    { href: '/leads', label: 'Érdeklődők', description: 'Értékesítési folyamat és visszahívások', icon: Users },
    { href: '/customers', label: 'Ügyfelek', description: 'Ügyféladatok és kapcsolattartás', icon: Briefcase },
    { href: '/offers', label: 'Ajánlatok', description: 'Árajánlatok készítése és követése', icon: ListTodo },
    { href: '/contracts', label: 'Szerződések', description: 'Szerződések és aláírások', icon: FileSignature },
  ] },
  { label: 'Pénzügyek', routes: [
    { href: '/payments', label: 'Befizetések', description: 'Fizetések és pénzügyi nyilvántartás', icon: CreditCard },
    { href: '/subscriptions', label: 'Előfizetések', description: 'Havidíjas ügyfelek és csomagok', icon: RefreshCw },
  ] },
  { label: 'Rendszer', routes: [
    { href: '/settings', label: 'Beállítások', description: 'Cégadatok és dokumentumbeállítások', icon: Settings },
  ] },
]

export const adminRoutes = navigationGroups.flatMap(group => group.routes)
export const quickActions = [
  { href: '/leads/new', label: 'Új érdeklődő', description: 'Érdeklődő rögzítése', icon: UserPlus },
  { href: '/tasks/new', label: 'Új feladat', description: 'Teendő és határidő rögzítése', icon: Plus },
  { href: '/offers/new', label: 'Új ajánlat', description: 'Árajánlat készítése', icon: FilePlus },
  { href: '/customers/new', label: 'Új ügyfél', description: 'Ügyfél rögzítése', icon: Briefcase },
]
