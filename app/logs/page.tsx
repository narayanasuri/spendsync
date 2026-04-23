"use client"

import { Table, TableBody } from "@/components/ui/table"
import { LogItem } from "@/components/shared/log-item"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar } from "@/components/logs/filter-bar"
import { LogsEmptyState } from "@/components/shared/logs-empty-state"
import { useLogs } from "@/hooks/use-logs"
import { Suspense, useCallback, useEffect, useMemo } from "react"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"
import { formatDate, parseDate } from "@/lib/utils"

const ALL = "all"
const PARAM_CATEGORY = "categoryId"
const PARAM_PAYMENT_METHOD = "paymentMethodId"
const PARAM_FROM = "from"
const PARAM_TO = "to"

function LogsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const DATE_NOW = new Date()
  const DATE_MONTH_START = new Date(
    DATE_NOW.getFullYear(),
    DATE_NOW.getMonth(),
    1
  )

  const fromParam = searchParams.get(PARAM_FROM)
  const toParam = searchParams.get(PARAM_TO)
  const categoryParam = searchParams.get(PARAM_CATEGORY) ?? ALL
  const paymentMethodParam = searchParams.get(PARAM_PAYMENT_METHOD) ?? ALL

  const dateFrom = useMemo<Date>(
    () => (fromParam ? parseDate(fromParam) : DATE_MONTH_START),
    [fromParam]
  )

  const dateTo = useMemo<Date>(
    () => (toParam ? parseDate(toParam) : DATE_NOW),
    [toParam]
  )

  const { logs, loading, error } = useLogs({
    from: dateFrom,
    to: dateTo,
    categoryId: categoryParam,
    paymentMethodId: paymentMethodParam,
  })

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

  const updateDateRange = useCallback(
    (range: DateRange) => {
      if (range.from && range.to) {
        updateParams({
          [PARAM_FROM]: formatDate(range.from),
          [PARAM_TO]: formatDate(range.to),
        })
      }
    },
    [updateParams]
  )

  const updateCategory = useCallback(
    (categoryId: string) => {
      updateParams({
        [PARAM_CATEGORY]: categoryId,
      })
    },
    [updateParams]
  )

  const updatePaymentMethod = useCallback(
    (paymentMethodId: string) => {
      updateParams({
        [PARAM_PAYMENT_METHOD]: paymentMethodId,
      })
    },
    [updateParams]
  )

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams()
    // Keep date range, clear category and payment_mode
    params.set(PARAM_FROM, formatDate(dateFrom))
    params.set(PARAM_TO, formatDate(dateTo))
    router.replace(`/logs?${params.toString()}`, { scroll: false })
  }, [])

  useEffect(() => {
    if (!fromParam && !toParam) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(PARAM_FROM, formatDate(DATE_MONTH_START))
      params.set(PARAM_TO, formatDate(DATE_NOW))
      router.replace(`/logs?${params.toString()}`, { scroll: false })
    }
  }, [fromParam, toParam])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Logs</h2>
        </div>

        <FilterBar
          dateRange={{ from: dateFrom, to: dateTo }}
          setDateRange={updateDateRange}
          category={categoryParam}
          setCategory={updateCategory}
          paymentMode={paymentMethodParam}
          setPaymentMode={updatePaymentMethod}
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
        ) : logs.length === 0 ? (
          <LogsEmptyState />
        ) : (
          <Table>
            <TableBody>
              {logs.map((log) => (
                <LogItem key={log.id} log={log} />
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}

export default function LogsPage() {
  return (
    <Suspense>
      <LogsContent />
    </Suspense>
  )
}
