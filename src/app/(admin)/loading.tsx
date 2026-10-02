export default function AdminLoading() {
  return <div className="admin-loading" role="status" aria-label="Adminoldal betöltése"><span className="sr-only">Az oldal betöltése folyamatban…</span><div className="admin-loading-line" aria-hidden="true" /><div className="dashboard-stats" aria-hidden="true">{Array.from({length:4}, (_, index) => <div key={index} className="admin-loading-panel" />)}</div><div className="admin-loading-panel" style={{height:300}} aria-hidden="true" /></div>
}
