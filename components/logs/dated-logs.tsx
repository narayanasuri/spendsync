"use client"

import { useCurrency } from "@/hooks/use-currency"
import { useGroupedLogs } from "@/hooks/use-grouped-logs"
import { Expense, GroupedLogsType } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { LogItem } from "./log-item"
import { abbreviate } from "@/lib/utils"

const GroupView = ({ group }: { group: GroupedLogsType }) => {
  const total = group.logs.reduce((acc, log) => {
    if (log.transaction_type === "expense") {
      return acc - log.amount
    } else {
      return acc + log.amount
    }
  }, 0)

  const {
    currency: { symbol },
  } = useCurrency()

  return (
    <div className="my-6">
      <div className="flex justify-between">
        <p className="font-semibold text-muted-foreground uppercase">
          {group.group}
        </p>
        <p className="font-semibold text-muted-foreground">
          {total < 0
            ? `-${symbol}${abbreviate(-1 * total)}`
            : `${symbol}${abbreviate(total)}`}
        </p>
      </div>
      <Separator className="mt-1 mb-4 h-[2px]" />
      <div className="flex w-full flex-col gap-3">
        {group.logs.map((log) => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}

export const DatedLogs = ({ logs }: { logs: Expense[] }) => {
  const groups = useGroupedLogs(logs)

  return (
    <>
      {groups.map((group) => (
        <GroupView key={group.group} group={group} />
      ))}
    </>
  )
}
