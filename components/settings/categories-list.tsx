"use client"

import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, ShoppingBasketIcon } from "lucide-react"
import { Category } from "@/lib/types"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

function EmptyCategoriesState({ onAdd }: { onAdd: () => void }) {
  return (
    <Empty className="my-[25%] w-full md:my-[40%]">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-8">
          <ShoppingBasketIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No categories added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onAdd}>
          <PlusIcon />
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function CategoriesList({
  categories,
  onAdd,
  onEdit,
}: {
  categories: Category[]
  onAdd: () => void
  onEdit: (category: Category) => void
}) {
  if (categories.length === 0) {
    return <EmptyCategoriesState onAdd={onAdd} />
  }

  return (
    <ItemGroup className="gap-1">
      {categories.map((category, index) => (
        <Fragment key={category.id}>
          <Item onClick={() => onEdit(category)}>
            <ItemContent>
              <ItemTitle className="text-base">
                <span className="mr-1">{category.icon}</span> {category.name}
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <span
                className="size-5 rounded-md"
                style={{ backgroundColor: category.color }}
              />
            </ItemActions>
          </Item>
          {index !== categories.length - 1 && (
            <ItemSeparator className="m-0 w-full" />
          )}
        </Fragment>
      ))}
      <Item onClick={onAdd}>
        <ItemContent>
          <Button variant="ghost">
            <PlusIcon />
            Add New
          </Button>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
