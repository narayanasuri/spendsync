import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useBackButton } from "@/hooks/use-back-button"
import { BrushCleaningIcon } from "lucide-react"

export function LogNotFound() {
  const back = useBackButton("logs")

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
        <Button variant="outline" size="sm" onClick={back}>
          View all expenses
        </Button>
      </EmptyContent>
    </Empty>
  )
}
