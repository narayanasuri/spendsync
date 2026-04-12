"use client"

import { useEffect, useState } from "react"
import { type DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { Table, TableBody } from "@/components/ui/table"
import { TransactionItem } from "@/components/shared/transaction-item"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"
import type { Tables } from "@/lib/database.types"
import { FilterBar } from "@/components/expenses/filter-bar"
import { ExpensesEmptyState } from "@/components/shared/expenses-empty-state"

type Expense = Tables<"Expenses">

const ALL = "all"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<string>(ALL)
  const [paymentMode, setPaymentMode] = useState<string>(ALL)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return
    setLoading(true)
    setError(null)

    async function fetchExpenses() {
      try {
        const params = new URLSearchParams({ limit: "200" })
        if (category !== ALL) params.set("category", category)
        if (paymentMode !== ALL) params.set("payment_mode", paymentMode)
        params.set("from", dateRange.from!.toISOString())
        params.set("to", dateRange.to!.toISOString())

        const res = await fetch(`/api/expenses?${params}`)
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to load expenses.")
          return
        }

        setExpenses(json)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load expenses."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [category, paymentMode, dateRange.from, dateRange.to])

  function handleClearFilters() {
    setCategory(ALL)
    setPaymentMode(ALL)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Expenses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All your recorded expenses
          </p>
        </div>

        <FilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={category}
          setCategory={setCategory}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          onClear={handleClearFilters}
        />

        {/* Results */}
        {loading ? (
          <div className="mt-3 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-destructive">{error}</p>
        ) : expenses.length === 0 ? (
          <ExpensesEmptyState />
        ) : (
          <Table>
            <TableBody>
              {expenses.map((e) => (
                <TransactionItem
                  key={e.id}
                  name={e.name}
                  description={e.description}
                  category={e.category as CategoryEnum}
                  payment_mode={e.payment_mode as PaymentModeEnum}
                  amount={Number(e.amount)}
                  spent_at={e.spent_at}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}
