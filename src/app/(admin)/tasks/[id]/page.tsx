import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, CheckSquare, Eye, FileText, FolderKanban, MessageSquare, Paperclip, Pencil } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Avatar, CardHeader, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatDate, partnerName } from '@/lib/crm/format'
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/crm/status'

export const metadata = { title: 'Feladat' }

type PartnerRef = { id: string; name: string; company_name: string | null; is_company: boolean | null }
type Attachment = { id: string; file_name: string; mime_type: string | null; storage_path: string; comment_id: string | null; size_bytes: number | null }

const dateTime = (v: string) => new Intl.DateTimeFormat('hu-HU', { timeZone: 'Europe/Budapest', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(v))
const kb = (n: number | null) => (n ? (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`) : '')

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: task }, { data: comments }, { data: files }] = await Promise.all([
    supabase.from('tasks').select('*, customers(id, name, company_name, is_company), projects(id, name)').eq('id', id).single(),
    supabase.from('task_comments').select('id, body, author_name, created_at').eq('task_id', id).order('created_at'),
    supabase.from('task_attachments').select('id, file_name, mime_type, storage_path, comment_id, size_bytes').eq('task_id', id).order('created_at'),
  ])
  if (!task) notFound()

  const partner = (Array.isArray(task.customers) ? task.customers[0] : task.customers) as PartnerRef | null
  const project = (Array.isArray(task.projects) ? task.projects[0] : task.projects) as { id: string; name: string } | null
  const st = TASK_STATUS[task.status] ?? TASK_STATUS.todo
  const pr = TASK_PRIORITY[task.priority] ?? null
  const attachments = (files ?? []) as Attachment[]

  // Private bucket: short-lived links, generated per page view.
  const urls = new Map<string, string>()
  if (attachments.length) {
    const { data } = await supabase.storage.from('task-files').createSignedUrls(attachments.map(a => a.storage_path), 60 * 60)
    data?.forEach(d => { if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl) })
  }
  const byComment = new Map<string, Attachment[]>()
  attachments.filter(a => a.comment_id).forEach(a => byComment.set(a.comment_id!, [...(byComment.get(a.comment_id!) ?? []), a]))
  const taskFiles = attachments.filter(a => !a.comment_id)

  const FileChip = ({ a }: { a: Attachment }) => {
    const url = urls.get(a.storage_path)
    const isImage = a.mime_type?.startsWith('image/')
    return (
      <a href={url ?? '#'} target="_blank" rel="noopener noreferrer" className="crm-card flex items-center gap-3 p-2.5" style={{ textDecoration: 'none', opacity: url ? 1 : 0.5 }} title={url ? a.file_name : 'A fájl még nincs feltöltve'}>
        {isImage && url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
          : <span className="crm-avatar shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}><FileText size={18} /></span>}
        <span className="min-w-0"><strong className="block truncate text-[13px]">{a.file_name}</strong><span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{kb(a.size_bytes)}</span></span>
      </a>
    )
  }

  return (
    <div className="crm-page" style={{ maxWidth: 1000 }}>
      <div className="crm-hero">
        <span className="crm-avatar is-lg" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}><CheckSquare size={24} /></span>
        <div className="crm-hero-main">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="crm-title">{task.title}</h1>
            <StatusBadge label={st.label} tone={st.tone} />
            {pr && task.priority !== 'medium' && <StatusBadge label={pr.label} tone={pr.tone} dot={false} />}
          </div>
          <div className="crm-hero-meta">
            {partner && <Link href={`/partners/${partner.id}`}><Avatar name={partnerName(partner)} size="sm" />{partnerName(partner)}</Link>}
            {project && <Link href={`/projects/${project.id}`}><FolderKanban />{project.name}</Link>}
            {task.due_date && <span><CalendarDays />Határidő {formatDate(task.due_date)}</span>}
            {task.visibility === 'partner' && <span><Eye />Partner is látja</span>}
          </div>
        </div>
        <div className="crm-head-actions">
          <Link href={`/tasks/${id}/edit`} className="crm-btn crm-btn-secondary"><Pencil /> Szerkesztés</Link>
        </div>
      </div>

      {(task.description || task.note) && (
        <section className="crm-card crm-card-pad">
          <h2 className="crm-section-title mb-2">Leírás</h2>
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{task.description || task.note}</p>
        </section>
      )}

      {taskFiles.length > 0 && (
        <section className="crm-card">
          <CardHeader title={`Csatolmányok (${taskFiles.length})`} icon={Paperclip} />
          <div className="grid gap-2 p-4 sm:grid-cols-2">{taskFiles.map(a => <FileChip key={a.id} a={a} />)}</div>
        </section>
      )}

      <section className="crm-card">
        <CardHeader title={`Hozzászólások (${comments?.length ?? 0})`} icon={MessageSquare} description="Új hozzászólást a 2. fázisban, a feladatkezelővel lehet írni." />
        {!comments?.length ? <EmptyState icon={MessageSquare} title="Még nincs hozzászólás" /> : (
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <Avatar name={c.author_name || 'Ismeretlen'} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 text-[13px]"><strong>{c.author_name || 'Ismeretlen'}</strong><span style={{ color: 'var(--text-3)' }}>{dateTime(c.created_at)}</span></div>
                  <div className="whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>{c.body}</div>
                  {byComment.get(c.id)?.length ? <div className="mt-2 grid gap-2 sm:grid-cols-2">{byComment.get(c.id)!.map(a => <FileChip key={a.id} a={a} />)}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
