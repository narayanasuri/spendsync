"use client"

import { useCategories } from "@/lib/queries"

export const CategoryEmoji = ({ categoryId }: { categoryId: number }) => {
  const { data: categories = [] } = useCategories()

  return categories.find((c) => c.id === categoryId)?.icon || "❓"
}
