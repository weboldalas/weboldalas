'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthPoint } from '@/lib/crm/finance'
import { formatMoney, formatMonth } from '@/lib/crm/format'

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('hu-HU', { maximumFractionDigits: 1 })} M`
  if (value >= 1000) return `${Math.round(value / 1000)} e`
  return String(value)
}

type TooltipProps = { active?: boolean; payload?: { payload: MonthPoint }[] }
function ChartTooltip({ active, payload }: TooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="crm-chart-tooltip">
      <strong>{formatMonth(point.month, 'long')}</strong>
      <p><span>Fix (havidíj)</span><b>{formatMoney(point.recurring)}</b></p>
      <p><span>Eseti</span><b>{formatMoney(point.oneOff)}</b></p>
      <p style={{ borderTop: '1px solid var(--line)', paddingTop: 6, marginTop: 6 }}><span>Összesen</span><b>{formatMoney(point.recurring + point.oneOff)}</b></p>
    </div>
  )
}

export function RevenueChart({ data }: { data: MonthPoint[] }) {
  const [range, setRange] = useState<6 | 12>(12)
  const shown = data.slice(-range)
  const total = shown.reduce((sum, p) => sum + p.recurring + p.oneOff, 0)
  const recurring = shown.reduce((sum, p) => sum + p.recurring, 0)
  const hasData = total > 0

  return (
    <section className="crm-card" aria-labelledby="revenue-title">
      <div className="crm-card-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h2 id="revenue-title">Befolyt bevétel</h2>
          <p>Az utolsó {range} hónap: {formatMoney(total)}, ebből fix {total ? Math.round((recurring / total) * 100) : 0}%.</p>
        </div>
        <div className="crm-segmented" role="group" aria-label="Időszak">
          <button type="button" className={range === 6 ? 'is-active' : ''} onClick={() => setRange(6)} aria-pressed={range === 6}>6 hó</button>
          <button type="button" className={range === 12 ? 'is-active' : ''} onClick={() => setRange(12)} aria-pressed={range === 12}>12 hó</button>
        </div>
      </div>
      <div className="crm-chart" style={{ height: 280 }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shown} margin={{ top: 16, right: 12, left: 4, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="month" tickFormatter={m => formatMonth(m)} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
              <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
              <Bar dataKey="recurring" name="Fix" stackId="a" fill="var(--chart-recurring)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="oneOff" name="Eseti" stackId="a" fill="var(--chart-oneoff)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="crm-empty" style={{ height: '100%', justifyContent: 'center' }}>
            <strong>Még nincs rögzített befizetés</strong>
            <p>Ha egy számlát fizetettnek jelölsz, itt havonta látod a fix és az eseti bevételt.</p>
          </div>
        )}
      </div>
      <div className="crm-chart-legend" style={{ padding: '4px 20px 18px' }}>
        <span><i style={{ background: 'var(--chart-recurring)' }} />Fix havidíj</span>
        <span><i style={{ background: 'var(--chart-oneoff)' }} />Eseti bevétel</span>
      </div>
    </section>
  )
}
