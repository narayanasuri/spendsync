"use client"

import { useAppStore } from "@/lib/store"

export const useCategory = (categoryId: number) => {
  const { categories } = useAppStore()
  const category = categories.find((c) => c.id === categoryId)

  return {
    found: !!category,
    emoji: category?.icon || "❓",
    label: category?.name || "Unknown",
  }
}
