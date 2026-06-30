'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { PenLine, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveSignatures, updateVersionPdfUrl } from '../actions'

export function SignaturePanel({
  documentId,
  versionId,
  existingClientSig,
  existingCompanySig,
  content,
  title,
  companySettings,
  onSigned,
}: {
  documentId: string
  versionId: string
  existingClientSig: string | null
  existingCompanySig: string | null
  content: string
  title: string
  companySettings: unknown
  onSigned: (pdfUrl?: string) => void
}) {
  const clientCanvasRef = useRef<HTMLCanvasElement>(null)
  const companyCanvasRef = useRef<HTMLCanvasElement>(null)
  const clientPadRef = useRef<any>(null)
  const companyPadRef = useRef<any>(null)

  const [clientSigned, setClientSigned] = useState(!!existingClientSig)
  const [companySigned, setCompanySigned] = useState(!!existingCompanySig)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let SignaturePad: any
    import('signature_pad').then(m => {
      SignaturePad = m.default

      if (clientCanvasRef.current && !existingClientSig) {
        clientPadRef.current = new SignaturePad(clientCanvasRef.current, {
          backgroundColor: 'rgba(255,255,255,0)',
          penColor: '#1a1a2e',
          minWidth: 1,
          maxWidth: 2.5,
        })
        clientPadRef.current.addEventListener('endStroke', () => setClientSigned(true))
      }

      if (companyCanvasRef.current && !existingCompanySig) {
        companyPadRef.current = new SignaturePad(companyCanvasRef.current, {
          backgroundColor: 'rgba(255,255,255,0)',
          penColor: '#1a1a2e',
          minWidth: 1,
          maxWidth: 2.5,
        })
        companyPadRef.current.addEventListener('endStroke', () => setCompanySigned(true))
      }
    })

    return () => {
      clientPadRef.current?.off()
      companyPadRef.current?.off()
    }
  }, [existingClientSig, existingCompanySig])

  function clearPad(padRef: React.MutableRefObject<any>, setter: (v: boolean) => void) {
    padRef.current?.clear()
    setter(false)
  }

  function getSignatureData(
    padRef: React.MutableRefObject<any>,
    existing: string | null
  ): string | null {
    if (existing) return existing
    if (!padRef.current || padRef.current.isEmpty()) return null
    return padRef.current.toDataURL('image/png')
  }

  function handleSave() {
    setError(null)
    const clientSig = getSignatureData(clientPadRef, existingClientSig)
    const companySig = getSignatureData(companyPadRef, existingCompanySig)

    if (!clientSig && !companySig) {
      setError('Legalább egy aláírás szükséges.')
      return
    }

    startTransition(async () => {
      const result = await saveSignatures(
        documentId,
        versionId,
        clientSig || '',
        companySig || '',
      )
      if (result && 'error' in result) {
        setError((result as { error: string }).error ?? null)
      } else {
        setSuccess(true)
        // Re-generate PDF with signatures embedded
        let newPdfUrl: string | undefined
        try {
          const res = await fetch(`/api/contracts/${documentId}/pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              title,
              companySettings,
              clientSignature: clientSig,
              companySignature: companySig,
            }),
          })
          const json = await res.json()
          if (res.ok && json.url) {
            newPdfUrl = json.url
            await updateVersionPdfUrl(documentId, versionId, json.url)
          }
        } catch {
          // PDF frissítés nem kritikus, az aláírás már el van mentve
        }
        onSigned(newPdfUrl)
      }
    })
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 shrink-0"
      style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(0.68 0.22 290 / 0.25)' }}>
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4" style={{ color: 'oklch(0.68 0.22 290)' }} />
        <span className="text-sm font-bold text-white">Digitális aláírás</span>
      </div>

      {error && (
        <div className="text-sm px-3 py-2 rounded-lg"
          style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.78 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
          style={{ background: 'oklch(0.68 0.18 145 / 0.12)', color: 'oklch(0.75 0.18 145)', border: '1px solid oklch(0.68 0.18 145 / 0.25)' }}>
          <CheckCircle2 className="h-4 w-4" /> Aláírások elmentve!
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Client signature */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white/80">Megbízó aláírása</div>
              {clientSigned && !existingClientSig && (
                <div className="text-xs text-emerald-400/80 mt-0.5">✓ Aláírva</div>
              )}
              {existingClientSig && (
                <div className="text-xs text-emerald-400/80 mt-0.5">✓ Korábban aláírva</div>
              )}
            </div>
            {!existingClientSig && (
              <button onClick={() => clearPad(clientPadRef, setClientSigned)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Törlés
              </button>
            )}
          </div>
          {existingClientSig ? (
            <div className="rounded-xl overflow-hidden border border-white/10"
              style={{ background: 'white', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={existingClientSig} alt="Megbízó aláírása" style={{ maxHeight: '80px', objectFit: 'contain' }} />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '2px dashed oklch(1 0 0 / 0.15)', background: 'white', cursor: 'crosshair' }}>
              <canvas ref={clientCanvasRef} width={280} height={100} style={{ display: 'block', width: '100%', height: '100px', touchAction: 'none' }} />
            </div>
          )}
          {!existingClientSig && (
            <p className="text-xs text-white/25 text-center">Rajzoljon az aláírás mezőbe</p>
          )}
        </div>

        {/* Company signature */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white/80">Megbízott aláírása</div>
              {companySigned && !existingCompanySig && (
                <div className="text-xs text-emerald-400/80 mt-0.5">✓ Aláírva</div>
              )}
              {existingCompanySig && (
                <div className="text-xs text-emerald-400/80 mt-0.5">✓ Korábban aláírva</div>
              )}
            </div>
            {!existingCompanySig && (
              <button onClick={() => clearPad(companyPadRef, setCompanySigned)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Törlés
              </button>
            )}
          </div>
          {existingCompanySig ? (
            <div className="rounded-xl overflow-hidden border border-white/10"
              style={{ background: 'white', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={existingCompanySig} alt="Megbízott aláírása" style={{ maxHeight: '80px', objectFit: 'contain' }} />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '2px dashed oklch(1 0 0 / 0.15)', background: 'white', cursor: 'crosshair' }}>
              <canvas ref={companyCanvasRef} width={280} height={100} style={{ display: 'block', width: '100%', height: '100px', touchAction: 'none' }} />
            </div>
          )}
          {!existingCompanySig && (
            <p className="text-xs text-white/25 text-center">Rajzoljon az aláírás mezőbe</p>
          )}
        </div>
      </div>

      {!existingClientSig && !existingCompanySig && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isPending || (!clientSigned && !companySigned)}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Aláírások mentése és PDF frissítése
          </Button>
        </div>
      )}
    </div>
  )
}
