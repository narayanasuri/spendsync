"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryIcon } from "@/components/shared/category-icon"
import { BankIcon } from "@/components/shared/bank-icon"
import { EditExpenseForm } from "@/components/expenses/edit-expense-form"
import { CATEGORY_LABEL, PAYMENT_MODE_LABEL } from "@/lib/constants"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"
import { abbreviate } from "@/lib/utils"
import type { Tables } from "@/lib/database.types"
import { ExpenseActionMenu } from "@/components/expenses/details/action-menu"
import { ExpenseNotFound } from "@/components/expenses/details/expense-not-found"

type Expense = Tables<"Expenses">

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  async function handleDelete() {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (res.ok) router.push("/expenses")
  }

  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await fetch(`/api/expenses/${id}`)
        const json = await res.json()
        if (!res.ok) {
          setError(json.error ?? "Failed to load expense.")
          return
        }
        setExpense(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load expense.")
      } finally {
        setLoading(false)
      }
    }
    fetchExpense()
  }, [id])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5"
            onClick={() => router.push("/expenses")}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          {expense && !editing && (
            <ExpenseActionMenu
              onEdit={() => setEditing(true)}
              onDelete={handleDelete}
            />
          )}
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : error ? (
          // <p className="py-12 text-center text-sm text-destructive">{error}</p>
          <ExpenseNotFound />
        ) : expense ? (
          editing ? (
            <EditExpenseForm
              expense={expense}
              onSave={(updated) => {
                setExpense(updated)
                setEditing(false)
              }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <ExpenseDetail expense={expense} />
          )
        ) : null}
      </main>
    </div>
  )
}

function ExpenseDetail({ expense }: { expense: Expense }) {
  const category = expense.category as CategoryEnum
  const paymentMode = expense.payment_mode as PaymentModeEnum

  const date = new Date(expense.spent_at).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const time = new Date(expense.spent_at).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <CategoryIcon category={category} onlyIcon={false} size={48} />
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {expense.name}
          </h2>
          {expense.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {expense.description}
            </p>
          )}
        </div>
        <p className="text-2xl font-bold tabular-nums">
          ₹{abbreviate(Number(expense.amount))}
        </p>
      </div>

      {/* Details */}
      <div className="divide-y divide-border rounded-xl border border-border">
        <DetailRow
          label="Category"
          value={CATEGORY_LABEL[category] ?? category}
        />
        <DetailRow
          label="Payment Mode"
          value={
            <div className="flex items-center gap-2">
              <BankIcon mode={paymentMode} size="small" />
              <span>{PAYMENT_MODE_LABEL[paymentMode] ?? paymentMode}</span>
            </div>
          }
        />
        <DetailRow label="Date" value={date} />
        <DetailRow label="Time" value={time} />
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="divide-y divide-border rounded-xl border border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
