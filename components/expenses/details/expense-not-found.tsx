import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { BrushCleaningIcon } from "lucide-react"
import Link from "next/link"

export function ExpenseNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BrushCleaningIcon />
        </EmptyMedia>
        <EmptyTitle>Expense not found</EmptyTitle>
        <EmptyDescription>We could not find that expense</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" asChild>
          <Link href="/expenses">View all expenses</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
