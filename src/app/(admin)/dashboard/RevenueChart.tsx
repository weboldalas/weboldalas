'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

type View = 'havi' | 'eves'

interface Payment {
  amount: string | number
  payment_date: string | null
  due_date: string | null
  status: string
}

interface Props {
  payments: Payment[]
  mrr: number
  activeSubscriptions: number
  projectRevenue: number
}

const HU_MONTHS = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sze', 'Okt', 'Nov', 'Dec']

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
  const mrr = payload.find((p: { dataKey: string }) => p.dataKey === 'mrr')?.value ?? 0
  const projects = payload.find((p: { dataKey: string }) => p.dataKey === 'projects')?.value ?? 0
  const total = mrr + projects
  return (
    <div style={{
      background: 'oklch(0.13 0.02 250)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 180,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {mrr > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#0ea5e9', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Előfizetések</span>
          </div>
          <span style={{ color: '#0ea5e9', fontSize: 12, fontWeight: 600 }}>{fmtFt(mrr)}</span>
        </div>
      )}
      {projects > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#a855f7', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Projektek</span>
          </div>
          <span style={{ color: '#a855f7', fontSize: 12, fontWeight: 600 }}>{fmtFt(projects)}</span>
        </div>
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>Összesen</span>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{fmtFt(total)}</span>
      </div>
    </div>
  )
}

function PrivateValue({ value, hidden, className }: { value: string; hidden: boolean; className?: string }) {
  return (
    <span
      className={className}
      style={{
        filter: hidden ? 'blur(8px)' : 'none',
        transition: 'filter 0.25s ease',
        userSelect: hidden ? 'none' : 'auto',
        display: 'inline-block',
      }}
    >
      {value}
    </span>
  )
}

