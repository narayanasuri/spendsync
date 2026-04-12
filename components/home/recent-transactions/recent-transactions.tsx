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
import { TransactionItem } from "../../shared/transaction-item"
import type { Tables } from "@/lib/database.types"
import { CategoryEnum, PaymentModeEnum } from "@/lib/enums"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import type { DateRange } from "@/lib/utils"
import { ExpensesEmptyState } from "@/components/shared/expenses-empty-state"

type Expense = Tables<"Expenses">

export function RecentTransactions({ dateRange }: { dateRange: DateRange }) {
  const [transactions, setTransactions] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function fetchTransactions() {
      try {
        const params = new URLSearchParams({
          limit: "5",
          from: dateRange.from,
          to: dateRange.to,
        })
        const res = await fetch(`/api/expenses?${params}`)
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to load transactions.")
          return
        }

        setTransactions(json)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [dateRange.from, dateRange.to])

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest account activity</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/expenses">Show All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-sm" />
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
          <p className="py-6 text-center text-sm text-destructive">{error}</p>
        ) : transactions.length === 0 ? (
          <ExpensesEmptyState />
        ) : (
          <Table>
            <TableBody>
              {transactions.map((t) => (
                <TransactionItem
                  key={t.id}
                  name={t.name}
                  description={t.description}
                  category={t.category as CategoryEnum}
                  payment_mode={t.payment_mode as PaymentModeEnum}
                  amount={Number(t.amount)}
                  spent_at={t.spent_at}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
