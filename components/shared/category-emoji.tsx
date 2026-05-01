"use client"

import { useAppStore } from "@/lib/store"

export const CategoryEmoji = ({ categoryId }: { categoryId: number }) => {
  const { categories } = useAppStore()

  return categories.find((c) => c.id === categoryId)?.icon || "❓"
}
