import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RespondButtons } from './RespondButtons'

// We use the service role key to bypass RLS for public token access
// Do NOT use the client auth here as this is a public page.
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function PublicOfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = getServiceClient()

  const { data: offer, error } = await supabase
    .from('offers')
    .select('*, customers(*), leads(*), offer_items(*)')
    .eq('public_token', token)
    .single()

  if (error || !offer) {
    notFound()
  }

  const { offer_items: items } = offer
  const targetName = offer.customers?.name || offer.leads?.name || 'Ügyfél'

  let paymentText = 'Egyösszegű fizetés'
  let paymentLabel = 'Összesen fizetendő'
  
  if (offer.payment_type === 'installments') {
    paymentText = `Részletfizetés: ${offer.installment_months} hónap`
  } else if (offer.payment_type === 'subscription') {
    paymentText = `Előfizetés: ${offer.subscription_plan_name}`
    paymentLabel = 'Havi díj'
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 290) 0%, transparent 70%)' }} />

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12 mt-4">
          <div className="flex items-center">
            <Image src="/weboldalas-logo.svg" alt="Weboldalas" width={150} height={20} />
          </div>
          <div className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            Árajánlat
          </div>
        </header>

        {/* Status Message */}
        {offer.status === 'accepted' && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium">
            Köszönjük! Ön sikeresen elfogadta ezt az ajánlatot.
          </div>
        )}
        {offer.status === 'rejected' && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center font-medium">
            Ezt az ajánlatot elutasította.
          </div>
        )}
        {offer.status === 'expired' && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-center font-medium">
            Ez az ajánlat már lejárt.
          </div>
        )}

        {/* Offer Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Kedves {targetName}!</h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Az alábbiakban találja az Önnek összeállított árajánlatunkat. Kérjük, tekintse meg a részleteket.
            </p>
          </div>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-white">Tételek részletezése</CardTitle>
                <CardDescription className="text-white/50">Dátum: {new Date(offer.created_at).toLocaleDateString('hu-HU')}</CardDescription>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 text-violet-300 px-4 py-2 rounded-lg text-sm font-medium">
                {paymentText}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.02] text-white/40 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tétel megnevezése</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Ár</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {items?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/80">{item.description}</td>
                        <td className="px-6 py-4 text-white font-medium text-right whitespace-nowrap">
                          {Number(item.price).toLocaleString('hu-HU')} Ft
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white/[0.02] border-t border-white/10">
                    <tr>
                      <td className="px-6 py-6 font-bold text-lg text-white">{paymentLabel}:</td>
                      <td className="px-6 py-6 font-bold text-2xl text-right"
                        style={{ color: 'oklch(0.70 0.22 290)' }}>
                        {Number(offer.total_amount).toLocaleString('hu-HU')} Ft
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {offer.status === 'sent' && (
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <RespondButtons token={token} />
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-white/30 relative z-10 border-t border-white/5 mt-auto">
        &copy; {new Date().getFullYear()} Weboldalas. Minden jog fenntartva.
      </footer>
    </div>
  )
}
