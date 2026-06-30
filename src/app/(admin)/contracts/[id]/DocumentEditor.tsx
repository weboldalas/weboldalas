'use client'

import { useState, useTransition, useCallback, useRef } from 'react'
import {
  Save, FileText, Send, CheckCircle2, XCircle, Archive, Loader2, ChevronDown,
  Eye, EyeOff, Clock, Trash2, Mail, PenLine, History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LivePreview } from './LivePreview'
import { SignaturePanel } from './SignaturePanel'
import {
  saveDocumentVersion,
  updateCurrentVersionContent,
  updateDocumentStatus,
  updateVersionPdfUrl,
  deleteDocument,
  logEmailSent,
} from '../actions'

type Version = {
  id: string
  created_at: string
  document_id: string
  version: number
  content: string
  pdf_url: string | null
  generated_at: string | null
  client_signature: string | null
  company_signature: string | null
  signed_at: string | null
}

type ActivityEntry = {
  id: string
  created_at: string
  action: string
  description: string | null
}

type CompanySettings = {
  id: string
  company_name: string | null
  logo_url: string | null
  address: string | null
  tax_number: string | null
  registration_number: string | null
  bank_account: string | null
  representative_name: string | null
  email: string | null
  phone: string | null
  website: string | null
}

const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Tervezet',    color: 'oklch(0.60 0.05 270)',  icon: FileText      },
  { value: 'generated', label: 'Generálva',   color: 'oklch(0.65 0.18 280)',  icon: FileText      },
  { value: 'sent',      label: 'Elküldve',    color: 'oklch(0.65 0.12 55)',   icon: Send          },
  { value: 'signed',    label: 'Aláírva',     color: 'oklch(0.68 0.18 145)',  icon: CheckCircle2  },
  { value: 'archived',  label: 'Archivált',   color: 'oklch(0.55 0.05 270)',  icon: Archive       },
  { value: 'cancelled', label: 'Visszavonva', color: 'oklch(0.62 0.22 25)',   icon: XCircle       },
] as const

const ACTION_ICONS: Record<string, string> = {
  created: '✨', edited: '✏️', pdf_generated: '📄', email_sent: '📧',
  signed: '✍️', status_changed: '🔄',
}

