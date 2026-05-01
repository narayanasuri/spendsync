"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar } from "@/components/logs/filter-bar"
import { LogsEmptyState } from "@/components/logs/logs-empty-state"
import { useLogs } from "@/hooks/use-logs"
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"
import { formatToLocalDate, parseLocalDate } from "@/lib/utils"
import { DatedLogs } from "@/components/logs/dated-logs"

const ALL = "all"
const PARAM_CATEGORY = "categoryId"
const PARAM_PAYMENT_METHOD = "paymentMethodId"
const PARAM_FROM = "from"
const PARAM_TO = "to"
const PARAM_TRANSACTION_TYPE = "type"

const LogsContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- Infinite Scroll State ---
  const observerTarget = useRef<HTMLDivElement>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const fromParam = searchParams.get(PARAM_FROM)
  const toParam = searchParams.get(PARAM_TO)
  const categoryParam = searchParams.get(PARAM_CATEGORY) ?? ALL
  const paymentMethodParam = searchParams.get(PARAM_PAYMENT_METHOD) ?? ALL
  const typeParam = searchParams.get(PARAM_TRANSACTION_TYPE) ?? ALL

  const dateFrom = useMemo(
    () =>
      fromParam
        ? parseLocalDate(fromParam)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    [fromParam]
  )

  const dateTo = useMemo(
    () => (toParam ? parseLocalDate(toParam) : new Date()),
    [toParam]
  )

  const { logs, loading, error, hasMore, fetchNextPage, isFetchingNextPage } =
    useLogs({
      from: dateFrom,
      to: dateTo,
      categoryId: categoryParam,
      paymentMethodId: paymentMethodParam,
      transactionType: typeParam,
    })

  // --- Navigation Handlers ---
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === ALL || value === "") params.delete(key)
        else params.set(key, value)
      })
      router.replace(`/logs?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const updateDateRange = useCallback(
    (range: DateRange) => {
      if (range.from && range.to) {
        updateParams({
          [PARAM_FROM]: formatToLocalDate(range.from),
          [PARAM_TO]: formatToLocalDate(range.to),
        })
      }
    },
    [updateParams]
  )

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams()
    params.set(PARAM_FROM, formatToLocalDate(dateFrom))
    params.set(PARAM_TO, formatToLocalDate(dateTo))
    router.replace(`/logs?${params.toString()}`, { scroll: false })
  }, [dateFrom, dateTo, router])

  // Initialize URL params with default values on first render
  useEffect(() => {
    setIsHydrated(true)

    // If no date params exist, set them to the default values
    if (!fromParam || !toParam) {
      const params = new URLSearchParams(searchParams.toString())
      if (!fromParam) {
        params.set(PARAM_FROM, formatToLocalDate(dateFrom))
      }
      if (!toParam) {
        params.set(PARAM_TO, formatToLocalDate(dateTo))
      }
      router.replace(`/logs?${params.toString()}`, { scroll: false })
    }
  }, []) // Empty deps - only run once on mount

  // --- Intersection Observer Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Logs</h2>
        </div>

        {!isHydrated ? (
          <div className="mt-3 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <LogSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <FilterBar
              dateRange={{ from: dateFrom, to: dateTo }}
              setDateRange={updateDateRange}
              category={categoryParam}
              setCategory={(id) => updateParams({ [PARAM_CATEGORY]: id })}
              paymentMode={paymentMethodParam}
              setPaymentMode={(id) =>
                updateParams({ [PARAM_PAYMENT_METHOD]: id })
              }
              transactionType={typeParam}
              setTransactionType={(type) =>
                updateParams({ [PARAM_TRANSACTION_TYPE]: type })
              }
              onClear={handleClearFilters}
            />

            {/* Initial Full Page Loading */}
            {loading ? (
              <div className="mt-3 flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <LogSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <p className="py-12 text-center text-sm text-destructive">
                {error}
              </p>
            ) : logs.length === 0 ? (
              <LogsEmptyState />
            ) : (
              <>
                <DatedLogs logs={logs} />

                {/* The Infinite Scroll Trigger */}
                <div
                  ref={observerTarget}
                  className="mt-6 flex h-20 w-full items-center justify-center"
                >
                  {isFetchingNextPage && (
                    <div className="flex w-full flex-col gap-3">
                      <LogSkeleton />
                      <LogSkeleton />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

const LogSkeleton = () => {
  return (
    <div className="flex items-center gap-3">
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
  )
}

export default () => {
  return (
    <Suspense fallback={null}>
      <LogsContent />
    </Suspense>
  )
}
