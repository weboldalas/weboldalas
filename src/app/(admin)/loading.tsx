export default function AdminLoading() {
  return (
    <div className="crm-page" role="status" aria-label="Betöltés">
      <span className="sr-only">Az oldal betöltése folyamatban…</span>
      <div aria-hidden="true" className="crm-skeleton" style={{ width: 260, height: 34 }} />
      <div aria-hidden="true" className="crm-grid crm-grid-kpi">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="crm-skeleton" style={{ height: 112, borderRadius: 16 }} />)}
      </div>
      <div aria-hidden="true" className="crm-skeleton" style={{ height: 320, borderRadius: 16 }} />
    </div>
  )
}
