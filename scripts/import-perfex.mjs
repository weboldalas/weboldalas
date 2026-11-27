#!/usr/bin/env node
/**
 * Imports partners, contacts, projects, tasks and task comments from Perfex CRM.
 *
 * Input: a phpMyAdmin JSON export of the Perfex database (Export → Custom → Format: JSON),
 * with at least these tables: tblclients, tblcontacts, tblprojects, tbltasks,
 * tbltask_comments, tblstaff. A different table prefix is detected automatically.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/import-perfex.mjs perfex.json            # dry run: prints what would happen
 *   node scripts/import-perfex.mjs perfex.json --write    # writes to Supabase
 *
 * Re-running is safe: rows are matched on perfex_id and updated instead of duplicated.
 * Requires migration 20261127100000_perfex_import.sql.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const [file, ...flags] = process.argv.slice(2)
const WRITE = flags.includes('--write')
if (!file) {
  console.error('Usage: node scripts/import-perfex.mjs <phpmyadmin-export.json> [--write]')
  process.exit(1)
}

// ---------------------------------------------------------------- read export
const raw = JSON.parse(readFileSync(file, 'utf8'))
const tables = new Map()
for (const entry of Array.isArray(raw) ? raw : []) {
  if (entry?.type === 'table' && Array.isArray(entry.data)) tables.set(entry.name, entry.data)
}
const prefix = [...tables.keys()].find(n => n.endsWith('clients'))?.replace(/clients$/, '') ?? 'tbl'
const table = name => tables.get(prefix + name) ?? []

const clients = table('clients')
const contacts = table('contacts')
const projects = table('projects')
const tasks = table('tasks')
const comments = table('task_comments')
const staff = table('staff')
if (!clients.length) {
  console.error(`No ${prefix}clients table found in ${file}. Tables found: ${[...tables.keys()].join(', ') || 'none'}`)
  process.exit(1)
}

// ---------------------------------------------------------------- helpers
const str = v => (v === null || v === undefined || String(v).trim() === '' ? null : String(v).trim())
const int = v => (str(v) === null ? null : Number.parseInt(v, 10))
const day = v => { const s = str(v); return s && !s.startsWith('0000') ? s.slice(0, 10) : null }
const ts = v => { const s = str(v); return s && !s.startsWith('0000') ? new Date(s.replace(' ', 'T') + (s.length > 10 ? 'Z' : 'T00:00:00Z')).toISOString() : null }
const num = v => (str(v) === null ? null : Number(v))
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
/** Perfex stores rich text as HTML; keep line breaks, drop tags. */
const text = v => {
  const s = str(v)
  if (!s) return null
  const plain = decode(s.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h\d)>/gi, '\n').replace(/<li[^>]*>/gi, '• ').replace(/<[^>]+>/g, ''))
  return plain.replace(/\n{3,}/g, '\n\n').trim() || null
}
const fullName = r => [str(r.firstname), str(r.lastname)].filter(Boolean).join(' ') || null

const PROJECT_STATUS = { 1: 'planned', 2: 'active', 3: 'on_hold', 4: 'completed', 5: 'cancelled' }
const TASK_STATUS = { 1: 'todo', 2: 'waiting', 3: 'in_progress', 4: 'in_progress', 5: 'done' }
const TASK_PRIORITY = { 1: 'low', 2: 'medium', 3: 'high', 4: 'urgent' }

// ---------------------------------------------------------------- supabase
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (WRITE && (!url || !key)) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to write.')
  process.exit(1)
}
const supabase = WRITE ? createClient(url, key, { auth: { persistSession: false } }) : null

/** Insert-or-update by perfex_id; returns Map(perfexId -> uuid). */
async function sync(tableName, rows) {
  const ids = new Map()
  if (!WRITE) {
    rows.forEach(r => ids.set(r.perfex_id, `dry-${tableName}-${r.perfex_id}`))
    console.log(`  ${tableName}: ${rows.length} row(s)${rows[0] ? `, first: ${JSON.stringify(rows[0])}` : ''}`)
    return ids
  }
  const existing = new Map()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(tableName).select('id, perfex_id').not('perfex_id', 'is', null).range(from, from + 999)
    if (error) throw new Error(`${tableName}: ${error.message}`)
    data.forEach(r => existing.set(r.perfex_id, r.id))
    if (data.length < 1000) break
  }
  const toInsert = rows.filter(r => !existing.has(r.perfex_id))
  const toUpdate = rows.filter(r => existing.has(r.perfex_id))
  for (let i = 0; i < toInsert.length; i += 200) {
    const { data, error } = await supabase.from(tableName).insert(toInsert.slice(i, i + 200)).select('id, perfex_id')
    if (error) throw new Error(`${tableName} insert: ${error.message}`)
    data.forEach(r => ids.set(r.perfex_id, r.id))
  }
  for (const row of toUpdate) {
    const id = existing.get(row.perfex_id)
    const { error } = await supabase.from(tableName).update(row).eq('id', id)
    if (error) throw new Error(`${tableName} update ${row.perfex_id}: ${error.message}`)
    ids.set(row.perfex_id, id)
  }
  console.log(`  ${tableName}: ${toInsert.length} new, ${toUpdate.length} updated`)
  return ids
}

