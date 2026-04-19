import { useAppStore } from "@/lib/store"

export function CategoryIcon({
  categoryId,
  onlyIcon = true,
  size = 40,
}: {
  categoryId: number
  onlyIcon?: boolean
  size?: number
}) {
  const { categories } = useAppStore()

  const emoji = categories.find((c) => c.id === categoryId)?.icon || "❓"

  if (onlyIcon) return <span className={`text-[${size}px]`}>{emoji}</span>

  const iconSize = Math.round(size * 0.5)

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-sm bg-muted"
      style={{ width: size, height: size }}
    >
      <span className={`text-[${iconSize}px]`}>{emoji}</span>
    </div>
  )
}
