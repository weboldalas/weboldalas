'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import type SignaturePadType from 'signature_pad'
import { toast } from 'sonner'
import { Eraser, Loader2, PenLine, Save } from 'lucide-react'

/**
 * The owner's saved signature. It goes onto every contract the partner signs
 * through the public link, so the signed PDF carries both signatures.
 */
export function OwnerSignatureCard({ settingsId, initial }: { settingsId: string; initial: string | null }) {
  const [signature, setSignature] = useState(initial)
  const [editing, setEditing] = useState(!initial)
  const [hasInk, setHasInk] = useState(false)
  const [pending, startTransition] = useTransition()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePadType | null>(null)

  useEffect(() => {
    if (!editing || !canvasRef.current) return
    const canvas = canvasRef.current
    let disposed = false
    import('signature_pad').then(({ default: SignaturePad }) => {
      if (disposed) return
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      canvas.getContext('2d')?.scale(ratio, ratio)
      const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)', penColor: '#1a1a2e', minWidth: 1, maxWidth: 2.5 })
      pad.addEventListener('endStroke', () => setHasInk(true))
      padRef.current = pad
    })
    return () => { disposed = true; padRef.current?.off(); padRef.current = null }
  }, [editing])

  function save() {
    const pad = padRef.current
    if (!pad || pad.isEmpty()) return
    const data = pad.toDataURL('image/png')
    startTransition(async () => {
      const res = await fetch('/api/company-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: settingsId, owner_signature: data }) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.error) { toast.error('Az aláírás mentése nem sikerült', { description: json.error }); return }
      setSignature(data)
      setEditing(false)
      setHasInk(false)
      toast.success('Aláírás mentve')
    })
  }

  return (
    <section className="crm-card crm-card-pad">
      <div className="mb-4 flex items-start gap-3">
        <span className="crm-avatar" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}><PenLine size={18} /></span>
        <div>
          <h2 className="crm-section-title">Saját aláírás</h2>
          <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>Ez kerül a szerződésekre, amikor a partner a linken keresztül aláír.</p>
        </div>
      </div>
      {editing ? (
        <>
          <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: 160, background: '#fff', border: '1px dashed var(--line-strong)', touchAction: 'none' }} aria-label="Aláírás rajzolása" />
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {signature && <button type="button" className="crm-btn crm-btn-ghost" onClick={() => setEditing(false)}>Mégse</button>}
            <button type="button" className="crm-btn crm-btn-secondary" onClick={() => { padRef.current?.clear(); setHasInk(false) }}><Eraser /> Törlés</button>
            <button type="button" className="crm-btn crm-btn-primary" disabled={!hasInk || pending} onClick={save}>{pending ? <Loader2 className="animate-spin" /> : <Save />} Mentés</button>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {signature && <img src={signature} alt="Mentett aláírás" className="h-20 rounded-xl px-4" style={{ background: '#fff', border: '1px solid var(--line)' }} />}
          <button type="button" className="crm-btn crm-btn-secondary" onClick={() => setEditing(true)}><PenLine /> Új aláírás</button>
        </div>
      )}
    </section>
  )
}
