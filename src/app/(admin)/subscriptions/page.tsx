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
    <div className="flex flex-col gap-5 sm:gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Előfizetések</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Aktív és korábbi előfizetések áttekintése.
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button size="sm" className="sm:size-default shrink-0">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Új Előfizetés</span>
            <span className="sm:hidden">Új</span>
          </Button>
        </Link>
      </div>

      <SubscriptionsList subscriptions={subscriptions || []} />
    </div>
  )
}
