#!/usr/bin/env node
/**
 * Command-line version of the Perfex import (the same logic as Beállítások → Perfex import).
 *
 *   node scripts/import-perfex.mjs perfex.json              # dry run: prints what would be imported
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/import-perfex.mjs perfex.json --write      # writes to Supabase
 *   --skip=1,5                                              # leave out these Perfex client ids
 *
 * Needs Node 22.18+ (loads the TypeScript module directly).
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { parsePerfexExport, writePerfexPlan } from '../src/lib/crm/perfex-import.ts'

const [file, ...flags] = process.argv.slice(2)
if (!file) { console.error('Usage: node scripts/import-perfex.mjs <export.json> [--write] [--skip=1,2]'); process.exit(1) }
const skip = (flags.find(f => f.startsWith('--skip='))?.slice(7) ?? '').split(',').filter(Boolean).map(Number)
const plan = parsePerfexExport(JSON.parse(readFileSync(file, 'utf8')), skip)

for (const p of plan.partners) {
  console.log(`${skip.includes(p.perfexId) ? 'SKIP ' : ''}#${p.perfexId} ${p.name}: ${p.contacts} contact(s), ${p.projects.length} project(s), ${p.tasks} task(s) (${p.openTasks} open)`)
}
console.log('Total:', plan.counts)

if (flags.includes('--write')) {
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env
  if (!url || !key) { console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1) }
  await writePerfexPlan(createClient(url, key, { auth: { persistSession: false } }), plan, line => console.log(' ', line))
  console.log('Done.')
} else {
  console.log('Dry run. Add --write to import.')
}
