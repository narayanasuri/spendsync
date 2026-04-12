import { ExpenseForm } from "@/components/add/expense-form/expense-form"

export default async function AddPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">New Expense</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill the form below and submit to add a new expense!
          </p>
        </div>

        <ExpenseForm />
      </main>
    </div>
  )
}
