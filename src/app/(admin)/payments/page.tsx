import Link from 'next/link'
import { Plus } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaymentsList } from './PaymentsList'
import { SubscriptionsList } from './SubscriptionsList'

export const metadata = {
  title: 'Pénzügy | Weboldalas Admin',
}

export default async function FinancePage() {
  const supabase = await createClient()

  const [
    { data: payments },
    { data: subscriptions }
  ] = await Promise.all([
    supabase
      .from('payments')
      .select('*, customers(name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('subscriptions')
      .select('*, customers(name)')
      .order('created_at', { ascending: false })
  ])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pénzügy</h1>
          <p className="text-muted-foreground mt-1 text-sm hidden sm:block">
            Kezeld a befizetéseket és az előfizetéseket.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/payments/new">
            <Button variant="outline" size="sm" className="sm:size-default">
              <Plus className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Új Befizetés</span>
              <span className="sm:hidden">Befizetés</span>
            </Button>
          </Link>
          <Link href="/subscriptions/new">
            <Button size="sm" className="sm:size-default">
              <Plus className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Új Előfizetés</span>
              <span className="sm:hidden">Előfizetés</span>
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="payments" className="flex-1 sm:flex-initial">Befizetések</TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex-1 sm:flex-initial">Előfizetések</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <PaymentsList payments={payments || []} />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsList subscriptions={subscriptions || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
