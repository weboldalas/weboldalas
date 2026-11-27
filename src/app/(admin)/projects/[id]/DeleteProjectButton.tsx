'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProject } from '../actions'

export function DeleteProjectButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button type="button" className="crm-btn crm-btn-ghost crm-btn-sm" disabled={pending} onClick={() => {
      if (!window.confirm('Biztosan törlöd a projektet? A hozzá kötött számlák megmaradnak.')) return
      startTransition(async () => { const r = await deleteProject(id); if (r?.error) toast.error(r.error) })
    }}><Trash2 /> Projekt törlése</button>
  )
}
