'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type View = 'heti' | 'havi' | 'eves'

interface Payment {
  amount: string | number
  payment_date: string
}

interface Props {
  payments: Payment[]
  mrr: number
  activeSubscriptions: number
  projectRevenue: number
}

const HU_DAYS: Record<number, string> = { 0: 'V', 1: 'H', 2: 'K', 3: 'Sze', 4: 'Cs', 5: 'P', 6: 'Szo' }
const HU_MONTHS = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sze', 'Okt', 'Nov', 'Dec']

function isoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

function fmtK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${Math.round(v / 1_000)}e`
  return String(v)
}

function fmtFt(v: number) {
  return v.toLocaleString('hu-HU') + ' Ft'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'oklch(0.13 0.02 250)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 160,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginBottom: 8 }}>{label}</p>
      {payload.map((e: { dataKey: string; color: string; value: number }) => (
        <div key={e.dataKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
              {e.dataKey === 'current' ? 'Aktuális' : 'Előző'}
            </span>
          </div>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{fmtFt(e.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ payments, mrr, activeSubscriptions, projectRevenue }: Props) {
  const [view, setView] = useState<View>('havi')
  const [comparison, setComparison] = useState(false)

  const now = useMemo(() => new Date(), [])

  const paidData = useMemo(
    () => payments.map(p => ({ date: new Date(p.payment_date), amount: Number(p.amount) })),
    [payments]
  )

  const chartData = useMemo(() => {
    if (view === 'heti') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now)
        d.setDate(now.getDate() - 6 + i)
        const ds = isoDate(d)
        const pd = new Date(d); pd.setDate(pd.getDate() - 7)
        const pds = isoDate(pd)
        const current = paidData.filter(p => isoDate(p.date) === ds).reduce((s, p) => s + p.amount, 0)
        const previous = paidData.filter(p => isoDate(p.date) === pds).reduce((s, p) => s + p.amount, 0)
        return { label: HU_DAYS[d.getDay()], current, previous, isNow: ds === isoDate(now) }
      })
    }
    if (view === 'havi') {
      const year = now.getFullYear()
      return Array.from({ length: 12 }, (_, m) => {
        const current = paidData
          .filter(p => p.date.getFullYear() === year && p.date.getMonth() === m)
          .reduce((s, p) => s + p.amount, 0)
        const previous = paidData
          .filter(p => p.date.getFullYear() === year - 1 && p.date.getMonth() === m)
          .reduce((s, p) => s + p.amount, 0)
        return { label: HU_MONTHS[m], current, previous, isNow: m === now.getMonth() }
      })
    }
    // eves
    const curYear = now.getFullYear()
    return Array.from({ length: 5 }, (_, i) => {
      const year = curYear - 4 + i
      const current = paidData.filter(p => p.date.getFullYear() === year).reduce((s, p) => s + p.amount, 0)
      const previous = paidData.filter(p => p.date.getFullYear() === year - 1).reduce((s, p) => s + p.amount, 0)
      return { label: String(year), current, previous, isNow: year === curYear }
    })
  }, [view, paidData, now])

  const currentTotal = chartData.reduce((s, d) => s + d.current, 0)
  const prevTotal = chartData.reduce((s, d) => s + d.previous, 0)
  const changePct = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : null

  const viewLabel =
    view === 'heti' ? 'ezen a héten' :
    view === 'havi' ? `${now.getFullYear()}-ben` :
    'az elmúlt 5 évben'

  const periodLabels = {
    current: view === 'heti' ? 'Ezen a héten' : view === 'havi' ? `${now.getFullYear()}` : 'Aktuális',
    previous: view === 'heti' ? 'Múlt héten' : view === 'havi' ? `${now.getFullYear() - 1}` : 'Előző',
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 pb-0">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            Befizetések {viewLabel}
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {fmtFt(currentTotal)}
            </span>
            {comparison && changePct !== null && (
              <span className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: changePct > 0 ? 'oklch(0.72 0.18 145)' : changePct < 0 ? 'oklch(0.72 0.18 25)' : 'rgba(255,255,255,0.4)' }}>
                {changePct > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : changePct < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                {Math.abs(changePct).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30 flex-wrap">
            <span>MRR: {fmtFt(mrr)} · {activeSubscriptions} előfizetés</span>
            {projectRevenue > 0 && <span>· Projektek e hónapban: {fmtFt(projectRevenue)}</span>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-lg overflow-hidden p-0.5"
            style={{ background: 'oklch(1 0 0 / 0.06)' }}>
            {(['heti', 'havi', 'eves'] as View[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150"
                style={view === v
                  ? { background: '#0ea5e9', color: 'white' }
                  : { color: 'rgba(255,255,255,0.38)', background: 'transparent' }
                }
              >
                {v === 'heti' ? 'Heti' : v === 'havi' ? 'Havi' : 'Éves'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setComparison(c => !c)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150"
            style={comparison
              ? { background: 'rgba(139,92,246,0.18)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.32)' }
              : { background: 'oklch(1 0 0 / 0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }
            }
          >
            Összehasonlítás
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-1 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            barGap={4}
            barCategoryGap="28%"
            margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtK}
              width={38}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 } as React.SVGProps<SVGRectElement>}
            />
            <Bar dataKey="current" radius={[4, 4, 0, 0]} maxBarSize={40} name="current">
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isNow ? '#38bdf8' : '#0ea5e9'}
                />
              ))}
            </Bar>
            {comparison && (
              <Bar
                dataKey="previous"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                fill="rgba(139,92,246,0.22)"
                name="previous"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {comparison && (
        <div className="flex items-center justify-center gap-6 pb-4 text-xs text-white/35">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#0ea5e9' }} />
            {periodLabels.current}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(139,92,246,0.40)' }} />
            {periodLabels.previous}
          </div>
        </div>
      )}
    </div>
  )
}
