'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, FileJson, Loader2, Paperclip, Upload } from 'lucide-react'
import { PerfexFilesStep } from './PerfexFilesStep'
import { toast } from 'sonner'

type Partner = { perfexId: number; name: string; active: boolean; contacts: number; projects: string[]; tasks: number; openTasks: number }
type Counts = { partners: number; contacts: number; projects: number; tasks: number; comments: number; files: number }

const NEEDED = ['clients', 'contacts', 'projects', 'tasks', 'task_comments', 'staff', 'files']

export function PerfexImport() {
  const [tables, setTables] = useState<unknown[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [partners, setPartners] = useState<Partner[]>([])
  const [skip, setSkip] = useState<number[]>([])
  const [counts, setCounts] = useState<Counts | null>(null)
  const [result, setResult] = useState<{ counts: Counts; log: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [alreadyImported, setAlreadyImported] = useState(false)
  const [pending, startTransition] = useTransition()

  async function call(payload: { tables: unknown[]; skip: number[]; write: boolean }) {
    const res = await fetch('/api/import/perfex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json().catch(() => ({ error: 'Váratlan válasz a szervertől.' }))
    if (!res.ok || json.error) throw new Error(json.error || 'Hiba történt.')
    return json
  }

  function onFile(file: File) {
    setError(null); setResult(null); setCounts(null); setPartners([]); setSkip([])
    if (!file.name.toLowerCase().endsWith('.json')) { setError('JSON fájlt válassz. Ha .zip-et töltöttél le, előbb csomagold ki.'); return }
    startTransition(async () => {
      try {
        const raw = JSON.parse(await file.text())
        // Send only the tables the import uses; a full Perfex export is mostly logs and settings.
        const kept = (Array.isArray(raw) ? raw : []).filter((e: { type?: string; name?: string }) => e?.type === 'table' && NEEDED.some(n => String(e.name).endsWith(n)))
        const preview = await call({ tables: kept, skip: [], write: false })
        setTables(kept); setFileName(file.name); setPartners(preview.partners); setCounts(preview.counts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'A fájl nem olvasható.')
      }
    })
  }

  function refresh(nextSkip: number[]) {
    setSkip(nextSkip)
    if (!tables) return
    startTransition(async () => {
      try { setCounts((await call({ tables, skip: nextSkip, write: false })).counts) } catch (err) { setError(err instanceof Error ? err.message : 'Hiba') }
    })
  }

  function runImport() {
    if (!tables || !counts) return
    if (!window.confirm(`Importálod: ${counts.partners} partner, ${counts.projects} projekt, ${counts.tasks} feladat?`)) return
    startTransition(async () => {
      try {
        const json = await call({ tables, skip, write: true })
        setResult({ counts: json.counts, log: json.log })
        toast.success('Perfex import kész')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Az import nem sikerült.')
      }
    })
  }

  return (
    <div className="crm-grid">
      <section className="crm-card crm-card-pad">
        <h2 className="crm-section-title mb-1">1. Export feltöltése</h2>
        <p className="mb-4 text-[13px]" style={{ color: 'var(--text-3)' }}>Hostinger → phpMyAdmin → Perfex adatbázis → Export → Custom → Format: JSON. A teljes adatbázis exportja is jó, csak a szükséges táblákat használom.</p>
        <label className="crm-btn crm-btn-secondary" style={{ cursor: 'pointer' }}>
          {pending && !counts ? <Loader2 className="animate-spin" /> : <Upload />} {fileName ? 'Másik fájl' : 'JSON fájl kiválasztása'}
          <input type="file" accept=".json,application/json" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
        </label>
        {fileName && <span className="ml-3 inline-flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-2)' }}><FileJson size={15} />{fileName}</span>}
      </section>

      {error && <div className="crm-alert is-danger" role="alert"><AlertTriangle />{error}</div>}

      {partners.length > 0 && !result && (
        <section className="crm-card">
          <div className="crm-card-pad" style={{ paddingBottom: 8 }}>
            <h2 className="crm-section-title">2. Mi kerüljön át?</h2>
            <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>Vedd ki a pipát a teszt- vagy már nem kellő partnereknél. A projektjeik és feladataik is kimaradnak.</p>
          </div>
          <div className="crm-list">
            {partners.map(p => {
              const on = !skip.includes(p.perfexId)
              return (
                <label key={p.perfexId} className="crm-row" style={{ cursor: 'pointer', opacity: on ? 1 : 0.5 }}>
                  <input type="checkbox" checked={on} disabled={pending} onChange={() => refresh(on ? [...skip, p.perfexId] : skip.filter(id => id !== p.perfexId))} style={{ width: 18, height: 18, accentColor: 'var(--brand)' }} />
                  <span className="crm-row-main">
                    <strong>{p.name}{!p.active && ' (inaktív)'}</strong>
                    <span>{p.contacts} kapcsolattartó · {p.projects.length ? p.projects.join(', ') : 'nincs projekt'}</span>
                  </span>
                  <span className="crm-row-end"><strong>{p.tasks} feladat</strong><span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{p.openTasks} nyitott</span></span>
                </label>
              )
            })}
          </div>
          {counts && (
            <div className="crm-card-pad flex flex-wrap items-center justify-between gap-3" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{counts.partners} partner · {counts.contacts} kapcsolattartó · {counts.projects} projekt · {counts.tasks} feladat · {counts.comments} komment · {counts.files} csatolmány</span>
              <button type="button" className="crm-btn crm-btn-primary" disabled={pending || !counts.partners} onClick={runImport}>{pending ? <Loader2 className="animate-spin" /> : <Upload />} Importálás</button>
            </div>
          )}
        </section>
      )}

      {result && (
        <section className="crm-card crm-card-pad">
          <div className="mb-3 flex items-center gap-2"><CheckCircle2 style={{ color: 'var(--success)' }} /><h2 className="crm-section-title">Kész</h2></div>
          <ul className="mb-4 list-disc pl-5 text-[13px]" style={{ color: 'var(--text-2)' }}>{result.log.map((l, i) => <li key={i}>{l}</li>)}</ul>
          <div className="flex flex-wrap gap-2">
            <Link href="/partners" className="crm-btn crm-btn-primary">Partnerek megnyitása</Link>
            <Link href="/projects" className="crm-btn crm-btn-secondary">Projektek</Link>
          </div>
        </section>
      )}

      {tables && (result || alreadyImported) && counts && counts.files > 0 && <PerfexFilesStep tables={tables} skip={skip} total={counts.files} />}
      {tables && !result && !alreadyImported && counts && counts.files > 0 && (
        <button type="button" className="crm-btn crm-btn-ghost crm-btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setAlreadyImported(true)}>
          <Paperclip /> Az adatokat már importáltam, csak a csatolmányokat töltöm fel
        </button>
      )}
    </div>
  )
}
