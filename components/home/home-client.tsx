"use client"

import { useState } from "react"
import { TimeRangeEnum } from "@/lib/enums"
import { resolveDateRange, type DateRange } from "@/lib/utils"
import { TimeRangeSelect } from "@/components/home/time-range-select"
import { BudgetConsumption } from "@/components/home/budget-consumption/budget-consumption"
import { CreditCardUsage } from "@/components/home/credit-card-usage/credit-card-usage"
import { RecentTransactions } from "@/components/home/recent-transactions/recent-transactions"

export function HomeClient() {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(
    TimeRangeEnum.THIS_MONTH
  )
  const dateRange: DateRange = resolveDateRange(timeRange)

  return (
    <div className="mx-auto mt-3 flex w-full max-w-4xl flex-1 flex-col gap-3">
      <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
      <BudgetConsumption dateRange={dateRange} />
      <CreditCardUsage dateRange={dateRange} />
      <RecentTransactions dateRange={dateRange} />
    </div>
  )
}
