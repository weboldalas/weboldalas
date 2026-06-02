import Image from 'next/image'
import { login } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'oklch(1 0 0 / 0.03)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid oklch(1 0 0 / 0.08)',
        }}>
        {/* Decorative glow blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, oklch(0.60 0.22 290 / 0.25) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 240 / 0.20) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative">
          <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={180} height={24} />
        </div>

        {/* Tagline */}
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white/60"
            style={{ background: 'oklch(1 0 0 / 0.07)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CRM + Projektmenedzsment + Pénzügy
          </div>
          <blockquote className="text-3xl font-bold leading-snug text-white">
            Minden ügyfeled,<br />
            minden ajánlatod,<br />
            <span style={{ background: 'linear-gradient(to right, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              egy helyen.
            </span>
          </blockquote>
          <p className="text-sm text-white/50 max-w-sm">
            Kezelje leadjeit, ügyfeleit, ajánlatait, pénzügyeit és feladatait egyetlen elegáns felületen.
          </p>
        </div>

        {/* Feature chips */}
        <div className="relative flex flex-wrap gap-2">
          {['Leadkezelés', 'Ajánlatok', 'Pénzügy', 'Feladatok', 'Magyar UI', 'Supabase Auth'].map((f) => (
            <span key={f} className="rounded-full px-3 py-1 text-xs text-white/60"
              style={{ background: 'oklch(1 0 0 / 0.07)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={140} height={19} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Bejelentkezés</h1>
            <p className="text-white/50 text-sm">
              Add meg az adataidat az admin felület eléréséhez.
            </p>
          </div>

          <form action={login} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/70">Email cím</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@weboldalas.hu"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/70">Jelszó</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11"
              />
            </div>

            {resolvedSearchParams?.message && (
              <div className="rounded-xl px-4 py-3"
                style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
                <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>
                  ⚠️ Hibás email vagy jelszó.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm text-white border-0 shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, oklch(0.60 0.22 290), oklch(0.55 0.22 240))',
                boxShadow: '0 4px 24px oklch(0.60 0.22 290 / 0.4)',
              }}
            >
              Bejelentkezés
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