// ---------------------------------------------------------------- build rows
const contactsByClient = new Map()
for (const c of contacts) {
  const list = contactsByClient.get(int(c.userid)) ?? []
  list.push(c)
  contactsByClient.set(int(c.userid), list)
}
const primaryOf = clientId => {
  const list = contactsByClient.get(clientId) ?? []
  return list.find(c => str(c.is_primary) === '1') ?? list[0] ?? null
}

const customerRows = clients.map(c => {
  const id = int(c.userid)
  const primary = primaryOf(id)
  const company = str(c.company)
  const address = [str(c.zip), str(c.city), str(c.address)].filter(Boolean).join(' ') || null
  return {
    perfex_id: id,
    name: company ?? fullName(primary ?? {}) ?? `Perfex partner #${id}`,
    company_name: company,
    is_company: !!str(c.vat) || !!company,
    email: str(primary?.email),
    phone: str(c.phonenumber) ?? str(primary?.phonenumber),
    contact_name: primary ? fullName(primary) : null,
    address,
    billing_address: [str(c.billing_zip), str(c.billing_city), str(c.billing_street)].filter(Boolean).join(' ') || null,
    tax_number: str(c.vat),
    website: str(c.website),
    status: str(c.active) === '0' ? 'former' : 'active',
    created_at: ts(c.datecreated) ?? undefined,
  }
})

const staffName = new Map(staff.map(s => [int(s.staffid), fullName(s)]))
const contactName = new Map(contacts.map(c => [int(c.id), fullName(c)]))

console.log(`Perfex export: ${clients.length} partners, ${contacts.length} contacts, ${projects.length} projects, ${tasks.length} tasks, ${comments.length} comments`)
console.log(WRITE ? 'Writing to Supabase…' : 'Dry run (add --write to import):')

const customerIds = await sync('customers', customerRows)

const contactRows = contacts
  .filter(c => customerIds.has(int(c.userid)))
  .map(c => ({
    perfex_id: int(c.id),
    customer_id: customerIds.get(int(c.userid)),
    name: fullName(c) ?? str(c.email) ?? 'Kapcsolattartó',
    email: str(c.email),
    phone: str(c.phonenumber),
    position: str(c.title),
    is_primary: primaryOf(int(c.userid))?.id === c.id,
  }))
await sync('partner_contacts', contactRows)

const projectRows = projects
  .filter(p => customerIds.has(int(p.clientid)))
  .map(p => ({
    perfex_id: int(p.id),
    customer_id: customerIds.get(int(p.clientid)),
    name: str(p.name) ?? `Projekt #${p.id}`,
    description: text(p.description),
    status: PROJECT_STATUS[int(p.status)] ?? 'active',
    start_date: day(p.start_date),
    due_date: day(p.deadline),
    budget: num(p.project_cost) || null,
    created_at: ts(p.project_created) ?? undefined,
  }))
const projectIds = await sync('projects', projectRows)
const projectCustomer = new Map(projectRows.map(p => [p.perfex_id, p.customer_id]))

const taskRows = tasks.map(t => {
  const relType = str(t.rel_type)
  const relId = int(t.rel_id)
  const projectId = relType === 'project' ? projectIds.get(relId) ?? null : null
  const customerId = relType === 'customer' ? customerIds.get(relId) ?? null : relType === 'project' ? projectCustomer.get(relId) ?? null : null
  return {
    perfex_id: int(t.id),
    title: str(t.name) ?? `Feladat #${t.id}`,
    description: text(t.description),
    status: TASK_STATUS[int(t.status)] ?? 'todo',
    priority: TASK_PRIORITY[int(t.priority)] ?? 'medium',
    due_date: ts(t.duedate),
    customer_id: customerId,
    project_id: projectId,
    visibility: str(t.visible_to_client) === '1' ? 'partner' : 'internal',
    created_at: ts(t.dateadded) ?? undefined,
  }
})
const taskIds = await sync('tasks', taskRows)

const commentRows = comments
  .filter(c => taskIds.has(int(c.taskid)) && text(c.content))
  .map(c => ({
    perfex_id: int(c.id),
    task_id: taskIds.get(int(c.taskid)),
    body: text(c.content),
    author_name: int(c.contact_id) ? contactName.get(int(c.contact_id)) ?? 'Partner' : staffName.get(int(c.staffid)) ?? 'Munkatárs',
    created_at: ts(c.dateadded) ?? undefined,
  }))
await sync('task_comments', commentRows)

const orphanProjects = projects.length - projectRows.length
const unlinkedTasks = taskRows.filter(t => !t.customer_id).length
console.log(`Done. Partners ${customerRows.length}, contacts ${contactRows.length}, projects ${projectRows.length}, tasks ${taskRows.length}, comments ${commentRows.length}.`)
if (orphanProjects) console.log(`  ${orphanProjects} project(s) skipped: their partner is missing from the export.`)
if (unlinkedTasks) console.log(`  ${unlinkedTasks} task(s) have no partner (e.g. linked to a lead or invoice in Perfex); imported as general tasks.`)
