"use client"

import { Fragment, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, PlusIcon, ShoppingBasketIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryDrawer } from "@/components/settings/category-drawer"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useBackButton } from "@/hooks/use-back-button"

function EmptyCategoriesState({ onOpen }: { onOpen: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBasketIcon />
        </EmptyMedia>
        <EmptyTitle>No categories added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onOpen}>
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function CategoriesSettingsPage() {
  const { categories } = useAppStore()
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")
  const [open, setOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<
    (typeof categories)[0] | undefined
  >()
  const back = useBackButton("/settings")

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingCategory(undefined)
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
          <TabsList className="mb-2">
            <TabsTrigger
              value="expense"
              className="text-base"
              onClick={() => setActiveTab("expense")}
            >
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="text-base"
              onClick={() => setActiveTab("income")}
            >
              Income
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <div className="flex w-full flex-col rounded-md bg-muted">
              {categories.filter((category) => category.type === "expense")
                .length === 0 && (
                <EmptyCategoriesState onOpen={() => handleOpenChange(true)} />
              )}
              {categories
                .filter((category) => category.type === "expense")
                .map((category, index) => (
                  <Fragment key={category.id}>
                    {index > 0 && <Separator key={`sep-${category.id}`} />}
                    <Item
                      key={`item-${category.id}`}
                      className="h-[50px]"
                      onClick={() => {
                        setEditingCategory(category)
                        setOpen(true)
                      }}
                    >
                      <ItemContent>
                        <ItemTitle className="text-base">
                          <span className="mr-1">{category.icon}</span>{" "}
                          {category.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <span
                          className="size-5 rounded-md"
                          style={{ backgroundColor: category.color }}
                        />
                      </ItemActions>
                    </Item>
                  </Fragment>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="income">
            <div className="flex w-full flex-col rounded-md bg-muted">
              {categories.filter((category) => category.type === "income")
                .length === 0 && (
                <EmptyCategoriesState onOpen={() => handleOpenChange(true)} />
              )}
              {categories
                .filter((category) => category.type === "income")
                .map((category, index) => (
                  <Fragment key={category.id}>
                    {index > 0 && <Separator key={`sep-${category.id}`} />}
                    <Item
                      key={`item-${category.id}`}
                      className="h-[50px]"
                      onClick={() => {
                        setEditingCategory(category)
                        setOpen(true)
                      }}
                    >
                      <ItemContent>
                        <ItemTitle className="text-base">
                          <span className="mr-1">{category.icon}</span>{" "}
                          {category.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <span
                          className="size-5 rounded-md"
                          style={{ backgroundColor: category.color }}
                        />
                      </ItemActions>
                    </Item>
                  </Fragment>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-3 flex w-full items-center justify-center">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => handleOpenChange(true)}
          >
            <PlusIcon />
            Add New
          </Button>
        </div>

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
