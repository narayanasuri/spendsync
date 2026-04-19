"use client"

import { BalanceCard } from "@/components/insights/balance-card"
import { CreditLimitCard } from "@/components/insights/credit-limit-card"
import { useAppStore } from "@/lib/store"

export default function InsightsPage() {
  const { paymentMethods } = useAppStore()

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Insights</h2>
      </div>

      <h3>Balances</h3>

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex w-full flex-wrap">
          {paymentMethods
            .filter((method) => method.type === "savings")
            .map((method) => (
              <BalanceCard key={method.id} paymentMethod={method} />
            ))}
        </div>

        <h3>Credit Card Usage</h3>

        <div className="flex flex-wrap">
          {paymentMethods
            .filter((method) => method.type === "credit")
            .map((method) => (
              <div key={method.id} className="basis-1/2 px-1.5 md:basis-1/4">
                <CreditLimitCard paymentMethod={method} />
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}
