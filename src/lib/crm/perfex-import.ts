/**
 * Perfex CRM → weboldalas CRM import.
 * Reads a phpMyAdmin JSON export of the Perfex database and imports partners, contacts,
 * projects, tasks and task comments. Re-running is safe: rows are matched on perfex_id,
 * and a partner that already exists with the same name is linked instead of duplicated.
 *
 * Used by the admin page (Beállítások → Perfex import) and by scripts/import-perfex.mjs.
 * Requires migration 20261127100000_perfex_import.sql. No imports, so Node can load it directly.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

type Row = Record<string, unknown>

// ---------------------------------------------------------------- value helpers
const str = (v: unknown) => (v === null || v === undefined || String(v).trim() === '' ? null : String(v).trim())
const int = (v: unknown) => (str(v) === null ? null : Number.parseInt(String(v), 10))
const day = (v: unknown) => { const s = str(v); return s && !s.startsWith('0000') ? s.slice(0, 10) : null }
const num = (v: unknown) => (str(v) === null ? null : Number(v))

export function decodeEntities(s: string) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
}
const plain = (v: unknown) => { const s = str(v); return s ? decodeEntities(s) : null }

/** Perfex stores rich text as HTML; keep line breaks, drop tags. */
function text(v: unknown) {
  const s = str(v)
  if (!s) return null
  const out = decodeEntities(s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ''))
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() || null
}

/** Perfex stores local (Budapest) wall-clock times; convert them to real UTC instants. */
const PERFEX_TZ = 'Europe/Budapest'
function tzOffsetMs(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: PERFEX_TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(date).map(p => [p.type, p.value]))
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - date.getTime()
}
function ts(v: unknown) {
  const s = str(v)
  if (!s || s.startsWith('0000')) return null
  const asUtc = new Date(s.replace(' ', 'T') + (s.length > 10 ? 'Z' : 'T00:00:00Z'))
  if (Number.isNaN(asUtc.getTime())) return null
  return new Date(asUtc.getTime() - tzOffsetMs(asUtc)).toISOString()
}
const fullName = (r: Row | null | undefined) => (r ? [str(r.firstname), str(r.lastname)].filter(Boolean).join(' ') || null : null)

const PROJECT_STATUS: Record<number, string> = { 1: 'planned', 2: 'active', 3: 'on_hold', 4: 'completed', 5: 'cancelled' }
const TASK_STATUS: Record<number, string> = { 1: 'todo', 2: 'waiting', 3: 'in_progress', 4: 'in_progress', 5: 'done' }
const TASK_PRIORITY: Record<number, string> = { 1: 'low', 2: 'medium', 3: 'high', 4: 'urgent' }

// ---------------------------------------------------------------- parse
export type PerfexPartnerSummary = { perfexId: number; name: string; active: boolean; contacts: number; projects: string[]; tasks: number; openTasks: number }

export type PerfexPlan = {
  partners: PerfexPartnerSummary[]
  counts: { partners: number; contacts: number; projects: number; tasks: number; comments: number; files: number }
  customers: Row[]
  contacts: Row[]
  projects: Row[]
  tasks: Row[]
  comments: Row[]
  /** Attachments: metadata only; the bytes come from the Perfex uploads.zip on the client. */
  files: PerfexFile[]
}

export type PerfexFile = {
  perfex_id: number
  /** Path inside the Perfex uploads folder, e.g. "tasks/12/kép.png" (NFC). */
  zip_key: string
  file_name: string
  mime_type: string | null
  visible_to_partner: boolean
  author_name: string | null
  created_at: string | null
  _task: number | null
  _client: number | null
  _comment: number | null
}

/** "tasks/12/x.png" for a Perfex upload, normalised so it matches names read from the zip. */
export const perfexZipKey = (folder: string, relId: unknown, name: string) => `${folder}/${relId}/${name}`.normalize('NFC')