export function RevenueChart({ payments, mrr, activeSubscriptions, projectRevenue }: Props) {
  const [view, setView] = useState<View>('havi')
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const stored = localStorage.getItem('revenue-privacy')
    if (stored !== null) setHidden(stored === 'true')
  }, [])

  function toggleHidden() {
    const next = !hidden
    setHidden(next)
    localStorage.setItem('revenue-privacy', String(next))
  }

  const now = useMemo(() => new Date(), [])

  // Minden befizetés dátummal
  const paidData = useMemo(() =>
    payments.map(p => {
      const dateStr = p.payment_date ?? p.due_date
      if (!dateStr) return null
      return { date: new Date(dateStr), amount: Number(p.amount) }
    }).filter((p): p is { date: Date; amount: number } => p !== null),
    [payments]
  )

  const chartData = useMemo(() => {
    if (view === 'havi') {
      // -3 múlt hónap + aktuális + +8 jövő hónap = 12 total
      return Array.from({ length: 12 }, (_, i) => {
        const offset = i - 3
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
        const y = d.getFullYear()
        const m = d.getMonth()

        const isCurrent = offset === 0
        const isFuture = offset > 0

        const projects = paidData
          .filter(p => p.date.getFullYear() === y && p.date.getMonth() === m)
          .reduce((s, p) => s + p.amount, 0)

        // Jövő hónapokra MRR-t mutatunk, de projektek is láthatók ha van ütemezett fizetés
        const mrrValue = mrr
        const label = HU_MONTHS[m] + (y !== now.getFullYear() ? ` '${String(y).slice(2)}` : '')

        return { label, mrr: mrrValue, projects, isCurrent, isFuture, offset }
      })
    }

    // Éves nézet: 5 év
    const curYear = now.getFullYear()
    return Array.from({ length: 5 }, (_, i) => {
      const year = curYear - 4 + i
      const isCurrent = year === curYear
      const isFuture = year > curYear

      const projects = paidData
        .filter(p => p.date.getFullYear() === year)
        .reduce((s, p) => s + p.amount, 0)

      const mrrAnnual = mrr * 12

      return { label: String(year), mrr: mrrAnnual, projects, isCurrent, isFuture, offset: year - curYear }
    })
  }, [view, paidData, mrr, now])

  const currentData = chartData.find(d => d.isCurrent)
  const currentTotal = (currentData?.mrr ?? 0) + (currentData?.projects ?? 0)
  const prevData = chartData.find(d => d.offset === -1)
  const prevTotal = (prevData?.mrr ?? 0) + (prevData?.projects ?? 0)
  const changePct = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : null

  if (!mounted) {
    return (
      <div className="rounded-2xl h-72 animate-pulse"
        style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }} />
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.08)' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 pb-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" />
            {view === 'havi' ? 'Várható bevétel — havi bontás' : 'Éves összesítő'}
            <button
              onClick={toggleHidden}
              className="ml-1 p-0.5 rounded transition-colors hover:text-white/70"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              title={hidden ? 'Összegek megjelenítése' : 'Összegek elrejtése'}
            >
              {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              <PrivateValue value={fmtFt(currentTotal)} hidden={hidden} />
            </span>
            <span className="text-xs text-white/40">ebben a hónapban</span>
            {changePct !== null && (
              <span className="text-sm font-semibold" style={{
                filter: hidden ? 'blur(6px)' : 'none',
                transition: 'filter 0.25s ease',
                color: changePct > 0 ? 'oklch(0.72 0.18 145)' : changePct < 0 ? 'oklch(0.72 0.18 25)' : 'rgba(255,255,255,0.4)'
              }}>
                {changePct > 0 ? '↑' : '↓'} {Math.abs(changePct).toFixed(1)}% az előző hónaphoz képest
              </span>
            )}
          </div>
          {/* MRR + projekt breakdown */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: '#0ea5e9' }} />
              <span className="text-xs text-white/40">Előfizetések: <PrivateValue value={fmtFt(mrr)} hidden={hidden} className="text-white/70 font-medium" /></span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: '#a855f7' }} />
              <span className="text-xs text-white/40">Projektek: <PrivateValue value={fmtFt(projectRevenue)} hidden={hidden} className="text-white/70 font-medium" /></span>
            </div>
            <span className="text-xs text-white/25">{activeSubscriptions} aktív előfizetés</span>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden p-0.5 shrink-0"
          style={{ background: 'oklch(1 0 0 / 0.06)', alignSelf: 'flex-start' }}>
          {(['havi', 'eves'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-150"
              style={view === v
                ? { background: '#0ea5e9', color: 'white' }
                : { color: 'rgba(255,255,255,0.38)', background: 'transparent' }
              }
            >
              {v === 'havi' ? 'Havi' : 'Éves'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-1 pt-3 pb-3" style={{ filter: hidden ? 'blur(6px)' : 'none', transition: 'filter 0.25s ease' }}>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={chartData}
            barCategoryGap="28%"
            margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={(props) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const entry = chartData[props.index] as any
                const color = entry?.isCurrent
                  ? 'rgba(255,255,255,0.85)'
                  : entry?.isFuture
                    ? 'rgba(255,255,255,0.30)'
                    : 'rgba(255,255,255,0.38)'
                return (
                  <text x={props.x} y={Number(props.y) + 10} textAnchor="middle" fontSize={11} fill={color}>
                    {props.payload.value}
                  </text>
                )
              }}
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
            {/* MRR — előfizetések (cián, alul) */}
            <Bar dataKey="mrr" stackId="a" name="Előfizetések" maxBarSize={44} radius={[0, 0, 4, 4]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill="#0ea5e9"
                  fillOpacity={entry.isFuture ? 0.35 : entry.isCurrent ? 1 : 0.65}
                />
              ))}
            </Bar>
            {/* Projektek — egyszeri (lila, felül) */}
            <Bar dataKey="projects" stackId="a" name="Projektek" maxBarSize={44} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill="#a855f7"
                  fillOpacity={entry.isFuture ? 0.3 : entry.isCurrent ? 1 : 0.6}
                />
              ))}
            </Bar>
            {/* Jelző vonal az aktuális hónap MRR szintjén */}
            {mrr > 0 && (
              <ReferenceLine
                y={mrr}
                stroke="rgba(14,165,233,0.3)"
                strokeDasharray="4 4"
                label={{ value: 'MRR alap', position: 'insideTopRight', fill: 'rgba(14,165,233,0.45)', fontSize: 10 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Jelmagyarázat */}
      <div className="flex items-center justify-center gap-6 pb-4 text-xs text-white/35">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#0ea5e9' }} />
          Előfizetések (MRR)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#a855f7' }} />
          Projektek / Egyszeri
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 border-t border-dashed" style={{ borderColor: 'rgba(14,165,233,0.4)' }} />
          MRR alap
        </div>
      </div>
    </div>
  )
}
