"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { useAppStore } from "@/lib/store"
import { Budget } from "@/lib/types"
import { CategorySelect } from "../shared/category-select"
import { PeriodSelect } from "../shared/period-select"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: Budget // present → edit mode
}

export function BudgetDrawer({ open, onOpenChange, budget }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { refreshBudgets } = useAppStore()
  const isEditing = !!budget

  const title = isEditing ? "Modify Budget" : "New Budget"

  async function handleDelete() {
    if (!budget) return
    await fetch(`/api/budgets/${budget.id}`, {
      method: "DELETE",
    })
    await refreshBudgets()
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <BudgetForm budget={budget} onSuccess={() => onOpenChange(false)} />
          {isEditing && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <BudgetForm
            budget={budget}
            onSuccess={() => onOpenChange(false)}
            className="px-0"
          />
        </div>
        <DrawerFooter className="mt-1 mb-3">
          {isEditing && (
            <Button
              variant="destructive"
              className="mb-4 w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function BudgetForm({
  budget,
  onSuccess,
  className,
}: {
  budget?: Budget
  onSuccess: () => void
  className?: string
}) {
  const { refreshBudgets } = useAppStore()
  const isEditing = !!budget

  const [limit, setLimit] = useState(budget?.budget_amount ?? 1000)
  const [period, setPeriod] = useState(budget?.period ?? "monthly")
  const [user, setUser] = useState(budget?.user)
  const [category, setCategory] = useState(budget?.category_id.toString() || "")

  const [serverError, setServerError] = useState<string | null>(null)
  const [limitError, setLimitError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!limit) {
      setLimitError("Limit is required.")
      return
    }

    if (!category) {
      setCategoryError("Category is required.")
      return
    }

    setLimitError(null)
    setCategoryError(null)
    setLoading(true)

    try {
      const url = isEditing ? `/api/budgets/${budget.id}` : "/api/budgets"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget_amount: limit,
          category_id: category,
          user,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong.")
        return
      }

      await refreshBudgets()
      onSuccess()
    } catch {
      setServerError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <CategorySelect
              value={category}
              onChange={setCategory}
              transactionType="expense"
            />
            {categoryError && <FieldError>{categoryError}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="budget">Period</FieldLabel>
            <PeriodSelect value={period} onChange={setPeriod} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="budget">Budget Amount</FieldLabel>
            <Input
              id="budget"
              type="number"
              autoComplete="off"
              placeholder="Enter the budget amount"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
            />
            {limitError && <FieldError>{limitError}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
    </form>
  )
}