export function DocumentEditor({
  document,
  latestVersion,
  versions,
  activity,
  companySettings,
}: {
  document: any
  latestVersion: Version | null
  versions: Version[]
  activity: ActivityEntry[]
  companySettings: CompanySettings | null
}) {
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState(latestVersion?.content ?? '')
  const [status, setStatus] = useState<string>(document.status)
  const [pdfUrl, setPdfUrl] = useState<string | null>(latestVersion?.pdf_url ?? null)
  const [currentVersion, setCurrentVersion] = useState(document.current_version)
  const [currentVersionId, setCurrentVersionId] = useState(latestVersion?.id ?? '')
  const [showPreview, setShowPreview] = useState(true)
  const [showSignature, setShowSignature] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [generating, setGenerating] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusDropdown, setStatusDropdown] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentStatusCfg = STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0]

  function handleSaveNew() {
    setError(null)
    setSaving(true)
    setSavedMsg('')
    startTransition(async () => {
      const result = await saveDocumentVersion(document.id, content, currentVersion)
      setSaving(false)
      if (result && 'error' in result) { setError(result.error ?? null); return }
      if ('newVersion' in result) {
        setCurrentVersion(result.newVersion)
        setSavedMsg(`v${result.newVersion} mentve`)
        setTimeout(() => setSavedMsg(''), 3000)
      }
    })
  }

  function handleSaveInPlace() {
    if (!currentVersionId) return
    setError(null)
    setSaving(true)
    startTransition(async () => {
      const result = await updateCurrentVersionContent(document.id, currentVersionId, content)
      setSaving(false)
      if (result && 'error' in result) { setError(result.error ?? null); return }
      setSavedMsg('Mentve')
      setTimeout(() => setSavedMsg(''), 3000)
    })
  }

  function handleStatusChange(newStatus: string) {
    setStatusDropdown(false)
    startTransition(async () => {
      const result = await updateDocumentStatus(document.id, newStatus)
      if (result && 'error' in result) { setError(result.error ?? null); return }
      setStatus(newStatus)
    })
  }

  async function handleGeneratePdf() {
    setError(null)
    setGenerating(true)
    try {
      const res = await fetch(`/api/contracts/${document.id}/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title: document.title,
          versionId: currentVersionId,
          companySettings,
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setError(json.error || 'PDF generálás sikertelen.'); return }
      setPdfUrl(json.url)
      setStatus('generated')
      await updateVersionPdfUrl(document.id, currentVersionId, json.url)
    } catch {
      setError('Hálózati hiba a PDF generálás során.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSendEmail() {
    const customer = document.customers
    const email = customer?.email
    if (!email) { setError('Az ügyfélnek nincs e-mail címe.'); return }
    if (!pdfUrl) { setError('Előbb generálj PDF-et.'); return }
    setError(null)
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/contracts/${document.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl, recipientEmail: email, title: document.title }),
      })
      const json = await res.json()
      if (!res.ok || json.error) { setError(json.error || 'Küldés sikertelen.'); return }
      setStatus('sent')
      await logEmailSent(document.id, email)
      setSavedMsg(`Email elküldve: ${email}`)
      setTimeout(() => setSavedMsg(''), 4000)
    } catch {
      setError('Hálózati hiba az email küldés során.')
    } finally {
      setSendingEmail(false)
    }
  }

  function handleDelete() {
    if (!confirm('Biztosan törlöd ezt a szerződést? Ez nem visszavonható.')) return
    startTransition(async () => { await deleteDocument(document.id) })
  }

  // Insert text at cursor in textarea
  function insertAtCursor(text: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newContent = content.slice(0, start) + text + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const StatusIcon = currentStatusCfg.icon

  return (
    <div className="flex flex-col gap-3 min-h-0 flex-1">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 shrink-0 p-3 rounded-xl"
        style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>

        {/* Status */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdown(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={{ background: `${currentStatusCfg.color}15`, color: currentStatusCfg.color, border: `1px solid ${currentStatusCfg.color}30` }}>
            <StatusIcon className="h-3.5 w-3.5" /> {currentStatusCfg.label} <ChevronDown className="h-3 w-3" />
          </button>
          {statusDropdown && (
            <div className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden"
              style={{ background: 'oklch(0.12 0.04 270 / 0.95)', border: '1px solid oklch(1 0 0 / 0.15)', backdropFilter: 'blur(20px)', minWidth: '150px' }}>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleStatusChange(opt.value)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-left transition-all hover:bg-white/5"
                  style={{ color: opt.color }}>
                  <opt.icon className="h-3.5 w-3.5" /> {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Save buttons */}
        <Button size="sm" variant="outline" onClick={handleSaveInPlace} disabled={isPending || saving}>
          {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
          Mentés
        </Button>
        <Button size="sm" variant="outline" onClick={handleSaveNew} disabled={isPending || saving}>
          <History className="mr-1.5 h-3.5 w-3.5" /> Új v{currentVersion + 1}
        </Button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* PDF */}
        <Button size="sm" onClick={handleGeneratePdf} disabled={generating || isPending}>
          {generating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileText className="mr-1.5 h-3.5 w-3.5" />}
          {generating ? 'Generálás...' : 'PDF'}
        </Button>

        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">⬇ Letöltés</Button>
          </a>
        )}

        <Button size="sm" variant="outline" onClick={handleSendEmail} disabled={sendingEmail || isPending || !pdfUrl}>
          {sendingEmail ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-1.5 h-3.5 w-3.5" />}
          Email
        </Button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Signature */}
        <Button size="sm" variant="outline" onClick={() => setShowSignature(v => !v)}
          style={showSignature ? { background: 'oklch(0.68 0.22 290 / 0.2)', borderColor: 'oklch(0.68 0.22 290 / 0.5)' } : {}}>
          <PenLine className="mr-1.5 h-3.5 w-3.5" /> Aláírás
        </Button>

        {/* Preview toggle */}
        <button onClick={() => setShowPreview(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ml-auto"
          style={{ background: 'oklch(1 0 0 / 0.05)', color: 'oklch(1 0 0 / 0.5)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span className="hidden sm:block">Előnézet</span>
        </button>

        <button onClick={() => setShowHistory(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'oklch(1 0 0 / 0.05)', color: 'oklch(1 0 0 / 0.5)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:block">Napló</span>
        </button>
      </div>

      {/* Status messages */}
      {(error || savedMsg) && (
        <div className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={error
            ? { background: 'oklch(0.62 0.22 25 / 0.12)', color: 'oklch(0.78 0.18 25)', border: '1px solid oklch(0.62 0.22 25 / 0.25)' }
            : { background: 'oklch(0.68 0.18 145 / 0.12)', color: 'oklch(0.75 0.18 145)', border: '1px solid oklch(0.68 0.18 145 / 0.25)' }}>
          {error || savedMsg}
        </div>
      )}

      {/* Signature panel */}
      {showSignature && (
        <SignaturePanel
          documentId={document.id}
          versionId={currentVersionId}
          existingClientSig={latestVersion?.client_signature || null}
          existingCompanySig={latestVersion?.company_signature || null}
          onSigned={() => setStatus('signed')}
        />
      )}

      {/* Main split view */}
      <div className={`flex gap-3 min-h-0 flex-1 ${showPreview ? 'flex-col lg:flex-row' : 'flex-col'}`}
        style={{ minHeight: '500px' }}>

        {/* Editor panel */}
        <div className="flex flex-col gap-2 min-h-0" style={{ flex: showPreview ? '0 0 50%' : '1' }}>
          <div className="text-xs font-semibold text-white/30 px-1">SZERKESZTŐ</div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="flex-1 w-full rounded-xl px-4 py-4 text-sm font-mono leading-relaxed resize-none"
            style={{
              background: 'oklch(0.10 0.02 270)',
              border: '1px solid oklch(1 0 0 / 0.10)',
              color: 'oklch(0.90 0.005 264)',
              minHeight: '500px',
            }}
            spellCheck={false}
          />
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="flex flex-col gap-2 min-h-0 flex-1 overflow-auto">
            <div className="text-xs font-semibold text-white/30 px-1">A4 ELŐNÉZET</div>
            <div className="flex-1 overflow-auto rounded-xl"
              style={{ background: 'oklch(0.08 0.01 270)', border: '1px solid oklch(1 0 0 / 0.08)', padding: '20px' }}>
              <LivePreview
                content={content}
                title={document.title}
                companySettings={companySettings}
                customer={document.customers}
              />
            </div>
          </div>
        )}
      </div>

      {/* Version history + Activity */}
      {showHistory && (
        <div className="grid gap-3 sm:grid-cols-2 shrink-0">
          <div className="rounded-2xl p-4"
            style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Verziók</div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {versions.map(v => (
                <div key={v.id} className="flex items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-white/80">v{v.version}</div>
                    <div className="text-xs text-white/30">{new Date(v.created_at).toLocaleString('hu-HU')}</div>
                  </div>
                  <div className="flex gap-1">
                    {v.pdf_url && <span className="text-xs px-2 py-0.5 rounded-full text-emerald-400/80 bg-emerald-400/10">PDF</span>}
                    {v.signed_at && <span className="text-xs px-2 py-0.5 rounded-full text-violet-400/80 bg-violet-400/10">Aláírt</span>}
                    <button
                      onClick={() => { setContent(v.content); setCurrentVersionId(v.id); setCurrentVersion(v.version) }}
                      className="text-xs px-2 py-0.5 rounded-full text-white/40 hover:text-white/80 transition-colors">
                      Betölt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4"
            style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Tevékenységnapló</div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {activity.map(a => (
                <div key={a.id} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm">{ACTION_ICONS[a.action] ?? '•'}</span>
                  <div>
                    <div className="text-xs text-white/70">{a.description}</div>
                    <div className="text-xs text-white/25">{new Date(a.created_at).toLocaleString('hu-HU')}</div>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <p className="text-xs text-white/25">Nincs napló.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="flex justify-end shrink-0 pt-2">
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}
          className="text-red-400/60 hover:text-red-400">
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Szerződés törlése
        </Button>
      </div>
    </div>
  )
}
