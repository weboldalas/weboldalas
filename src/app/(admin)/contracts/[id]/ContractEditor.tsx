'use client'

import { useState, useTransition } from 'react'
import { Download, FileText, Printer, CheckCircle2, XCircle, Loader2, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateContractContent, updateContractStatus, updateContractPdfUrl, deleteContract } from '../actions'

const STATUS_CONFIG = {
  draft:     { label: 'Tervezet',    color: 'oklch(0.60 0.05 270)',  icon: FileText     },
  generated: { label: 'Generálva',   color: 'oklch(0.65 0.18 280)',  icon: FileText     },
  printed:   { label: 'Nyomtatva',   color: 'oklch(0.65 0.12 55)',   icon: Printer      },
  signed:    { label: 'Aláírva',     color: 'oklch(0.68 0.18 145)',  icon: CheckCircle2 },
  cancelled: { label: 'Visszavonva', color: 'oklch(0.62 0.22 25)',   icon: XCircle      },
} as const

type Contract = {
  id: string
  title: string
  content: string
  status: string
  template_id: string
  pdf_url: string | null
  generated_at: string | null
  signed_at: string | null
  notes: string | null
  customers: { id: string; name: string; email: string | null; phone: string | null } | null
}

export function ContractEditor({ contract }: { contract: Contract }) {
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState(contract.content)
  const [status, setStatus] = useState(contract.status)
  const [pdfUrl, setPdfUrl] = useState(contract.pdf_url)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStatus = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft

  function handleSaveContent() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateContractContent(contract.id, content)
      if (result && 'error' in result) {
        setError(result.error ?? null)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    })
  }

  function handleStatusChange(newStatus: string) {
    setError(null)
    startTransition(async () => {
      const result = await updateContractStatus(contract.id, newStatus)
      if (result && 'error' in result) {
        setError(result.error ?? null)
      } else {
        setStatus(newStatus)
      }
    })
  }

  async function handleGeneratePdf() {
    setError(null)
    setGenerating(true)
    try {
      const res = await fetch(`/api/contracts/${contract.id}/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: contract.title }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || 'PDF generálás sikertelen.')
      } else {
        setPdfUrl(json.url)
        setStatus('generated')
        await updateContractPdfUrl(contract.id, json.url)
      }
    } catch (e) {
      setError('Hálózati hiba a PDF generálás során.')
    } finally {
      setGenerating(false)
    }
  }

  function handleDelete() {
    if (!confirm('Biztosan törlöd ezt a szerződést? Ez nem visszavonható.')) return
    startTransition(async () => {
      await deleteContract(contract.id)
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.75 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }}>
          {error}
        </div>
      )}

      {/* Status bar */}
      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
        style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
        <div className="flex items-center gap-2">
          <currentStatus.icon className="h-4 w-4" style={{ color: currentStatus.color }} />
          <span className="text-sm font-bold" style={{ color: currentStatus.color }}>
            {currentStatus.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          {status !== 'printed' && status !== 'cancelled' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('printed')} disabled={isPending}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Nyomtatva
            </Button>
          )}
          {status !== 'signed' && status !== 'cancelled' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('signed')} disabled={isPending}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Aláírva
            </Button>
          )}
          {status !== 'cancelled' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('cancelled')} disabled={isPending}
              style={{ borderColor: 'oklch(0.62 0.22 25 / 0.3)', color: 'oklch(0.75 0.18 25)' }}>
              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Visszavon
            </Button>
          )}
        </div>
      </div>

      {/* Content editor */}
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold text-white">Szerződés szövege</Label>
          <Button size="sm" variant="outline" onClick={handleSaveContent} disabled={isPending}>
            {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            {saved ? 'Mentve ✓' : 'Mentés'}
          </Button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={30}
          className="w-full rounded-xl px-3 py-3 text-sm font-mono leading-relaxed resize-y"
          style={{
            background: 'oklch(1 0 0 / 0.05)',
            border: '1px solid oklch(1 0 0 / 0.12)',
            color: 'oklch(0.92 0.005 264)',
            minHeight: '500px',
          }}
        />
      </div>

      {/* PDF section */}
      <div className="rounded-2xl p-5 flex flex-wrap items-center gap-4"
        style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
        <div>
          <div className="text-sm font-bold text-white">PDF generálás</div>
          {pdfUrl ? (
            <div className="text-xs text-white/40 mt-0.5">PDF létezik · kattints az újrageneráláshoz</div>
          ) : (
            <div className="text-xs text-white/40 mt-0.5">Generálj PDF-et a letöltéshez</div>
          )}
        </div>

        <div className="flex gap-2 ml-auto flex-wrap">
          <Button onClick={handleGeneratePdf} disabled={generating || isPending}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            {generating ? 'Generálás...' : 'PDF generálás'}
          </Button>

          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Letöltés
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-400/70 hover:text-red-400"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Szerződés törlése
        </Button>
      </div>
    </div>
  )
}
