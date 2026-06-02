import { CustomerForm } from '../CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Új Ügyfél</h1>
      </div>
      <CustomerForm />
    </div>
  )
}
