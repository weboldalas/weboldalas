'use client'

import { useRef, useState, useEffect } from 'react'
import SignaturePad from 'signature_pad'

interface Props {
  token: string
  status: string
  reviewNote: string | null
  partnerEmail: string | null
  hasOwnerSignature: boolean
  title: string
}

export function ContractActions({ token, status, reviewNote, partnerEmail, hasOwnerSignature, title }: Props) {
  const [mode, setMode] = useState<'idle' | 'review' | 'sign'>('idle')
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<'review' | 'signed' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)
  const [signEmpty, setSignEmpty] = useState(true)

  const sheetOpen = mode !== 'idle'

  useEffect(() => {
    if (mode !== 'sign' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ratio = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(ratio, ratio)

    const pad = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: '#1A1917',
      backgroundColor: 'rgba(255,255,255,0)',
    })
    padRef.current = pad
    const checkEmpty = () => setSignEmpty(pad.isEmpty())
    canvas.addEventListener('pointerup', checkEmpty)
    return () => {
      pad.off()
      canvas.removeEventListener('pointerup', checkEmpty)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'sign') return
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas || !padRef.current) return
      const data = padRef.current.toData()
      const ratio = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(ratio, ratio)
      padRef.current.fromData(data)
    }
    window.addEventListener('resize', resize)
    setTimeout(resize, 50)
    return () => window.removeEventListener('resize', resize)
  }, [mode])

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  async function handleReviewSubmit() {
    if (!reviewText.trim()) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/contracts/view/${token}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewNote: reviewText }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setError(json.error || 'Hiba történt.'); return }
      setMode('idle')
      setDone('review')
    } catch {
      setError('Hálózati hiba.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSign() {
    if (!padRef.current || padRef.current.isEmpty()) return
    setError(null)
    setLoading(true)
    try {
      const signature = padRef.current.toDataURL('image/png')
      const res = await fetch(`/api/contracts/view/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, partnerEmail }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setError(json.error || 'Hiba történt.'); return }
      setMode('idle')
      setDone('signed')
    } catch {
      setError('Hálózati hiba.')
    } finally {
      setLoading(false)
    }
  }

  const isSigned = status === 'signed' || done === 'signed'
  const isReviewRequested = (status === 'review_requested' && !done) || done === 'review'

  return (
    <>
      {/* Backdrop */}
      {sheetOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(26,25,23,0.45)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          onClick={() => { if (!loading) setMode('idle') }}
        />
      )}

      {/* Bottom sheet */}
      {sheetOpen && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -6px 32px rgba(0,0,0,0.14)',
          zIndex: 50,
          maxHeight: '88vh',
          overflowY: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {/* Pull handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D6D3CE' }} />
          </div>

          {mode === 'review' && (
            <div style={{ padding: '12px 20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#1A1917' }}>Módosítást kérek</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B6860', lineHeight: 1.5 }}>Írja le pontosan mivel nem ért egyet, vagy mit szeretne módosítani</p>
                </div>
                <button
                  onClick={() => setMode('idle')}
                  style={{ border: 'none', background: '#F5F4F2', color: '#6B6860', width: 32, height: 32, borderRadius: '50%', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={5}
                placeholder="Pl. A 3. pontban szeretném módosítani a határidőt 30 napról 45 napra..."
                autoFocus
                style={{
                  width: '100%', resize: 'vertical', borderRadius: 8, padding: '11px 14px',
                  fontSize: 14, color: '#1A1917', border: '1.5px solid #D6D3CE',
                  background: '#FAF9F7', boxSizing: 'border-box', outline: 'none',
                  fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1.6,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#1E3A5F' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#D6D3CE' }}
              />

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => setMode('idle')}
                  style={{ padding: '11px 18px', borderRadius: 8, border: '1.5px solid #D6D3CE', background: 'white', color: '#6B6860', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Mégse
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={loading || !reviewText.trim()}
                  style={{
                    flex: 1, padding: '11px 18px', borderRadius: 8, border: 'none',
                    background: !loading && reviewText.trim() ? '#1E3A5F' : '#E4E4E7',
                    color: !loading && reviewText.trim() ? 'white' : '#9CA3AF',
                    fontSize: 14, fontWeight: 600,
                    cursor: loading || !reviewText.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'background 0.15s',
                  }}
                >
                  {loading ? 'Küldés...' : 'Kérelem elküldése'}
                </button>
              </div>
            </div>
          )}

          {mode === 'sign' && (
            <div style={{ padding: '12px 20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#1A1917' }}>Elektronikus aláírás</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B6860', lineHeight: 1.5 }}>Írja alá az alábbi mezőben ujjával vagy egérrel</p>
                </div>
                <button
                  onClick={() => { if (!loading) setMode('idle') }}
                  style={{ border: 'none', background: '#F5F4F2', color: '#6B6860', width: 32, height: 32, borderRadius: '50%', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #D6D3CE', height: 220, background: '#FAFAF9' }}>
                <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
                {signEmpty && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <p style={{ fontSize: 14, color: '#C4C2BE', margin: 0 }}>Írja ide az aláírását...</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
                <button
                  onClick={() => { padRef.current?.clear(); setSignEmpty(true) }}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #D6D3CE', background: 'white', color: '#6B6860', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                >
                  Törlés
                </button>
                <button
                  onClick={() => { if (!loading) setMode('idle') }}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #D6D3CE', background: 'white', color: '#6B6860', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                >
                  Mégse
                </button>
                <button
                  onClick={handleSign}
                  disabled={loading || signEmpty}
                  style={{
                    flex: 1, padding: '11px 16px', borderRadius: 8, border: 'none',
                    background: !loading && !signEmpty ? '#14663B' : '#E4E4E7',
                    color: !loading && !signEmpty ? 'white' : '#9CA3AF',
                    fontSize: 14, fontWeight: 700,
                    cursor: loading || signEmpty ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                >
                  {loading ? 'Mentés...' : 'Aláírom →'}
                </button>
              </div>

              <p style={{ fontSize: 12, color: '#A09D98', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.5 }}>
                Az aláírásával megerősíti, hogy elolvasta és elfogadja a szerződés feltételeit.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fixed bottom action bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: '#fff',
        borderTop: '1px solid #D6D3CE',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        {isSigned ? (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#14663B' }}>Szerződés aláírva</p>
              <p style={{ margin: 0, fontSize: 12, color: '#6B6860' }}>Megerősítő emailt küldtünk.</p>
            </div>
          </div>
        ) : isReviewRequested ? (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, flexShrink: 0 }}>✎</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#92400E' }}>Módosítási kérelem elküldve</p>
              <p style={{ margin: 0, fontSize: 12, color: '#6B6860' }}>Értesítettük a szerkesztőt. Hamarosan visszajelzünk.</p>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11, color: '#A09D98', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Szerződés</p>
              <p style={{ margin: 0, fontSize: 13, color: '#1A1917', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
            </div>
            <button
              onClick={() => setMode('review')}
              style={{
                padding: '10px 15px', borderRadius: 8, border: '1.5px solid #D6D3CE',
                background: 'white', color: '#3D3B39', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
              }}
            >
              Módosítást kérek
            </button>
            {hasOwnerSignature ? (
              <button
                onClick={() => setMode('sign')}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: 'none',
                  background: '#14663B', color: 'white', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
                }}
              >
                Aláírom →
              </button>
            ) : (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F5F4F2', color: '#A09D98', fontSize: 12, flexShrink: 0, textAlign: 'center', whiteSpace: 'nowrap' }}>
                Aláírás nem elérhető
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
