import { CATEGORIES } from "@/config"
import { CircleQuestionMarkIcon } from "lucide-react"

const iconMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.icon]))

function Icon({ category, size }: { category: string; size: number }) {
  const LucideIcon = iconMap[category] ?? CircleQuestionMarkIcon
  return <LucideIcon size={size} />
}

export function CategoryIcon({
  category,
  onlyIcon = true,
  size = 40,
}: {
  category: string
  onlyIcon?: boolean
  size?: number
}) {
  if (onlyIcon) return <Icon category={category} size={size} />

  const iconSize = Math.round(size * 0.5)

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-sm bg-muted"
      style={{ width: size, height: size }}
    >
      <Icon category={category} size={iconSize} />
    </div>
  )
}
