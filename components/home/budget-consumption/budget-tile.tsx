import { abbreviate } from "@/lib/utils"
import { CategoryEnum } from "@/lib/enums"
import { CATEGORY_LABEL } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"

const SIZE = 48
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function CircularProgress({ percentage }: { percentage: number }) {
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE
  const isOver = percentage >= 100

  return (
    <svg width={SIZE} height={SIZE} className="shrink-0 -rotate-90">
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        className="text-muted-foreground/20"
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={isOver ? "text-destructive" : "text-primary"}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  )
}

type IProps = {
  category: CategoryEnum
  spent: number
  budget: number
}

export function BudgetTile({ category, spent, budget }: IProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const isOver = spent > budget

  return (
    <Card className="w-full flex-row py-0 sm:flex-1">
      <CardContent className="flex w-full items-center gap-3 py-3">
        <CircularProgress percentage={percentage} />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">
            {CATEGORY_LABEL[category]}
          </span>
          <span
            className={`text-base font-semibold tabular-nums ${isOver ? "text-destructive" : ""}`}
          >
            ₹{abbreviate(spent)}
          </span>
          <span className="text-xs text-muted-foreground">
            {percentage.toFixed(0)}% of ₹{abbreviate(budget)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
