"use client"

import { useCategories } from "@/lib/queries"

export const useCategory = (categoryId: number) => {
  const { data: categories = [] } = useCategories()
  const category = categories.find((c) => c.id === categoryId)

  return {
    found: !!category,
    emoji: category?.icon || "❓",
    label: category?.name || "Unknown",
  }
}
