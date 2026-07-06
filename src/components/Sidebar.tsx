'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Settings,
  ListTodo,
  CheckSquare,
  LogOut,
  Menu,
  RefreshCw,
  FileSignature,
} from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'

const routes = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Feladatok', icon: CheckSquare },
  { href: '/leads', label: 'Érdeklődők', icon: Users },
  { href: '/customers', label: 'Ügyfelek', icon: Briefcase },
  { href: '/offers', label: 'Ajánlatok', icon: ListTodo },
  { href: '/contracts', label: 'Szerződések', icon: FileSignature },
  { href: '/payments', label: 'Pénzügy', icon: CreditCard },
  { href: '/subscriptions', label: 'Előfizetések', icon: RefreshCw },
  { href: '/settings', label: 'Beállítások', icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col" style={{
      background: 'hsl(222 25% 12%)',
      borderRight: '1px solid hsl(222 20% 18%)',
    }}>
      {/* Logo area */}
      <div className="flex h-16 items-center px-5" style={{ borderBottom: '1px solid hsl(222 20% 18%)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/weboldalas-logo.svg"
            alt="Weboldalas"
            width={140}
            height={19}
            className="transition-opacity duration-200 group-hover:opacity-80"
          />
          <span className="text-xs font-medium text-white/30 tracking-widest uppercase">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="flex flex-col gap-1">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname.startsWith(route.href)

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'text-[hsl(72_91%_62%)]'
                    : 'text-[hsl(222_10%_55%)] hover:text-white'
                )}
                style={isActive ? {
                  background: 'hsl(72 91% 62% / 0.10)',
                  borderLeft: '2px solid hsl(72 91% 62%)',
                  paddingLeft: '10px',
                } : {
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'hsl(222 20% 17%)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid hsl(222 20% 18%)' }}>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ color: 'hsl(222 10% 50%)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(222 20% 17%)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'hsl(222 10% 50%)' }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Kijelentkezés
          </button>
        </form>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Topbar */}
      <div className="flex flex-col md:hidden">
        <header className="flex h-14 items-center gap-4 px-4"
          style={{ background: 'hsl(222 25% 12%)', borderBottom: '1px solid hsl(222 20% 18%)' }}>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 text-white/70 hover:text-white hover:bg-white/10" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Navigáció megnyitása</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64 border-0 bg-transparent">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={110} height={15} />
        </header>
      </div>
    </>
  )
}
