'use client'

import { useState } from 'react'
import { unzip } from 'fflate'
import { AlertTriangle, CheckCircle2, Loader2, Paperclip } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type Upload = { perfexId: number; zipKey: string; path: string; token: string; mimeType: string | null }

/** Zip entry names without the UTF-8 flag arrive as Latin-1; re-decode them and normalise to NFC. */
function fixName(name: string) {
  if (/[\u0080-ÿ]/.test(name) && ![...name].some(c => c.charCodeAt(0) > 255)) {
    try { name = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(name, c => c.charCodeAt(0))) } catch { /* keep as is */ }
  }
  return name.normalize('NFC')
}
/** "uploads/tasks/12/kép.png" → "tasks/12/kép.png" */
const keyOf = (name: string) => fixName(name).split('/').slice(-3).join('/')

export function PerfexFilesStep({ tables, skip, total }: { tables: unknown[]; skip: number[]; total: number }) {
  const [phase, setPhase] = useState<'idle' | 'reading' | 'uploading' | 'done'>('idle')
  const [done, setDone] = useState(0)
  const [count, setCount] = useState(total)
  const [failed, setFailed] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function run(file: File) {
    setError(null); setFailed([]); setDone(0)
    if (!file.name.toLowerCase().endsWith('.zip')) { setError('Az uploads mappa zip-jét válaszd ki.'); return }
    try {
      setPhase('uploading')
      const res = await fetch('/api/import/perfex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tables, skip, mode: 'files' }) })
      const json = await res.json().catch(() => ({ error: 'Váratlan válasz a szervertől.' }))
      if (!res.ok || json.error) throw new Error(json.error || 'Hiba történt.')
      const uploads: Upload[] = json.uploads
      setCount(uploads.length)

      setPhase('reading')
      const wanted = new Set(uploads.map(u => u.zipKey))
      const buffer = new Uint8Array(await file.arrayBuffer())
      const entries = await new Promise<Record<string, Uint8Array>>((resolve, reject) =>
        unzip(buffer, { filter: f => wanted.has(keyOf(f.name)) }, (err, data) => (err ? reject(err) : resolve(data))))
      const byKey = new Map(Object.entries(entries).map(([name, data]) => [keyOf(name), data]))

      setPhase('uploading')
      const supabase = createClient()
      const missing: string[] = []
      let ok = 0
      for (const u of uploads) {
        const data = byKey.get(u.zipKey)
        if (!data) { missing.push(u.zipKey); continue }
        const blob = new Blob([data.slice().buffer], { type: u.mimeType ?? 'application/octet-stream' })
        const { error: upErr } = await supabase.storage.from('task-files').uploadToSignedUrl(u.path, u.token, blob, { contentType: u.mimeType ?? undefined, upsert: true })
        if (upErr) { missing.push(`${u.zipKey} (${upErr.message})`); continue }
        await fetch('/api/import/perfex/uploaded', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ perfexId: u.perfexId, size: data.byteLength }) }).catch(() => {})
        ok += 1
        setDone(ok)
      }
      setFailed(missing)
      setPhase('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A feltöltés nem sikerült.')
      setPhase('idle')
    }
  }

  const busy = phase === 'reading' || phase === 'uploading'
  return (
    <section className="crm-card crm-card-pad">
      <h2 className="crm-section-title mb-1">3. Csatolmányok ({total} fájl)</h2>
      <p className="mb-4 text-[13px]" style={{ color: 'var(--text-3)' }}>
        Hostinger → File Manager → a Perfex <code>uploads</code> mappája → Compress → töltsd le a zip-et, és válaszd ki itt. A fájlok a saját feladatukhoz kerülnek. Ez is többször futtatható.
      </p>
      {phase !== 'done' && (
        <label className="crm-btn crm-btn-secondary" style={{ cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}>
          {busy ? <Loader2 className="animate-spin" /> : <Paperclip />}
          {phase === 'reading' ? 'Zip olvasása…' : phase === 'uploading' ? `Feltöltés… ${done}/${count}` : 'uploads.zip kiválasztása'}
          <input type="file" accept=".zip,application/zip" className="sr-only" disabled={busy} onChange={e => { const f = e.target.files?.[0]; if (f) run(f); e.target.value = '' }} />
        </label>
      )}
      {busy && <div className="crm-progress" style={{ marginTop: 14 }}><i style={{ width: `${count ? (done / count) * 100 : 0}%` }} /></div>}
      {phase === 'done' && (
        <div className="flex items-center gap-2 text-[14px]"><CheckCircle2 style={{ color: 'var(--success)' }} /> {done} fájl feltöltve.</div>
      )}
      {failed.length > 0 && (
        <div className="crm-alert is-danger mt-3" role="alert"><AlertTriangle /><span>{failed.length} fájl nem került fel: {failed.slice(0, 5).join(', ')}{failed.length > 5 ? '…' : ''}</span></div>
      )}
      {error && <div className="crm-alert is-danger mt-3" role="alert"><AlertTriangle />{error}</div>}
    </section>
  )
}
