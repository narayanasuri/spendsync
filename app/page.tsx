"use client"

import { Table, TableBody } from "@/components/ui/table"
import { TransactionItem } from "@/components/shared/transaction-item"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar } from "@/components/expenses/filter-bar"
import { ExpensesEmptyState } from "@/components/shared/expenses-empty-state"
import { useExpenses } from "@/hooks/use-expenses"
import { useState } from "react"
import { DateRange } from "react-day-picker"

const ALL = "all"

export default function ExpensesPage() {
  const DATE_NOW = new Date()
  const DATE_MONTH_START = new Date(
    DATE_NOW.getFullYear(),
    DATE_NOW.getMonth(),
    1
  )
  const [dateRange, setDateRange] = useState<DateRange>({
    from: DATE_MONTH_START,
    to: DATE_NOW,
  })
  const [categoryId, setCategoryId] = useState<string>(ALL)
  const [paymentModeId, setPaymentModeId] = useState<string>(ALL)

  const { expenses, loading, error } = useExpenses({
    from: dateRange.from,
    to: dateRange.to,
    categoryId: categoryId,
    paymentMethodId: paymentModeId,
  })

  const handleClearFilters = () => {
    setCategoryId(ALL)
    setPaymentModeId(ALL)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Logs</h2>
        </div>

        <FilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={categoryId}
          setCategory={setCategoryId}
          paymentMode={paymentModeId}
          setPaymentMode={setPaymentModeId}
          onClear={handleClearFilters}
        />

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
              {expenses.map((expense) => (
                <TransactionItem key={expense.id} expense={expense} />
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}
