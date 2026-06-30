import Link from 'next/link'
import { Plus, FileSignature, FileText, Printer, PenLine, XCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { CONTRACT_TEMPLATES } from '@/lib/contract-templates'

export const metadata = {
  title: 'Szerződések | Weboldalas Admin',
}

const STATUS_CONFIG = {
  draft:     { label: 'Tervezet',    color: 'oklch(0.60 0.05 270)',  bg: 'oklch(0.60 0.05 270 / 0.10)',  icon: FileText     },
  generated: { label: 'Generálva',   color: 'oklch(0.65 0.18 280)',  bg: 'oklch(0.65 0.18 280 / 0.10)',  icon: FileSignature },
  printed:   { label: 'Nyomtatva',   color: 'oklch(0.65 0.12 55)',   bg: 'oklch(0.65 0.12 55 / 0.10)',   icon: Printer      },
  signed:    { label: 'Aláírva',     color: 'oklch(0.68 0.18 145)',  bg: 'oklch(0.68 0.18 145 / 0.10)',  icon: CheckCircle2 },
  cancelled: { label: 'Visszavonva', color: 'oklch(0.62 0.22 25)',   bg: 'oklch(0.62 0.22 25 / 0.08)',   icon: XCircle      },
} as const

export default async function ContractsPage() {
  const supabase = await createClient()

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, customers(name, email)')
    .order('created_at', { ascending: false })

  const groups = {
    draft:     contracts?.filter(c => c.status === 'draft')     ?? [],
    generated: contracts?.filter(c => c.status === 'generated') ?? [],
    printed:   contracts?.filter(c => c.status === 'printed')   ?? [],
    signed:    contracts?.filter(c => c.status === 'signed')    ?? [],
    cancelled: contracts?.filter(c => c.status === 'cancelled') ?? [],
  }

  const signed = groups.signed.length
  const active = (contracts?.length ?? 0) - (groups.cancelled.length)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Szerződések</h1>
          <p className="text-white/40 mt-1 text-sm">
            {active} aktív · {signed} aláírt szerződés
          </p>
        </div>
        <Link href="/contracts/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Új Szerződés</Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => {
          const Icon = cfg.icon
          const count = groups[key as keyof typeof groups]?.length ?? 0
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

      {/* Contract groups */}
      {(Object.entries(groups) as [string, typeof contracts][]).map(([status, statusContracts]) => {
        if (!statusContracts || statusContracts.length === 0) return null
        const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
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
                {statusContracts.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {statusContracts.map(contract => {
                const template = CONTRACT_TEMPLATES.find(t => t.id === contract.template_id)
                return (
                  <div key={contract.id} className="rounded-2xl p-4 flex flex-col gap-3 group"
                    style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{contract.title}</div>
                        <div className="text-xs text-white/40 truncate">
                          {contract.customers?.name || '—'}
                        </div>
                        {template && (
                          <div className="text-xs text-white/30 mt-0.5 truncate">{template.label}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-white/30">
                        {new Date(contract.created_at).toLocaleDateString('hu-HU')}
                        {contract.signed_at && ` · Aláírva: ${new Date(contract.signed_at).toLocaleDateString('hu-HU')}`}
                      </span>
                      <Link href={`/contracts/${contract.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Megnyit →
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {(!contracts || contracts.length === 0) && (
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
