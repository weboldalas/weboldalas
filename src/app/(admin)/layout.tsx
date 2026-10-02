import { Sidebar } from '@/components/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">
    <a href="#admin-main" className="admin-skip-link">Ugrás a tartalomra</a>
    <Sidebar />
    <div className="admin-workspace-main"><AdminHeader /><main id="admin-main" tabIndex={-1} className="admin-main"><div className="admin-content">{children}</div></main></div>
  </div>
}
