"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { SmilePlusIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker"
import { useAppStore } from "@/lib/store"
import { Category } from "@/lib/types"
import { LogTypeSelect } from "@/components/shared/log-type-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { COLORS } from "@/lib/constants"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: "expense" | "income"
  category?: Category // present → edit mode
}

export function CategoryDrawer({
  open,
  onOpenChange,
  category,
  defaultType = "expense",
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { refreshCategories } = useAppStore()
  const isEditing = !!category

  const title = isEditing ? "Update Category" : "Add Category"

  async function handleDelete() {
    if (!category) return
    await fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    })
    await refreshCategories()
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={category}
            onSuccess={() => onOpenChange(false)}
          />
          {isEditing && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <CategoryForm
            category={category}
            onSuccess={() => onOpenChange(false)}
            defaultType={defaultType}
            className="px-0"
          />
        </div>
        <DrawerFooter className="pt-2">
          {isEditing && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function CategoryForm({
  category,
  onSuccess,
  defaultType = "expense",
  className,
}: {
  category?: Category
  onSuccess: () => void
  defaultType?: "expense" | "income"
  className?: string
}) {
  const { refreshCategories } = useAppStore()
  const isEditing = !!category

  const [icon, setIcon] = useState(category?.icon ?? "❓")
  const [name, setName] = useState(category?.name ?? "")
  const [type, setType] = useState<"expense" | "income">(
    (category?.type as "expense" | "income") ?? defaultType
  )
  const [color, setColor] = useState<string>(category?.color ?? COLORS[0].value)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Category name is required.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const url = isEditing
        ? `/api/categories/${category.id}`
        : "/api/categories"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon || null,
          type,
          color,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.")
        return
      }

      await refreshCategories()
      onSuccess()
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <div className="flex items-center justify-center">
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xl"
                    aria-label="Select an emoji"
                    className="text-base"
                    style={{ backgroundColor: color }}
                  >
                    {icon ? (
                      <span className="text-[32px]">{icon}</span>
                    ) : (
                      <SmilePlusIcon className="text-lg" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                  <EmojiPicker
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => {
                      setEmojiOpen(false)
                      setIcon(emoji)
                    }}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>
            </div>
            {error && <FieldError>{error}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="e.g. Shopping"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <Select
              defaultValue={COLORS[0].value}
              value={color}
              onValueChange={(value) => setColor(value)}
            >
              <SelectTrigger
                id="transactionType"
                className="text-base md:text-sm"
              >
                <SelectValue placeholder="Select a transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COLORS.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-base md:text-sm"
                    >
                      <span
                        className="size-4 rounded-sm"
                        style={{ backgroundColor: value }}
                      ></span>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <LogTypeSelect value={type} onChange={(v) => setType(v)} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
    </form>
  )
}