export function parsePerfexExport(raw: unknown, skip: number[] = []): PerfexPlan {
  const tables = new Map<string, Row[]>()
  for (const entry of Array.isArray(raw) ? raw : []) {
    if (entry && entry.type === 'table' && Array.isArray(entry.data)) tables.set(String(entry.name), entry.data as Row[])
  }
  const prefix = [...tables.keys()].find(n => n.endsWith('clients'))?.replace(/clients$/, '') ?? 'tbl'
  const table = (name: string) => tables.get(prefix + name) ?? []
  const clients = table('clients')
  if (!clients.length) throw new Error(`Nincs ${prefix}clients tábla az exportban. Talált táblák: ${[...tables.keys()].slice(0, 12).join(', ') || 'nincs'}`)

  const skipSet = new Set(skip)
  const contacts = table('contacts')
  const projects = table('projects')
  const tasks = table('tasks')
  const comments = table('task_comments')
  const staffName = new Map(table('staff').map(s => [int(s.staffid), fullName(s)]))
  const contactName = new Map(contacts.map(c => [int(c.id), fullName(c)]))

  const contactsByClient = new Map<number | null, Row[]>()
  for (const c of contacts) contactsByClient.set(int(c.userid), [...(contactsByClient.get(int(c.userid)) ?? []), c])
  const primaryOf = (clientId: number | null) => {
    const list = contactsByClient.get(clientId) ?? []
    return list.find(c => str(c.is_primary) === '1') ?? list[0] ?? null
  }

  const customerRows = clients.filter(c => !skipSet.has(int(c.userid)!)).map(c => {
    const id = int(c.userid)!
    const primary = primaryOf(id)
    const company = plain(c.company)
    return {
      perfex_id: id,
      name: company ?? fullName(primary) ?? `Perfex partner #${id}`,
      company_name: company,
      is_company: !!str(c.vat) || !!company,
      email: str(primary?.email),
      phone: str(c.phonenumber) ?? str(primary?.phonenumber),
      contact_name: fullName(primary),
      address: [str(c.zip), str(c.city), plain(c.address)].filter(Boolean).join(' ') || null,
      billing_address: [str(c.billing_zip), str(c.billing_city), plain(c.billing_street)].filter(Boolean).join(' ') || null,
      tax_number: str(c.vat),
      website: str(c.website),
      status: str(c.active) === '0' ? 'former' : 'active',
      ...(ts(c.datecreated) ? { created_at: ts(c.datecreated) } : {}),
    }
  })
  const imported = new Set(customerRows.map(c => c.perfex_id))

  const contactRows = contacts.filter(c => imported.has(int(c.userid)!)).map(c => ({
    perfex_id: int(c.id),
    _client: int(c.userid),
    name: fullName(c) ?? str(c.email) ?? 'Kapcsolattartó',
    email: str(c.email),
    phone: str(c.phonenumber),
    position: plain(c.title),
    is_primary: primaryOf(int(c.userid))?.id === c.id,
  }))

  const projectRows = projects.filter(p => imported.has(int(p.clientid)!)).map(p => ({
    perfex_id: int(p.id),
    _client: int(p.clientid),
    name: plain(p.name) ?? `Projekt #${p.id}`,
    description: text(p.description),
    status: PROJECT_STATUS[int(p.status) ?? 2] ?? 'active',
    start_date: day(p.start_date),
    due_date: day(p.deadline),
    budget: num(p.project_cost) || null,
    ...(ts(p.project_created) ? { created_at: ts(p.project_created) } : {}),
  }))
  const projectClient = new Map(projectRows.map(p => [p.perfex_id, p._client]))

  const taskRows = tasks.flatMap(t => {
    const relType = str(t.rel_type)
    const relId = int(t.rel_id)
    const client = relType === 'customer' ? relId : relType === 'project' ? projectClient.get(relId) ?? null : null
    // Tasks of skipped partners are skipped too; tasks with no partner (lead, invoice) are kept as general tasks.
    if ((relType === 'customer' || relType === 'project') && (client === null || !imported.has(client))) return []
    return [{
      perfex_id: int(t.id),
      _client: client,
      _project: relType === 'project' ? relId : null,
      title: plain(t.name) ?? `Feladat #${t.id}`,
      description: text(t.description),
      status: TASK_STATUS[int(t.status) ?? 1] ?? 'todo',
      priority: TASK_PRIORITY[int(t.priority) ?? 2] ?? 'medium',
      due_date: ts(t.duedate),
      visibility: str(t.visible_to_client) === '1' ? 'partner' : 'internal',
      ...(ts(t.dateadded) ? { created_at: ts(t.dateadded) } : {}),
    }]
  })
  const importedTasks = new Set(taskRows.map(t => t.perfex_id))

  const commentRows = comments.filter(c => importedTasks.has(int(c.taskid)) && text(c.content)).map(c => ({
    perfex_id: int(c.id),
    _task: int(c.taskid),
    body: text(c.content),
    author_name: int(c.contact_id) ? contactName.get(int(c.contact_id)) ?? 'Partner' : staffName.get(int(c.staffid)) ?? 'Munkatárs',
    ...(ts(c.dateadded) ? { created_at: ts(c.dateadded) } : {}),
  }))

  const importedComments = new Set(commentRows.map(c => c.perfex_id))
  const fileRows: PerfexFile[] = table('files').flatMap(f => {
    const relType = str(f.rel_type)
    const relId = int(f.rel_id)
    const name = str(f.file_name)
    if (!name || str(f.external) || (relType !== 'task' && relType !== 'customer')) return []
    if (relType === 'task' && !importedTasks.has(relId)) return []
    if (relType === 'customer' && !imported.has(relId!)) return []
    const commentId = int(f.task_comment_id)
    return [{
      perfex_id: int(f.id)!,
      zip_key: perfexZipKey(relType === 'task' ? 'tasks' : 'clients', relId, name),
      file_name: name.normalize('NFC'),
      mime_type: str(f.filetype),
      visible_to_partner: str(f.visible_to_customer) === '1' || !!int(f.contact_id),
      author_name: int(f.contact_id) ? contactName.get(int(f.contact_id)) ?? 'Partner' : staffName.get(int(f.staffid)) ?? null,
      created_at: ts(f.dateadded),
      _task: relType === 'task' ? relId : null,
      _client: relType === 'customer' ? relId : null,
      _comment: commentId && importedComments.has(commentId) ? commentId : null,
    }]
  })

  const partners: PerfexPartnerSummary[] = clients.map(c => {
    const id = int(c.userid)!
    const projectIds = new Set(projects.filter(p => int(p.clientid) === id).map(p => int(p.id)))
    const own = tasks.filter(t => (str(t.rel_type) === 'project' && projectIds.has(int(t.rel_id))) || (str(t.rel_type) === 'customer' && int(t.rel_id) === id))
    return {
      perfexId: id,
      name: plain(c.company) ?? fullName(primaryOf(id)) ?? `#${id}`,
      active: str(c.active) !== '0',
      contacts: (contactsByClient.get(id) ?? []).length,
      projects: projects.filter(p => int(p.clientid) === id).map(p => plain(p.name) ?? `#${p.id}`),
      tasks: own.length,
      openTasks: own.filter(t => int(t.status) !== 5).length,
    }
  })

  return {
    partners,
    counts: { partners: customerRows.length, contacts: contactRows.length, projects: projectRows.length, tasks: taskRows.length, comments: commentRows.length, files: fileRows.length },
    customers: customerRows, contacts: contactRows, projects: projectRows, tasks: taskRows, comments: commentRows, files: fileRows,
  }
}

