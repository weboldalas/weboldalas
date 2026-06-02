import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { User, Shield, LogOut } from 'lucide-react'

export const metadata = {
  title: 'Beállítások | Weboldalas Admin',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Beállítások</h1>
        <p className="text-white/50 mt-1">Fiók és rendszer beállítások.</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {/* Account info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-xl p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Fiók</CardTitle>
              <CardDescription className="text-white/40">Bejelentkezett felhasználó adatai</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Email cím</span>
              <span className="text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Felhasználó ID</span>
              <span className="text-white/60 font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/50">Utolsó bejelentkezés</span>
              <span className="text-white/60">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString('hu-HU')
                  : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-xl p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Biztonság</CardTitle>
              <CardDescription className="text-white/40">Hitelesítés és hozzáférés</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Bejelentkezési módszer</span>
              <span className="text-white/60">Email + jelszó</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/50">Szerepkör</span>
              <span className="text-white/60">{user?.role || 'authenticated'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-xl p-2.5 bg-gradient-to-br from-rose-500 to-red-500 shadow-lg">
              <LogOut className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white">Kijelentkezés</CardTitle>
              <CardDescription className="text-white/40">Munkamenet befejezése</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form action={logout}>
              <Button
                type="submit"
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Kijelentkezés
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
