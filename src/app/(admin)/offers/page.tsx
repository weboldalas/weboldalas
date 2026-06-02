import Link from 'next/link'
import { Plus, Send, FileText, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { DeleteOfferIconButton } from './DeleteOfferIconButton'

export const metadata = {
  title: 'Ajánlatok | Weboldalas Admin',
}

const STATUS_CONFIG = {
  draft:    { label: 'Tervezet',   color: 'oklch(0.60 0.05 270)', bg: 'oklch(0.60 0.05 270 / 0.10)', icon: FileText  },
  sent:     { label: 'Kiküldve',   color: 'oklch(0.65 0.18 280)', bg: 'oklch(0.65 0.18 280 / 0.10)', icon: Send      },
  accepted: { label: 'Elfogadva',  color: 'oklch(0.68 0.18 145)', bg: 'oklch(0.68 0.18 145 / 0.10)', icon: CheckCircle },
  rejected: { label: 'Elutasítva', color: 'oklch(0.62 0.22 25)',  bg: 'oklch(0.62 0.22 25 / 0.08)',  icon: XCircle   },
} as const

const PAYMENT_LABELS: Record<string, string> = {
  one_time:      'Egyösszegű',
  installments:  'Részletfizetés',
  subscription:  'Előfizetés',
}

export default async function OffersPage() {
  const supabase = await createClient()

  const { data: offers } = await supabase
    .from('offers')
    .select('*, customers(name, email), leads(name, email)')
    .order('created_at', { ascending: false })

  const groups = {
    sent:     offers?.filter(o => o.status === 'sent')     ?? [],
    draft:    offers?.filter(o => o.status === 'draft')    ?? [],
    accepted: offers?.filter(o => o.status === 'accepted') ?? [],
    rejected: offers?.filter(o => o.status === 'rejected') ?? [],
  }

  const totalValue = (offers ?? []).reduce((s, o) => s + Number(o.total_amount), 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ajánlatok</h1>
          <p className="text-white/40 mt-1 text-sm">
            {offers?.length ?? 0} ajánlat · {totalValue.toLocaleString('hu-HU')} Ft összérték
          </p>
        </div>
        <Link href="/offers/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Új Ajánlat</Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

      {/* Offer groups */}
      {(Object.entries(groups) as [string, typeof offers][]).map(([status, statusOffers]) => {
        if (!statusOffers || statusOffers.length === 0) return null
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
                {statusOffers.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {statusOffers.map(offer => {
                const name = offer.customers?.name || offer.leads?.name || '—'
                const email = offer.customers?.email || offer.leads?.email || ''
                const isLead = !offer.customer_id && !!offer.lead_id
                return (
                  <div key={offer.id} className="rounded-2xl p-4 flex flex-col gap-3 group"
                    style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{name}</div>
                        {email && <div className="text-xs text-white/40 truncate">{email}</div>}
                        {isLead && (
                          <span className="text-xs text-violet-400/80 mt-0.5 inline-block">Érdeklődő</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <DeleteOfferIconButton id={offer.id} />
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">
                        {Number(offer.total_amount).toLocaleString('hu-HU')}
                      </span>
                      <span className="text-sm text-white/40">Ft</span>
                      {offer.payment_type && offer.payment_type !== 'one_time' && (
                        <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                          style={{ background: 'oklch(0.65 0.18 280 / 0.12)', color: 'oklch(0.70 0.18 280)' }}>
                          {PAYMENT_LABELS[offer.payment_type] || offer.payment_type}
                          {offer.payment_type === 'installments' && offer.installment_months ? ` · ${offer.installment_months} hó` : ''}
                        </span>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-white/30">
                        {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                        {offer.sent_at && ` · Küldve: ${new Date(offer.sent_at).toLocaleDateString('hu-HU')}`}
                      </span>
                      <Link href={`/offers/${offer.id}`}>
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

      {(!offers || offers.length === 0) && (
        <div className="text-center py-20 text-white/30">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Még nincs ajánlat. Hozz létre egyet!</p>
        </div>
      )}
    </div>
  )
}
