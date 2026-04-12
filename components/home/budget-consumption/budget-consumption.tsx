"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BudgetTile } from "./budget-tile"
import { Skeleton } from "@/components/ui/skeleton"
import type { DateRange } from "@/lib/utils"
import { BUDGET_LIMITS } from "@/lib/constants"

type CategorySummary = { category: string; total: number }

export function BudgetConsumption({ dateRange }: { dateRange: DateRange }) {
  const [data, setData] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function fetchSummary() {
      try {
        const params = new URLSearchParams({
          group_by: "category",
          from: dateRange.from,
          to: dateRange.to,
        })
        const res = await fetch(`/api/expenses/summary?${params}`)
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to load budget data.")
          return
        }

        setData(json)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load budget data."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [dateRange.from, dateRange.to])

  const budgetCategories = Object.keys(BUDGET_LIMITS)

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Budget Consumption</CardTitle>
        <CardDescription>Amount used out of allocated budgets</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-3 sm:flex-1"
              >
                <Skeleton className="size-12 shrink-0 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-destructive">{error}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {budgetCategories.map((category) => {
              const spent =
                data.find((d) => d.category === category)?.total ?? 0
              return (
                <BudgetTile
                  key={category}
                  category={category}
                  spent={spent}
                  budget={BUDGET_LIMITS[category]!}
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
