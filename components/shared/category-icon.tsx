"use client"

import { COLORS } from "@/lib/constants"
import { useCategories } from "@/lib/queries"

export const CategoryIcon = ({
  categoryId,
  onlyIcon = true,
  size = 40,
  iconSize = 20,
}: {
  categoryId: number
  onlyIcon?: boolean
  size?: number
  iconSize?: number
}) => {
  const { data: categories = [] } = useCategories()

  const category = categories.find((c) => c.id === categoryId)

  const emoji = category?.icon || "❓"

  if (onlyIcon) return <span className={`text-[${size}px]`}>{emoji}</span>

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        backgroundColor: category?.color ?? COLORS[0].value,
      }}
    >
      <span style={{ fontSize: iconSize }}>{emoji}</span>
    </div>
  )
}
