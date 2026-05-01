"use client"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useLogDrawerStore } from "@/lib/log-drawer-store"
import { BadgeIndianRupeeIcon, PlusIcon } from "lucide-react"

export const LogsEmptyState = () => {
  const { openDrawer } = useLogDrawerStore()

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
        <Button variant="outline" onClick={() => openDrawer()}>
          <PlusIcon />
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}
