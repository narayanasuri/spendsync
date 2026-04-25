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
import { useAppStore } from "@/lib/store"
import { User } from "@/lib/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User // present → edit mode
}

export function UserDrawer({ open, onOpenChange, user }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { refreshUsers } = useAppStore()
  const isEditing = !!user

  const title = isEditing ? "Update User" : "Add User"

  async function handleDelete() {
    if (!user) return
    await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    })
    await refreshUsers()
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
          <UserForm user={user} onSuccess={() => onOpenChange(false)} />
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
          <UserForm
            user={user}
            onSuccess={() => onOpenChange(false)}
            className="px-0"
          />
        </div>
        <DrawerFooter className="pt-2">
          {isEditing && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={!!user.default}
            >
              Delete
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function UserForm({
  user,
  onSuccess,
  className,
}: {
  user?: User
  onSuccess: () => void
  className?: string
}) {
  const { refreshUsers } = useAppStore()
  const isEditing = !!user

  const [name, setName] = useState(user?.name ?? "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Username is required.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const url = isEditing ? `/api/users/${user.id}` : "/api/users"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.")
        return
      }

      await refreshUsers()
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
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="Bob"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
    </form>
  )
}
