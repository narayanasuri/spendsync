"use client"

import { useEffect, useState, useCallback, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { Table, TableBody } from "@/components/ui/table"
import { TransactionItem } from "@/components/shared/transaction-item"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar } from "@/components/expenses/filter-bar"
import { ExpensesEmptyState } from "@/components/shared/expenses-empty-state"
import { Expense } from "@/lib/types"

const ALL = "all"

function ExpensesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Stable defaults — computed once on mount, not on every render
  const defaultFrom = useMemo(() => {
    const d = subDays(new Date(), 7)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  const defaultTo = useMemo(() => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  const fromParam = searchParams.get("from") ?? defaultFrom
  const toParam = searchParams.get("to") ?? defaultTo
  const categoryParam = searchParams.get("category") ?? ALL
  const paymentModeParam = searchParams.get("payment_mode") ?? ALL

  // Parse YYYY-MM-DD as local date (not UTC) for the calendar display
  function parseLocalDate(str: string): Date {
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d)
  }

  const dateRange: DateRange = {
    from: parseLocalDate(fromParam),
    to: parseLocalDate(toParam),
  }

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Push updated params to URL
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === ALL || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      router.replace(`/logs?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  function setDateRange(range: DateRange) {
    if (!range.from || !range.to) return
    // Send plain dates — API handles start/end of day in UTC
    const pad = (n: number) => String(n).padStart(2, "0")
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    updateParams({ from: fmt(range.from), to: fmt(range.to) })
  }

  function setCategory(value: string) {
    updateParams({ category: value })
  }

  function setPaymentMode(value: string) {
    updateParams({ payment_mode: value })
  }

  function handleClearFilters() {
    const params = new URLSearchParams()
    // Keep date range, clear category and payment_mode
    params.set("from", fromParam)
    params.set("to", toParam)
    router.replace(`/logs?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function fetchExpenses() {
      try {
        const params = new URLSearchParams({ limit: "200" })
        if (categoryParam !== ALL) params.set("category", categoryParam)
        if (paymentModeParam !== ALL)
          params.set("payment_mode", paymentModeParam)
        params.set("from", fromParam)
        params.set("to", toParam)

        const res = await fetch(`/api/logs?${params}`)
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
  }, [fromParam, toParam, categoryParam, paymentModeParam])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Transactions</h2>
        </div>

        <FilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={categoryParam}
          setCategory={setCategory}
          paymentMode={paymentModeParam}
          setPaymentMode={setPaymentMode}
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

export default function ExpensesPage() {
  return (
    <Suspense>
      <ExpensesContent />
    </Suspense>
  )
}
