import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { PiggyBankIcon, PlusIcon } from "lucide-react"
import { Budget } from "@/lib/types"
import { BudgetCard } from "./budget-card"

function BudgetsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Empty className="my-[25%] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-8">
          <PiggyBankIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No budgets found</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onAdd}>
          <PlusIcon />
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function BudgetList({
  budgets,
  onAdd,
  onEdit,
}: {
  budgets: Budget[]
  onAdd: () => void
  onEdit: (budget: Budget) => void
}) {
  if (budgets.length === 0) return <BudgetsEmptyState onAdd={onAdd} />

  return (
    <>
      <div className="-mx-1.5 flex flex-wrap gap-y-3">
        {budgets.map((budget, index) => (
          <div key={budget.id} className="basis-1/2 px-1.5 md:basis-1/4">
            <BudgetCard
              budget={budget}
              onEdit={() => {
                onEdit(budget)
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex w-full items-center justify-center">
        <Button variant="outline" className="w-full md:w-auto" onClick={onAdd}>
          <PlusIcon />
          Add New
        </Button>
      </div>
    </>
  )
}
