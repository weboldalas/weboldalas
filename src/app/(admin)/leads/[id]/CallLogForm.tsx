'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createLeadNote } from '../actions'
import { Phone, FileText, Mail, Users } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: 'call',    label: 'Telefonhívás',  icon: '📞' },
  { value: 'email',   label: 'Email',          icon: '✉️' },
  { value: 'meeting', label: 'Személyes',      icon: '🤝' },
  { value: 'note',    label: 'Megjegyzés',     icon: '📝' },
]

const OUTCOME_OPTIONS = [
  { value: 'elerte',        label: 'Elértem' },
  { value: 'nem_vette_fel', label: 'Nem vette fel' },
  { value: 'visszahiv',     label: 'Visszahív' },
  { value: 'nem_erdekli',   label: 'Nem érdekli' },
  { value: 'kesobb',        label: 'Később érdeklődik' },
  { value: 'egyeb',         label: 'Egyéb' },
]

export function CallLogForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState(createLeadNote, null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        const res = await formAction(fd)
        if ((res as any)?.success) formRef.current?.reset()
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-white/50">Típus</Label>
          <Select name="type" defaultValue="call">
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.icon} {o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-white/50">Eredmény</Label>
          <Select name="outcome" defaultValue="">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Válassz..." />
            </SelectTrigger>
            <SelectContent>
              {OUTCOME_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-white/50">Megjegyzés *</Label>
        <Textarea name="body" rows={3} placeholder="Mi történt a hívás során?" required />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-white/50">Következő visszahívás (opcionális)</Label>
        <Input name="next_action_date" type="datetime-local" className="h-9" />
      </div>

      {state?.error && (
        <p className="text-sm" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Mentés...' : '+ Bejegyzés hozzáadása'}
      </Button>
    </form>
  )
}
