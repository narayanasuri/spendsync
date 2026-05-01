"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryIcon } from "@/components/shared/category-icon"
import { ExpenseActionMenu } from "@/components/logs/details/action-menu"
import { LogNotFound } from "@/components/logs/details/log-not-found"
import { useAppStore } from "@/lib/store"
import { useCurrency } from "@/hooks/use-currency"
import { format } from "date-fns"
import type { Expense } from "@/lib/types"
import { parseTimestamp } from "@/lib/utils"
import { useBackButton } from "@/hooks/use-back-button"
import { useLogDrawerStore } from "@/lib/log-drawer-store"

const DETAIL_DATE_FORMAT = "EEEE, d MMMM yyyy"
const DETAIL_TIME_FORMAT = "h:mm a"

export default () => {
  const { id } = useParams<{ id: string }>()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { openDrawer, setEditingLog } = useLogDrawerStore()
  const back = useBackButton("/logs")

  const handleDelete = async () => {
    const res = await fetch(`/api/logs/${id}`, { method: "DELETE" })
    if (res.ok) back()
  }

  const editLog = useCallback(
    (expense: Expense) => {
      setEditingLog(expense)
      openDrawer()
    },
    [openDrawer, setEditingLog]
  )

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/logs/${id}`)
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
            onClick={() => back()}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          {expense && (
            <ExpenseActionMenu
              onEdit={() => editLog(expense)}
              onDelete={handleDelete}
            />
          )}
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : error ? (
          // <p className="py-12 text-center text-sm text-destructive">{error}</p>
          <LogNotFound />
        ) : expense ? (
          <ExpenseDetail expense={expense} />
        ) : null}
      </main>
    </div>
  )
}

const ExpenseDetail = ({ expense }: { expense: Expense }) => {
  const categoryId = expense.category
  const paymentModeId = expense.payment_mode
  const paidBy = expense.paid_by
  const { categories, paymentMethods, users } = useAppStore()
  const { currency } = useCurrency()

  const date = parseTimestamp(expense.spent_at)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <CategoryIcon categoryId={categoryId} onlyIcon={false} size={48} />
        <div className="flex-1">
          <h2 className="overflow-hidden text-xl font-semibold tracking-tight text-ellipsis">
            {expense.name}
          </h2>
          {expense.description && (
            <p className="text-md mt-1 text-muted-foreground">
              {expense.description}
            </p>
          )}
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {currency.symbol}
          {Number(expense.amount)}
        </p>
      </div>

      {/* Details */}
      <div className="divide-y divide-border rounded-xl border border-border">
        <DetailRow
          label="Category"
          value={categories.find((c) => c.id === categoryId)?.name || "Unknown"}
        />
        <DetailRow
          label="Payment Mode"
          value={
            paymentMethods.find((p) => p.id === paymentModeId)?.name ||
            "Unknown"
          }
        />
        <DetailRow
          label="Paid By"
          value={users.find((u) => u.id === paidBy)?.name || "Unknown"}
        />
        <DetailRow label="Date" value={format(date, DETAIL_DATE_FORMAT)} />
        <DetailRow label="Time" value={format(date, DETAIL_TIME_FORMAT)} />
      </div>
    </div>
  )
}

const DetailRow = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

const DetailSkeleton = () => {
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
