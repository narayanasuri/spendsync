"use client"

import { Fragment, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, PencilIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryDrawer } from "@/components/settings/category-drawer"

export default function CategoriesSettingsPage() {
  const { categories } = useAppStore()
  const [open, setOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<
    (typeof categories)[0] | undefined
  >()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingCategory(undefined)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex gap-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon-xs" asChild>
              <ArrowLeftIcon />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
        </div>

        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <div className="flex w-full flex-col rounded-md bg-muted">
              {categories
                .filter((category) => category.type === "expense")
                .map((category, index) => (
                  <Fragment key={category.id}>
                    {index > 0 && <Separator key={`sep-${category.id}`} />}
                    <Item key={`item-${category.id}`} className="h-[50px]">
                      <ItemContent>
                        <ItemTitle>
                          <span className="mr-1">{category.icon}</span>{" "}
                          {category.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          size="icon-xs"
                          aria-label="Edit Category"
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category)
                            setOpen(true)
                          }}
                        >
                          <PencilIcon />
                        </Button>
                      </ItemActions>
                    </Item>
                  </Fragment>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="income">
            <div className="flex w-full flex-col rounded-md bg-muted">
              {categories
                .filter((category) => category.type === "income")
                .map((category, index) => (
                  <Fragment key={category.id}>
                    {index > 0 && <Separator key={`sep-${category.id}`} />}
                    <Item key={`item-${category.id}`} className="h-[50px]">
                      <ItemContent>
                        <ItemTitle>
                          <span className="mr-1">{category.icon}</span>{" "}
                          {category.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          size="icon-xs"
                          aria-label="Edit Category"
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category)
                            setOpen(true)
                          }}
                        >
                          <PencilIcon />
                        </Button>
                      </ItemActions>
                    </Item>
                  </Fragment>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          variant="outline"
          className="mt-3"
          onClick={() => handleOpenChange(true)}
        >
          <PlusIcon />
          Add New
        </Button>

        <CategoryDrawer
          open={open}
          onOpenChange={handleOpenChange}
          category={editingCategory}
        />
      </main>
    </div>
  )
}
