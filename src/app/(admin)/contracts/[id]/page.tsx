import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { CONTRACT_TEMPLATES } from '@/lib/contract-templates'
import { ContractEditor } from './ContractEditor'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('contracts').select('title').eq('id', id).single()
  return { title: `${data?.title ?? 'Szerződés'} | Weboldalas Admin` }
}

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: contract } = await supabase
    .from('contracts')
    .select('*, customers(id, name, email, phone)')
    .eq('id', id)
    .single()

  if (!contract) notFound()

  const template = CONTRACT_TEMPLATES.find(t => t.id === contract.template_id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/contracts">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{contract.title}</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {contract.customers?.name && <span>{contract.customers.name} · </span>}
            {template?.label ?? contract.template_id} ·{' '}
            {new Date(contract.created_at).toLocaleDateString('hu-HU')}
          </p>
        </div>
      </div>

      <ContractEditor contract={contract} />
    </div>
  )
}
