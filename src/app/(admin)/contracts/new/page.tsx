import { createClient } from '@/utils/supabase/server'
import { ContractWizard } from './ContractWizard'

export const metadata = {
  title: 'Új Szerződés | Weboldalas Admin',
}

export default async function NewContractPage() {
  const supabase = await createClient()

  const [{ data: customers }, { data: offers }] = await Promise.all([
    supabase.from('customers').select('id, name, email, phone').order('name'),
    supabase
      .from('offers')
      .select('id, total_amount, customers(name), leads(name)')
      .in('status', ['accepted', 'draft', 'sent'])
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Új Szerződés</h1>
        <p className="text-white/40 mt-1 text-sm">Lépések: Ügyfél → Sablon → Szerkesztés → Mentés</p>
      </div>
      <ContractWizard
        customers={customers || []}
        offers={(offers || []).map(o => ({
          id: o.id,
          total_amount: o.total_amount,
          label: (o.customers as unknown as { name: string } | null)?.name ||
                 (o.leads as unknown as { name: string } | null)?.name ||
                 'Névtelen',
        }))}
      />
    </div>
  )
}
