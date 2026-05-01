"use client"

import { BudgetCardSkeleton } from "@/components/budgets/budget-card"
import { BudgetDrawer } from "@/components/budgets/budget-drawer"
import { BudgetList } from "@/components/budgets/budget-list"
import { Button } from "@/components/ui/button"
import { useBudgets } from "@/lib/queries"
import { Budget } from "@/lib/types"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export default () => {
  const [open, setOpen] = useState<boolean>(false)
  const { data: budgets = [], isLoading } = useBudgets()
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingBudget(undefined)
  }

  const onAddBudget = () => handleOpenChange(true)

  const onEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex h-[32px] items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Budgets</h2>
        </div>

        <div className="-mx-1.5 flex flex-wrap gap-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="basis-1/2 px-1.5 md:basis-1/4">
              <BudgetCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Budgets</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Add new budget"
          onClick={() => handleOpenChange(true)}
        >
          <PlusIcon />
        </Button>
      </div>

      <BudgetList budgets={budgets} onAdd={onAddBudget} onEdit={onEditBudget} />

      <BudgetDrawer
        open={open}
        onOpenChange={handleOpenChange}
        budget={editingBudget}
      />
    </main>
  )
}
