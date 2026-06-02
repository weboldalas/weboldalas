'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createLead, updateLead } from './actions'
import { PIPELINE_STAGES } from './pipeline'
import Link from 'next/link'

const SOURCE_OPTIONS = [
  { value: 'hideg_hivas', label: '📞 Hideg hívás' },
  { value: 'hirdetes',    label: '📢 Hirdetés' },
  { value: 'email',       label: '✉️ Email kampány' },
  { value: 'ajanlas',     label: '🤝 Ajánlás' },
  { value: 'weboldal',    label: '🌐 Weboldal' },
  { value: 'egyeb',       label: '❓ Egyéb' },
]

const SERVICE_OPTIONS = [
  'Bemutatkozó weboldal',
  'Webshop',
  'Landing Page',
  'Foglalási rendszer',
  'CRM',
  'Egyéb',
]

export function LeadForm({ lead }: { lead?: any }) {
  const isEditing = !!lead
  const action = isEditing ? updateLead.bind(null, lead.id) : createLead
  const [state, formAction, pending] = useActionState(action, null)

  const [status, setStatus] = useState(lead?.status || 'felkeresendo')
  const [source, setSource] = useState(lead?.source || 'hideg_hivas')
  const [interestType, setInterestType] = useState(lead?.interest_type || '')

  const statusLabel = PIPELINE_STAGES.find(s => s.id === status)?.label ?? status
  const sourceLabel = SOURCE_OPTIONS.find(s => s.value === source)?.label ?? source

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{isEditing ? 'Adatok szerkesztése' : 'Új Érdeklődő'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">

          <div className="space-y-1">
            <Label htmlFor="name">Név *</Label>
            <Input id="name" name="name" defaultValue={lead?.name} required placeholder="pl. Kovács Péter" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" defaultValue={lead?.phone} placeholder="+36 30 123 4567" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={lead?.email} placeholder="pelda@email.hu" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="industry">Iparág / Vállalkozás típusa</Label>
            <Input id="industry" name="industry" defaultValue={lead?.industry} placeholder="pl. Fodrász, Fogorvos, Étterem..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Státusz</Label>
              <input type="hidden" name="status" value={status} />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue>{statusLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Forrás</Label>
              <input type="hidden" name="source" value={source} />
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue>{sourceLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Érdeklődés tárgya</Label>
            <input type="hidden" name="interest_type" value={interestType} />
            <Select value={interestType} onValueChange={setInterestType}>
              <SelectTrigger>
                <SelectValue>{interestType || <span className="text-muted-foreground">Melyik szolgáltatás?</span>}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">— Nincs megadva —</SelectItem>
                {SERVICE_OPTIONS.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="next_call_date">Következő visszahívás</Label>
            <Input
              id="next_call_date"
              name="next_call_date"
              type="datetime-local"
              defaultValue={lead?.next_call_date ? new Date(lead.next_call_date).toISOString().slice(0, 16) : ''}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">Belső megjegyzés</Label>
            <Textarea id="note" name="note" rows={3} defaultValue={lead?.note} placeholder="Egyéb infók..." />
          </div>

          {state?.error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'oklch(0.62 0.22 25 / 0.15)', border: '1px solid oklch(0.62 0.22 25 / 0.30)' }}>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.20 25)' }}>Hiba: {state.error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            {!isEditing && (
              <Link href="/leads">
                <Button variant="outline" type="button">Mégse</Button>
              </Link>
            )}
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
