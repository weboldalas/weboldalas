import Link from 'next/link'
import { Plus, FileSignature, FileText, Send, CheckCircle2, XCircle, Archive } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { DeleteContractButton } from './DeleteContractButton'

export const metadata = {
  title: 'Szerződések | Weboldalas Admin',
}

const STATUS_CONFIG = {
  draft:     { label: 'Tervezet',    color: 'oklch(0.60 0.05 270)',  bg: 'oklch(0.60 0.05 270 / 0.10)',  icon: FileText      },
  generated: { label: 'Generálva',   color: 'oklch(0.65 0.18 280)',  bg: 'oklch(0.65 0.18 280 / 0.10)',  icon: FileSignature  },
  sent:      { label: 'Elküldve',    color: 'oklch(0.65 0.12 55)',   bg: 'oklch(0.65 0.12 55 / 0.10)',   icon: Send           },
  signed:    { label: 'Aláírva',     color: 'oklch(0.68 0.18 145)',  bg: 'oklch(0.68 0.18 145 / 0.10)',  icon: CheckCircle2   },
  archived:  { label: 'Archivált',   color: 'oklch(0.55 0.05 270)',  bg: 'oklch(0.55 0.05 270 / 0.10)',  icon: Archive        },
  cancelled: { label: 'Visszavonva', color: 'oklch(0.62 0.22 25)',   bg: 'oklch(0.62 0.22 25 / 0.08)',   icon: XCircle        },
} as const

type StatusKey = keyof typeof STATUS_CONFIG

export default async function ContractsPage() {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from('documents')
    .select('*, customers(name, company_name, is_company), document_templates(name)')
    .eq('type', 'contract')
    .order('created_at', { ascending: false })

  const statuses = Object.keys(STATUS_CONFIG) as StatusKey[]
  const groups = Object.fromEntries(
    statuses.map(s => [s, documents?.filter(d => d.status === s) ?? []])
  ) as Record<StatusKey, typeof documents>

  const signed = groups.signed?.length ?? 0
  const total = (documents?.length ?? 0) - ((groups.cancelled?.length ?? 0) + (groups.archived?.length ?? 0))

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Szerződések</h1>
          <p className="text-white/40 mt-1 text-sm">
            {total} aktív · {signed} aláírt
          </p>
        </div>
        <Link href="/contracts/new">
          <Button size="sm" className="sm:size-default shrink-0">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Szerződés</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statuses.map(key => {
          const cfg = STATUS_CONFIG[key]
          const Icon = cfg.icon
          const count = groups[key]?.length ?? 0
          return (
            <div key={key} className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
              <Icon className="h-4 w-4 shrink-0" style={{ color: cfg.color }} />
              <div>
                <div className="text-xl font-bold text-white">{count}</div>
                <div className="text-xs" style={{ color: cfg.color }}>{cfg.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Document groups */}
      {statuses.map(status => {
        const statusDocs = groups[status]
        if (!statusDocs || statusDocs.length === 0) return null
        const cfg = STATUS_CONFIG[status]
        const Icon = cfg.icon
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4" style={{ color: cfg.color }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                {cfg.label}
              </h2>
              <span className="text-xs rounded-full px-2 py-0.5 font-bold"
                style={{ background: `${cfg.color}20`, color: cfg.color }}>
                {statusDocs.length}
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {statusDocs.map(doc => {
                const customer = doc.customers as { name: string; company_name: string | null; is_company: boolean } | null
                const clientName = customer?.is_company
                  ? (customer.company_name || customer.name)
                  : customer?.name || '—'
                const template = doc.document_templates as { name: string } | null
                const isLocked = !!doc.locked_at
                return (
                  <div key={doc.id} className="rounded-2xl p-4 flex flex-col gap-3 overflow-hidden"
                    style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{doc.title}</div>
                      <div className="text-xs text-white/40 mt-0.5 truncate">{clientName}</div>
                      {template && (
                        <div className="text-xs text-white/25 mt-0.5 truncate">{template.name}</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                      <span className="text-xs text-white/30 truncate">
                        v{doc.current_version} · {new Date(doc.created_at).toLocaleDateString('hu-HU')}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <DeleteContractButton id={doc.id} isLocked={isLocked} />
                        <Link href={`/contracts/${doc.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                            Megnyit →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {(!documents || documents.length === 0) && (
        <div className="text-center py-20 text-white/30">
          <FileSignature className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-4">Még nincs szerződés. Hozz létre egyet!</p>
          <Link href="/contracts/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Új Szerződés</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
