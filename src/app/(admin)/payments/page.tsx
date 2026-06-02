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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pénzügy</h1>
          <p className="text-muted-foreground mt-2">
            Kezeld a befizetéseket és az előfizetéseket.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/payments/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Új Befizetés
            </Button>
          </Link>
          <Link href="/subscriptions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Új Előfizetés
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Befizetések</TabsTrigger>
          <TabsTrigger value="subscriptions">Előfizetések</TabsTrigger>
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
