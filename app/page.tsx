"use client"

import {
  BalanceCard,
  BalanceCardSkeleton,
} from "@/components/overview/balance-card"
import {
  CategoryChartCard,
  CategoryChartCardSkeleton,
} from "@/components/overview/category-chart-card"
import {
  CreditCardLimitCardSkeleton,
  CreditLimitCard,
} from "@/components/overview/credit-limit-card"
import { useAppStore } from "@/lib/store"

function Skeleton() {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="-mx-1.5 flex flex-wrap gap-y-3">
        <BalanceCardSkeleton />
      </div>

      <div className="-mx-1.5 flex flex-wrap gap-y-3">
        <div className="basis-1/2 px-1.5 md:basis-1/4">
          <CreditCardLimitCardSkeleton />
        </div>
        <div className="basis-1/2 px-1.5 md:basis-1/4">
          <CreditCardLimitCardSkeleton />
        </div>
        <div className="basis-1/2 px-1.5 md:basis-1/4">
          <CreditCardLimitCardSkeleton />
        </div>
        <div className="basis-1/2 px-1.5 md:basis-1/4">
          <CreditCardLimitCardSkeleton />
        </div>
      </div>

      <CategoryChartCardSkeleton />
    </div>
  )
}

export default function OverviewPage() {
  const { paymentMethods, hydrated, loading } = useAppStore()

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
      </div>

      {!hydrated || loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="mt-3 mb-6 flex flex-col gap-3">
            <div className="-mx-1.5 flex flex-wrap gap-y-3">
              {paymentMethods
                .filter((method) => method.type === "savings")
                .map((method) => (
                  <div
                    key={method.id}
                    className="basis-1/2 px-1.5 md:basis-1/2"
                  >
                    <BalanceCard paymentMethod={method} />
                  </div>
                ))}
            </div>

            <div className="-mx-1.5 flex flex-wrap gap-y-3">
              {paymentMethods
                .filter((method) => method.type === "credit")
                .map((method) => (
                  <div
                    key={method.id}
                    className="basis-1/2 px-1.5 md:basis-1/4"
                  >
                    <CreditLimitCard paymentMethod={method} />
                  </div>
                ))}
            </div>

            <CategoryChartCard />
          </div>
        </>
      )}
    </main>
  )
}
