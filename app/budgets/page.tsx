"use client"

import { BudgetCard } from "@/components/budgets/budget-card"
import { BudgetDrawer } from "@/components/budgets/budget-drawer"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useAppStore } from "@/lib/store"
import { Budget } from "@/lib/types"
import { PlusIcon, WalletCardsIcon } from "lucide-react"
import { useState } from "react"

export default function BudgetsPage() {
  const [open, setOpen] = useState<boolean>(false)
  const { budgets } = useAppStore()
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingBudget(undefined)
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Budgets</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Add new budget"
          onClick={() => handleOpenChange(true)}
        >
          <PlusIcon />
        </Button>
      </div>

      {budgets.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WalletCardsIcon />
            </EmptyMedia>
            <EmptyTitle>No budgets found.</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(true)}
            >
              Add New
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <div className="flex flex-wrap">
        {budgets.map((budget) => (
          <div key={budget.id} className="basis-1/2 px-1.5 md:basis-1/4">
            <BudgetCard budget={budget} />
          </div>
        ))}
      </div>

      <BudgetDrawer
        open={open}
        onOpenChange={handleOpenChange}
        budget={editingBudget}
      />
    </main>
  )
}
