'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckSquare, MessageSquare, Paperclip } from 'lucide-react'
import { CardHeader, EmptyState, StatusBadge } from '@/components/crm/ui'
import { formatDate } from '@/lib/crm/format'
import { TASK_OPEN_STATUSES, TASK_PRIORITY, TASK_STATUS } from '@/lib/crm/status'

type Task = { id: string; title: string; status: string; priority: string; due_date: string | null; comments: number; files: number }

export function ProjectTasks({ tasks, today }: { tasks: Task[]; today: string }) {
  const open = tasks.filter(t => TASK_OPEN_STATUSES.includes(t.status))
  const [tab, setTab] = useState<'open' | 'done'>(open.length ? 'open' : 'done')
  const list = tab === 'open' ? open : tasks.filter(t => !TASK_OPEN_STATUSES.includes(t.status))

  return (
    <section className="crm-card">
      <CardHeader title={`Feladatok (${tasks.length})`} icon={CheckSquare} />
      <div className="px-4 pt-3 sm:px-5">
        <div className="crm-segmented" role="group" aria-label="Feladatok szűrése">
          <button type="button" className={tab === 'open' ? 'is-active' : ''} aria-pressed={tab === 'open'} onClick={() => setTab('open')}>Nyitott ({open.length})</button>
          <button type="button" className={tab === 'done' ? 'is-active' : ''} aria-pressed={tab === 'done'} onClick={() => setTab('done')}>Lezárt ({tasks.length - open.length})</button>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={CheckSquare} title={tab === 'open' ? 'Nincs nyitott feladat' : 'Még nincs lezárt feladat'} />
      ) : (
        <div className="crm-list mt-2">
          {list.map(t => {
            const st = TASK_STATUS[t.status] ?? TASK_STATUS.todo
            const pr = TASK_PRIORITY[t.priority]
            const late = t.due_date && t.due_date.slice(0, 10) < today && TASK_OPEN_STATUSES.includes(t.status)
            return (
              <Link key={t.id} href={`/tasks/${t.id}`} className="crm-row">
                <span className="crm-row-main">
                  <strong>{t.title}</strong>
                  <span className="inline-flex flex-wrap items-center gap-x-3">
                    {t.due_date && <span style={{ color: late ? 'var(--danger)' : undefined }}>{formatDate(t.due_date)}</span>}
                    {t.comments > 0 && <span className="inline-flex items-center gap-1"><MessageSquare size={12} />{t.comments}</span>}
                    {t.files > 0 && <span className="inline-flex items-center gap-1"><Paperclip size={12} />{t.files}</span>}
                  </span>
                </span>
                <span className="crm-row-end" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {pr && (t.priority === 'high' || t.priority === 'urgent') && <StatusBadge label={pr.label} tone={pr.tone} dot={false} />}
                  <StatusBadge label={st.label} tone={st.tone} />
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
