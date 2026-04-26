"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  PlusIcon,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryDrawer } from "@/components/settings/category-drawer"
import { useBackButton } from "@/hooks/use-back-button"
import { CategoriesList } from "@/components/settings/categories-list"
import type { Category } from "@/lib/types"

export default function CategoriesSettingsPage() {
  const { categories } = useAppStore()
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")
  const [open, setOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const back = useBackButton("/settings")

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingCategory(undefined)
  }

  const onAddCategory = () => handleOpenChange(true)

  const onEditCategory = (category: Category) => {
    setEditingCategory(category)
    setOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon-xs" onClick={back}>
            <ArrowLeftIcon />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Add new category"
            onClick={() => handleOpenChange(true)}
          >
            <PlusIcon />
          </Button>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsList className="mb-2 w-full">
            <TabsTrigger
              value="expense"
              className="text-base"
              onClick={() => setActiveTab("expense")}
            >
              <BanknoteArrowUpIcon />
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="text-base"
              onClick={() => setActiveTab("income")}
            >
              <BanknoteArrowDownIcon />
              Income
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <CategoriesList
              categories={categories.filter(({ type }) => type === "expense")}
              onAdd={onAddCategory}
              onEdit={onEditCategory}
            />
          </TabsContent>
          <TabsContent value="income">
            <CategoriesList
              categories={categories.filter(({ type }) => type === "income")}
              onAdd={onAddCategory}
              onEdit={onEditCategory}
            />
          </TabsContent>
        </Tabs>

        <CategoryDrawer
          open={open}
          onOpenChange={handleOpenChange}
          category={editingCategory}
          defaultType={activeTab}
        />
      </main>
    </div>
  )
}