// ---------------------------------------------------------------- write
const strip = (row: Row) => Object.fromEntries(Object.entries(row).filter(([k]) => !k.startsWith('_')))
const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/\b(kft|bt|zrt|nyrt|kkt|ev)\b\.?/g, '').replace(/[^a-z0-9áéíóöőúüű]/g, '')

async function sync(supabase: SupabaseClient, table: string, rows: Row[], log: (line: string) => void) {
  const existing = new Map<number, string>()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select('id, perfex_id').not('perfex_id', 'is', null).range(from, from + 999)
    if (error) throw new Error(`${table}: ${error.message}`)
    data.forEach(r => existing.set(r.perfex_id, r.id))
    if (data.length < 1000) break
  }
  if (table === 'customers') {
    const { data, error } = await supabase.from('customers').select('id, name, company_name, perfex_id')
    if (error) throw new Error(`customers: ${error.message}`)
    for (const r of rows) {
      if (existing.has(r.perfex_id as number)) continue
      const match = data.find(c => c.perfex_id == null && [c.name, c.company_name].some(n => n && norm(n) === norm(r.name)))
      if (match) { existing.set(r.perfex_id as number, match.id); log(`Meglévő partner összekapcsolva: ${match.company_name || match.name}`) }
    }
  }
  const ids = new Map<number, string>()
  const toInsert = rows.filter(r => !existing.has(r.perfex_id as number))
  const toUpdate = rows.filter(r => existing.has(r.perfex_id as number))
  for (let i = 0; i < toInsert.length; i += 200) {
    const { data, error } = await supabase.from(table).insert(toInsert.slice(i, i + 200)).select('id, perfex_id')
    if (error) throw new Error(`${table} (új sorok): ${error.message}`)
    data.forEach(r => ids.set(r.perfex_id, r.id))
  }
  for (const row of toUpdate) {
    const id = existing.get(row.perfex_id as number)!
    const { error } = await supabase.from(table).update(row).eq('id', id)
    if (error) throw new Error(`${table} #${row.perfex_id}: ${error.message}`)
    ids.set(row.perfex_id as number, id)
  }
  log(`${table}: ${toInsert.length} új, ${toUpdate.length} frissítve`)
  return ids
}

