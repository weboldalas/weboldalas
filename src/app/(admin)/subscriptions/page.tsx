import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { SubscriptionsList } from '@/app/(admin)/payments/SubscriptionsList'

export const metadata = {
  title: 'Előfizetések | Weboldalas Admin',
}

export default async function SubscriptionsPage() {
  const supabase = await createClient()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Előfizetések</h1>
          <p className="text-muted-foreground mt-2">
            Aktív és korábbi előfizetések áttekintése.
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Új Előfizetés
          </Button>
        </Link>
      </div>

      <SubscriptionsList subscriptions={subscriptions || []} />
    </div>
  )
}
