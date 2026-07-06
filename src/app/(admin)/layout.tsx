import { Sidebar } from '@/components/Sidebar'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-6 p-5 lg:p-8 min-h-screen">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(222 25% 14%)',
            border: '1px solid hsl(222 20% 22%)',
            color: 'white',
          },
        }}
      />
    </div>
  )
}
