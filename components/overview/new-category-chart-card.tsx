"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMediaQuery } from "@/hooks/use-media-query"

export const description = "A mixed bar chart"

const chartData = [
  { category: "chrome", amount: 275, fill: "var(--color-chrome)" },
  { category: "safari", amount: 200, fill: "var(--color-safari)" },
  { category: "firefox", amount: 187, fill: "var(--color-firefox)" },
  { category: "edge", amount: 173, fill: "var(--color-edge)" },
  { category: "other", amount: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  amount: {
    label: "Amount",
  },
  chrome: {
    label: "🍕",
    color: "var(--chart-1)",
  },
  safari: {
    label: "🎬",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "🛍️",
    color: "var(--chart-3)",
  },
  edge: {
    label: "🥡",
    color: "var(--chart-4)",
  },
  other: {
    label: "🛵",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function NewCategoryChartCard() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Card size="sm" className="w-full">
      <CardHeader>
        <CardTitle>Top 5 Categories</CardTitle>
        <CardDescription>Categories most spent on this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="md:h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -26,
              right: 0,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={4}
              tick={{
                fontSize: 20,
              }}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="amount" radius={5} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
