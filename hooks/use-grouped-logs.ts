import { Expense, GroupedLogsType } from "@/lib/types"
import { parseTimestamp } from "@/lib/utils"
import { format, isSameYear } from "date-fns"
import { useEffect, useMemo, useState } from "react"

const LOG_GROUP_DATE_FORMAT = "EEE, d MMM"
const LOG_GROUP_DATE_FORMAT_YEAR = "EEE, d MMM, YYYY"

export const useGroupedLogs = (logs: Expense[]): GroupedLogsType[] => {
  const [groups, setGroups] = useState<GroupedLogsType[]>([])

  const groupNameDateFormat = useMemo<string>(() => {
    if (logs.length === 0) return LOG_GROUP_DATE_FORMAT

    const firstDate = parseTimestamp(logs[0].spent_at)
    const lastDate = parseTimestamp(logs[logs.length - 1].spent_at)

    return isSameYear(firstDate, lastDate)
      ? LOG_GROUP_DATE_FORMAT
      : LOG_GROUP_DATE_FORMAT_YEAR
  }, [logs])

  useEffect(() => {
    const grouped: GroupedLogsType[] = []

    for (const log of logs) {
      const groupName = format(
        parseTimestamp(log.spent_at),
        groupNameDateFormat
      )
      const existingGroup = grouped.find((group) => group.group === groupName)

      if (existingGroup) {
        existingGroup.logs.push(log)
      } else {
        grouped.push({
          group: groupName,
          logs: [log],
        })
      }
    }

    setGroups(grouped)
  }, [logs])

  return groups
}
