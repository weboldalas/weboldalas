import { logout } from '@/app/login/actions'

export const metadata = { title: 'Partner portál | Weboldalas', robots: { index: false, follow: false } }

/** Placeholder until the partner portal ships (phase 2). Partner contacts who sign in land here. */
export default function PortalPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6" style={{ background: '#f6f6f8', color: '#0e0e12' }}>
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center" style={{ border: '1px solid #e7e7ec', boxShadow: '0 8px 24px -8px rgb(16 16 24 / 0.1)' }}>
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-white" style={{ background: '#7c4dff' }}>W</div>
        <h1 className="text-xl font-semibold tracking-tight">A partner portál hamarosan érkezik</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: '#55555f' }}>
          Itt fogod látni a projektjeidet, az ajánlatokat és a számlákat, és itt adhatsz majd feladatot is. Addig e-mailben vagy telefonon érsz el minket.
        </p>
        <form action={logout} className="mt-6">
          <button type="submit" className="h-10 rounded-xl px-4 text-sm font-semibold" style={{ border: '1px solid #d5d5dd' }}>Kijelentkezés</button>
        </form>
      </div>
    </main>
  )
}
