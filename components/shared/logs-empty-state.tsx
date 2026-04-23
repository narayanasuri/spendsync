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

export function LogsEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BadgeIndianRupeeIcon />
        </EmptyMedia>
        <EmptyTitle>No expenses found.</EmptyTitle>
        <EmptyDescription>
          Try changing the dates or removing any filters if applied.
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
