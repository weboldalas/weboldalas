'use client'

import { useTransition } from 'react'
import { Loader2, Repeat } from 'lucide-react'
import { toast } from 'sonner'
import { generateRetainerInvoices } from './actions'

export function GenerateRetainersButton() {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      className="crm-btn crm-btn-secondary"
      disabled={pending}
      title="Minden aktív havidíjhoz létrehozza az e havi számlát, ha még nincs"
      onClick={() => startTransition(async () => {
        const result = await generateRetainerInvoices()
        if (result.error) toast.error(result.error)
        else if (!result.created) toast.info('Minden aktív havidíjnak van már e havi számlája.')
        else toast.success(`${result.created} havidíjas számla létrehozva`)
      })}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Repeat />} E havi havidíjak
    </button>
  )
}
