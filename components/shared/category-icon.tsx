import { useAppStore } from "@/lib/store"

export function CategoryIcon({
  categoryId,
  onlyIcon = true,
  size = 40,
  iconSize = 20,
}: {
  categoryId: number
  onlyIcon?: boolean
  size?: number
  iconSize?: number
}) {
  const { categories } = useAppStore()

  const emoji = categories.find((c) => c.id === categoryId)?.icon || "❓"

  if (onlyIcon) return <span className={`text-[${size}px]`}>{emoji}</span>

  const iconSizeClassName = `text-[${iconSize}px]`

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl bg-muted"
      style={{ width: size, height: size }}
    >
      <span className={iconSizeClassName}>{emoji}</span>
    </div>
  )
}
