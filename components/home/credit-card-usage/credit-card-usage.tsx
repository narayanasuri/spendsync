"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody } from "@/components/ui/table"
import { CreditLimit } from "./credit-limit"
import { Skeleton } from "@/components/ui/skeleton"
import type { DateRange } from "@/lib/utils"
import { CARD_LIMITS } from "@/lib/constants"

type PaymentModeSummary = { payment_mode: string; total: number }

export function CreditCardUsage({ dateRange }: { dateRange: DateRange }) {
  const [data, setData] = useState<PaymentModeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function fetchSummary() {
      try {
        const params = new URLSearchParams({
          group_by: "payment_mode",
          from: dateRange.from,
          to: dateRange.to,
        })
        const res = await fetch(`/api/expenses/summary?${params}`)
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to load credit card data.")
          return
        }

        setData(json)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load credit card data."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [dateRange.from, dateRange.to])

  const creditModes = Object.keys(CARD_LIMITS)

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Credit Card Usage</CardTitle>
        <CardDescription>Credit card usage vs limits</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-sm" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-destructive">{error}</p>
        ) : (
          <Table>
            <TableBody>
              {creditModes.map((mode) => {
                const spent =
                  data.find((d) => d.payment_mode === mode)?.total ?? 0
                return <CreditLimit key={mode} mode={mode} spent={spent} />
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
