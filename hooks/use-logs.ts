"use client"

import { Expense } from "@/lib/types"
import { formatToLocalDate } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

const DATE_NOW = new Date()
const DATE_MONTH_START = new Date(
  DATE_NOW.getFullYear(),
  DATE_NOW.getMonth(),
  1
)

const PAGE_SIZE = 20

export const useLogs = ({
  from = DATE_MONTH_START,
  to = DATE_NOW,
  categoryId,
  paymentMethodId,
  transactionType,
  page = 0,
}: {
  from?: Date
  to?: Date
  categoryId?: string
  paymentMethodId?: string
  transactionType?: string
  page?: number
}) => {
  const [logs, setLogs] = useState<Expense[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (page === 0) {
      setLogs([])
      setHasMore(true)
    }

    // 2. Setup Params
    const params = new URLSearchParams({
      limit: PAGE_SIZE.toString(),
      page: page.toString(),
    })

    if (categoryId && categoryId !== "all")
      params.set("category_id", categoryId)
    if (paymentMethodId && paymentMethodId !== "all")
      params.set("payment_mode_id", paymentMethodId)
    if (transactionType && transactionType !== "all")
      params.set("transaction_type", transactionType)
    if (from) params.set("from", formatToLocalDate(from))
    if (to) params.set("to", formatToLocalDate(to))

    // 3. Fetching Logic
    setLoading(true)

    // Abort previous request if it's still running
    if (abortControllerRef.current) abortControllerRef.current.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    fetch(`/api/logs?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load expenses")
        return res.json()
      })
      .then((data: Expense[]) => {
        if (data.length < PAGE_SIZE) {
          setHasMore(false)
        }

        setLogs((prev) => (page === 0 ? data : [...prev, ...data]))
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setError(
          err instanceof Error ? err.message : "Failed to load expenses."
        )
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [from, to, categoryId, paymentMethodId, page, transactionType])

  return {
    logs,
    loading,
    error,
    hasMore,
  }
}
