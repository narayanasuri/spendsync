import { TotalItem } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"

const DATE_NOW = new Date()
const DATE_MONTH_START = new Date(
  DATE_NOW.getFullYear(),
  DATE_NOW.getMonth(),
  1
)

export function useTotal({
  from = DATE_MONTH_START,
  to = DATE_NOW,
  categoryId,
  paymentId,
  limit = 200,
}: {
  from?: Date
  to?: Date
  categoryId?: string
  paymentId?: string
  limit?: number
}) {
  const [totals, setTotals] = useState<TotalItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const params = useMemo<URLSearchParams>(() => {
    const p = new URLSearchParams({ limit: limit.toString() })
    if (categoryId && categoryId !== "all") {
      p.set("categoryId", categoryId)
    }
    if (paymentId && paymentId !== "all") {
      p.set("paymentId", paymentId)
    }
    if (from) {
      p.set("from", formatDate(from))
    }
    if (to) {
      p.set("to", formatDate(to))
    }
    return p
  }, [categoryId, from, limit, to])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/logs/total?${params}`)
      .then((res) => {
        if (!res.ok) {
          throw "Failed to load total."
        }
        return res.json()
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load total.")
      )
      .then((data) => {
        setTotals(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params, setLoading, setTotals])

  return {
    totals,
    loading,
    error,
  }
}
