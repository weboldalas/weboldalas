'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Eye, EyeOff, TrendingUp } from 'lucide-react'

type View = 'havi' | 'eves'
interface Payment { amount: string | number; payment_date: string | null; due_date: string | null; status: string }
interface Props { payments: Payment[]; mrr: number; activeSubscriptions: number; projectRevenue: number }
const months = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sze', 'Okt', 'Nov', 'Dec']
function formatMoney(value: number) { return `${value.toLocaleString('hu-HU')} Ft` }
function formatAxis(value: number) { return value >= 1000000 ? `${(value / 1000000).toFixed(1)} M` : value >= 1000 ? `${Math.round(value / 1000)} e` : `${value}` }
function subscribePrivacy(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('revenue-privacy-changed', callback)
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('revenue-privacy-changed', callback) }
}
function privacySnapshot() { try { return localStorage.getItem('revenue-privacy') !== 'false' } catch { return true } }
const noSubscribe = () => () => {}

function ChartTooltip({active, payload, label}: {active?: boolean; payload?: readonly {dataKey?: string | number; value?: number | string}[]; label?: string | number}) {
  if (!active || !payload?.length) return null
  const base = Number(payload.find(item => item.dataKey === 'mrr')?.value ?? 0)
  const payments = Number(payload.find(item => item.dataKey === 'projects')?.value ?? 0)
  return <div className="admin-chart-tooltip"><strong>{label}</strong><p>Aktuális havidíjak alapján <span>{formatMoney(base)}</span></p><p>Befizetési tételek <span>{formatMoney(payments)}</span></p><p>Összesen <span>{formatMoney(base + payments)}</span></p></div>
}

export function RevenueChart({ payments, mrr, activeSubscriptions, projectRevenue }: Props) {
  const [view, setView] = useState<View>('havi')
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false)
  const hidden = useSyncExternalStore(subscribePrivacy, privacySnapshot, () => true)
  const now = useMemo(() => new Date(), [])
  const data = useMemo(() => {
    const datedPayments = payments.flatMap(payment => {
      const date = payment.payment_date ?? payment.due_date
      if (!date) return []
      const parts = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Budapest'}).format(new Date(date)).split('-')
      return [{year:Number(parts[0]), month:Number(parts[1])-1, amount:Number(payment.amount)}]
    })
    const nowParts = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Budapest'}).format(now).split('-')
    const currentYear = Number(nowParts[0])
    const currentMonth = Number(nowParts[1])-1
    return Array.from({length:view === 'havi' ? 12 : 5}, (_, index) => {
      const offset = view === 'havi' ? index - 3 : index - 4
      const date = new Date(Date.UTC(currentYear, currentMonth + (view === 'havi' ? offset : 0), 1))
      const year = view === 'havi' ? date.getUTCFullYear() : currentYear + offset
      const month = date.getUTCMonth()
      const projects = datedPayments.filter(payment => payment.year === year && (view === 'eves' || payment.month === month)).reduce((sum, payment) => sum + payment.amount, 0)
      return {label:view === 'havi' ? `${months[month]}${year !== currentYear ? ` '${String(year).slice(2)}` : ''}` : `${year}`, mrr:view === 'havi' ? mrr : mrr * 12, projects, isCurrent:offset === 0, isFuture:offset > 0}
    })
  }, [payments, mrr, view, now])
  const current = data.find(item => item.isCurrent)
  const total = (current?.mrr ?? 0) + (current?.projects ?? 0)
  function togglePrivacy() {
    try { localStorage.setItem('revenue-privacy', String(!hidden)); window.dispatchEvent(new Event('revenue-privacy-changed')) } catch { /* Keep values hidden when storage is unavailable. */ }
  }

  return <div className="admin-revenue-chart">
    <div className="admin-chart-header"><div><p><TrendingUp size={14} />{view === 'havi' ? 'Havi bevételi terv' : 'Éves bevételi terv'}</p><strong>{hidden ? '••• ••• Ft' : formatMoney(total)}</strong><span>{view === 'havi' ? 'az aktuális hónapra' : 'az aktuális évre'}</span></div><button type="button" onClick={togglePrivacy} className="admin-chart-privacy" aria-label={hidden ? 'Összegek megjelenítése' : 'Összegek elrejtése'} aria-pressed={!hidden} title={hidden ? 'Összegek megjelenítése' : 'Összegek elrejtése'}>{hidden ? <Eye size={18} /> : <EyeOff size={18} />}</button></div>
    <div className="admin-chart-breakdown"><span><i style={{background:'#8f9aff'}} />Havidíjak: <strong>{hidden ? '••• Ft' : formatMoney(mrr)}</strong></span><span><i style={{background:'#69b9b0'}} />Havi tételek: <strong>{hidden ? '••• Ft' : formatMoney(projectRevenue)}</strong></span></div>
    <div className="admin-chart-toolbar"><span>{activeSubscriptions} aktív HUF-előfizetés</span><div role="group" aria-label="Grafikon időszaka">{(['havi','eves'] as const).map(option => <button type="button" key={option} onClick={() => setView(option)} aria-pressed={view === option} className={view === option ? 'is-active' : ''}>{option === 'havi' ? 'Havi' : 'Éves'}</button>)}</div></div>
    <div className="admin-chart-area">
      {!mounted ? <div className="admin-chart-placeholder" role="status">Grafikon betöltése…</div> : hidden ? <div className="admin-chart-placeholder"><EyeOff size={25} /><p>A pénzügyi összegek el vannak rejtve.</p><button type="button" onClick={togglePrivacy}>Összegek és grafikon megjelenítése</button></div> : <ResponsiveContainer width="100%" height={210}><BarChart data={data} barCategoryGap="28%" margin={{top:8,right:8,bottom:0,left:0}} accessibilityLayer><CartesianGrid vertical={false} stroke="#ffffff08" /><XAxis dataKey="label" tick={{fill:'#a5b2c9',fontSize:10}} axisLine={false} tickLine={false} /><YAxis tick={{fill:'#97a8c3',fontSize:10}} tickFormatter={formatAxis} width={43} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} cursor={{fill:'#ffffff05'}} /><Bar dataKey="mrr" name="Aktuális havidíjak alapján" stackId="a" maxBarSize={34} radius={[0,0,3,3]}>{data.map(item => <Cell key={item.label} fill="#8f9aff" fillOpacity={item.isFuture ? .35 : item.isCurrent ? 1 : .65} />)}</Bar><Bar dataKey="projects" name="Befizetési tételek" stackId="a" maxBarSize={34} radius={[3,3,0,0]}>{data.map(item => <Cell key={item.label} fill="#69b9b0" fillOpacity={item.isFuture ? .35 : item.isCurrent ? 1 : .65} />)}</Bar></BarChart></ResponsiveContainer>}
    </div>
    <p className="admin-chart-disclaimer">Tervezési nézet: az aktuális előfizetési díjakat és a rögzített befizetési tételeket mutatja. A havidíj minden időszakban a jelenlegi állománnyal számol; az összeg nem könyvelt bevétel.</p>
  </div>
}
