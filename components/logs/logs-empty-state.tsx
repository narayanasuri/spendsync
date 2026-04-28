import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { BadgeIndianRupeeIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

export function LogsEmptyState() {
  return (
    <Empty className="my-[25%] w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-8">
          <BadgeIndianRupeeIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No expenses found.</EmptyTitle>
        <EmptyDescription>
          Try changing the dates or removing any filters if applied.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/add" replace>
            <PlusIcon />
            Add New
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
