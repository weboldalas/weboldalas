import { LeadForm } from '../LeadForm'

export default function NewLeadPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Új Érdeklődő</h1>
      </div>
      <LeadForm />
    </div>
  )
}
