"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { abbreviate, formatToLocalDate } from "@/lib/utils"
import { useCurrency } from "@/hooks/use-currency"
import { startOfMonth } from "date-fns"
import { GroupedItem } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { COLORS } from "@/lib/constants"

const DATE_NOW = new Date()
const DATE_FROM = startOfMonth(DATE_NOW)

const COLOR_CLASSES = [
  "bg-blue-400",
  "bg-rose-400",
  "bg-teal-400",
  "bg-fuchsia-300",
  "bg-amber-300",
]

export function CategoryChartCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-14 w-full" />
      </CardContent>
    </Card>
  )
}

function HoverLegend({
  label,
  amount,
  colorString,
  children,
}: {
  label: string
  amount: number
  colorString: string
  children: ReactNode
}) {
  const {
    currency: { symbol },
  } = useCurrency()

  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="flex w-auto min-w-[128px] gap-1.5">
        <span
          className="h-[34px] w-[4px] rounded-md"
          style={{ backgroundColor: colorString }}
        />
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-xs font-medium">{label}</p>
          <div className="flex w-full justify-between">
            <p className="text-xs font-normal text-muted-foreground">Amount</p>
            <p className="text-xs font-medium">
              {symbol}
              {abbreviate(amount)}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function CategoryChartCard() {
  const {
    currency: { symbol },
  } = useCurrency()
  const { categories, hydrated, loading } = useAppStore()
  const [groups, setGroups] = useState<GroupedItem<"category">[]>([])

  useEffect(() => {
    fetch(
      `/api/logs/group?group=category&from=${formatToLocalDate(DATE_FROM)}&to=${formatToLocalDate(DATE_NOW)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setGroups(data)
      })
  }, [])

  const items = useMemo(() => {
    const sliced = groups.sort((a, b) => b.sum - a.sum).slice(0, 5)

    const total = sliced.reduce((a, b) => a + b.sum, 0)

    return sliced.map((item, i) => {
      const category = categories.find((c) => c.id === item.category)
      return {
        categoryId: item.category,
        categoryName: category?.name || "Unknown",
        categoryEmoji: category?.icon || "❓",
        sum: item.sum,
        color: category?.color || COLOR_CLASSES[i],
        percentage: Math.round((item.sum / total) * 100),
      }
    })
  }, [categories, groups])

  return !hydrated || loading ? (
    <CategoryChartCardSkeleton />
  ) : (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Top 5 Categories</CardTitle>
        <CardDescription className="font-medium">
          Categories most spent on this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[26px] w-full rounded-md bg-muted">
          {items.map((item, index) => {
            return (
              <HoverLegend
                key={item.categoryId}
                label={item.categoryName}
                amount={item.sum}
                colorString={item.color}
              >
                <span
                  className={`h-full ${
                    index === 0
                      ? "rounded-s-md"
                      : index === items.length - 1
                        ? "rounded-e-md"
                        : "rounded-none"
                  }`}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </HoverLegend>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex w-full flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.categoryId}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-[12px] w-[12px] rounded-xs"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-medium">
                  {item.categoryEmoji} {item.categoryName}
                </p>
              </div>
              <Button variant="link" asChild className="p-0">
                <Link href={`/logs?categoryId=${item.categoryId}`} replace>
                  {symbol}
                  {abbreviate(item.sum)}
                  <ArrowUpRightIcon />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
