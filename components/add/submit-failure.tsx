"use client"

import { CircleAlertIcon, RefreshCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const SubmitFailure = ({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) => {
  return (
    <Empty className="h-full bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Failed</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {message}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcwIcon />
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  )
}
