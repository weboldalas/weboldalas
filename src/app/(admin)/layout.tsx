import { Sidebar } from '@/components/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr] overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <main className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-5 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
