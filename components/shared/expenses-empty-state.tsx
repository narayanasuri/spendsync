import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { BadgeIndianRupeeIcon } from "lucide-react"
import Link from "next/link"

export function ExpensesEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BadgeIndianRupeeIcon />
        </EmptyMedia>
        <EmptyTitle>No expenses found.</EmptyTitle>
        <EmptyDescription>
          No expenses found, add a new expense below
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" asChild>
          <Link href="/add">Add New</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