/** Writes the plan with a service-role client. Order matters: partners → contacts → projects → tasks → comments. */
export async function writePerfexPlan(supabase: SupabaseClient, plan: PerfexPlan, log: (line: string) => void = () => {}) {
  const customerIds = await sync(supabase, 'customers', plan.customers, log)
  await sync(supabase, 'partner_contacts', plan.contacts.map(c => ({ ...strip(c), customer_id: customerIds.get(c._client as number) })), log)
  const projectIds = await sync(supabase, 'projects', plan.projects.map(p => ({ ...strip(p), customer_id: customerIds.get(p._client as number) })), log)
  const taskIds = await sync(supabase, 'tasks', plan.tasks.map(t => ({
    ...strip(t),
    customer_id: t._client != null ? customerIds.get(t._client as number) ?? null : null,
    project_id: t._project != null ? projectIds.get(t._project as number) ?? null : null,
  })), log)
  await sync(supabase, 'task_comments', plan.comments.map(c => ({ ...strip(c), task_id: taskIds.get(c._task as number) })).filter(c => c.task_id), log)
  return plan.counts
}

// ---------------------------------------------------------------- attachments
const FILE_BUCKET = 'task-files'

async function idsByPerfex(supabase: SupabaseClient, table: string, perfexIds: number[]) {
  const map = new Map<number, string>()
  const unique = [...new Set(perfexIds)]
  for (let i = 0; i < unique.length; i += 300) {
    const { data, error } = await supabase.from(table).select('id, perfex_id').in('perfex_id', unique.slice(i, i + 300))
    if (error) throw new Error(`${table}: ${error.message}`)
    data.forEach(r => map.set(r.perfex_id, r.id))
  }
  return map
}

const safeName = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.-]+/g, '_').slice(-120) || 'file'

/**
 * Records the attachments (after writePerfexPlan) and returns a signed upload URL for each file,
 * so the browser can upload the bytes straight to Supabase Storage (no serverless size limit).
 */
export async function preparePerfexFiles(supabase: SupabaseClient, plan: PerfexPlan) {
  const tasks = await idsByPerfex(supabase, 'tasks', plan.files.flatMap(f => (f._task != null ? [f._task] : [])))
  const comments = await idsByPerfex(supabase, 'task_comments', plan.files.flatMap(f => (f._comment != null ? [f._comment] : [])))
  const customers = await idsByPerfex(supabase, 'customers', plan.files.flatMap(f => (f._client != null ? [f._client] : [])))
  const existing = await idsByPerfex(supabase, 'task_attachments', plan.files.map(f => f.perfex_id))

  const uploads: { perfexId: number; zipKey: string; path: string; token: string; mimeType: string | null }[] = []
  for (const f of plan.files) {
    const taskId = f._task != null ? tasks.get(f._task) ?? null : null
    const customerId = f._client != null ? customers.get(f._client) ?? null : null
    if (!taskId && !customerId) continue
    const path = `perfex/${f.perfex_id}-${safeName(f.file_name)}`
    const row = {
      perfex_id: f.perfex_id, task_id: taskId, customer_id: customerId,
      comment_id: f._comment != null ? comments.get(f._comment) ?? null : null,
      storage_path: path, file_name: f.file_name, mime_type: f.mime_type,
      visible_to_partner: f.visible_to_partner, author_name: f.author_name,
      ...(f.created_at ? { created_at: f.created_at } : {}),
    }
    const id = existing.get(f.perfex_id)
    const { error } = id
      ? await supabase.from('task_attachments').update(row).eq('id', id)
      : await supabase.from('task_attachments').insert(row)
    if (error) throw new Error(`task_attachments #${f.perfex_id}: ${error.message}`)

    const { data, error: urlError } = await supabase.storage.from(FILE_BUCKET).createSignedUploadUrl(path, { upsert: true })
    if (urlError || !data) throw new Error(`Feltöltési link (${f.file_name}): ${urlError?.message ?? 'ismeretlen hiba'}`)
    uploads.push({ perfexId: f.perfex_id, zipKey: f.zip_key, path, token: data.token, mimeType: f.mime_type })
  }
  return uploads
}

/** Called by the browser after each upload to store the size. */
export async function markPerfexFileUploaded(supabase: SupabaseClient, perfexId: number, size: number) {
  await supabase.from('task_attachments').update({ size_bytes: size }).eq('perfex_id', perfexId)
}
