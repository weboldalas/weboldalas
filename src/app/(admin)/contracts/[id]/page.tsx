import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { DocumentEditor } from './DocumentEditor'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('documents').select('title').eq('id', id).single()
  return { title: `${data?.title ?? 'Szerződés'} | Weboldalas Admin` }
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: document },
    { data: companySettings },
  ] = await Promise.all([
    supabase
      .from('documents')
      .select('*, customers(*), document_templates(name, description)')
      .eq('id', id)
      .single(),
    supabase.from('company_settings').select('*').limit(1).single(),
  ])

  if (!document) notFound()

  // Fetch all versions + activity
  const [{ data: versions }, { data: activity }] = await Promise.all([
    supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', id)
      .order('version', { ascending: false }),
    supabase
      .from('document_activity')
      .select('*')
      .eq('document_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const latestVersion = versions?.[0] ?? null
  const template = document.document_templates as { name: string; description: string | null } | null

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start gap-3 shrink-0">
        <Link href="/contracts">
          <Button variant="ghost" size="icon-sm" className="mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">{document.title}</h1>
          <p className="text-white/40 text-xs mt-0.5">
            {(document.customers as { name: string; company_name: string | null; is_company: boolean } | null)?.company_name ||
             (document.customers as { name: string } | null)?.name || '—'}
            {template ? ` · ${template.name}` : ''}
            {' · '}v{document.current_version}
            {' · '}{new Date(document.created_at).toLocaleDateString('hu-HU')}
          </p>
        </div>
      </div>

      <DocumentEditor
        document={document}
        latestVersion={latestVersion}
        versions={versions || []}
        activity={activity || []}
        companySettings={companySettings}
      />
    </div>
  )
}
