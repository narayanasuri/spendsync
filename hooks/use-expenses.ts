import { Expense } from "@/lib/types"
import { formatDateToString } from "@/lib/utils"
import { useEffect, useState } from "react"

const DATE_NOW = new Date()
const DATE_MONTH_START = new Date(
  DATE_NOW.getFullYear(),
  DATE_NOW.getMonth(),
  1
)

export function useExpenses({
  from = DATE_NOW,
  to = DATE_MONTH_START,
  categoryId,
  paymentMethodId,
  limit = 200,
}: {
  from?: Date
  to?: Date
  categoryId?: string
  paymentMethodId?: string
  limit?: number
}) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const params = new URLSearchParams({ limit: limit.toString() })

  if (categoryId && categoryId !== "all") {
    params.set("category_id", categoryId)
  }

  if (paymentMethodId && paymentMethodId !== "all") {
    params.set("payment_mode_id", paymentMethodId)
  }

  if (from) {
    params.set("from", formatDateToString(from))
  }

  if (to) {
    params.set("to", formatDateToString(to))
  }

  useEffect(() => {
    setLoading(true)
    fetch(`/api/logs?${params}`)
      .then((res) => {
        if (!res.ok) {
          throw "Failed to load expenses"
        }
        return res.json()
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load expenses."
        )
      )
      .then((data) => {
        setExpenses(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [from, to, categoryId, paymentMethodId, limit])

  return {
    expenses,
    loading,
    error,
  }
}
