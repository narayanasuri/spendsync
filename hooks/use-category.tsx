import { useAppStore } from "@/lib/store"

export function useCategory(categoryId: number) {
  const { categories } = useAppStore()
  const category = categories.find((c) => c.id === categoryId)

  return {
    found: !!category,
    emoji: category?.icon || "❓",
    label: category?.name || "Unknown",
  }
}
