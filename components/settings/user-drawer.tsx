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
import { useDeleteUserMutation, useUserMutation } from "@/lib/queries"
import { User } from "@/lib/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User // present → edit mode
}

export const UserDrawer = ({ open, onOpenChange, user }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const deleteMutation = useDeleteUserMutation()
  const isEditing = !!user

  const title = isEditing ? "Update User" : "Add User"

  const handleDelete = () => {
    if (!user) return
    deleteMutation.mutate(user.id.toString(), {
      onSuccess: () => onOpenChange(false),
    })
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
        <DrawerFooter className="mt-1 mb-3">
          {isEditing && (
            <Button
              variant="destructive"
              className="mb-4 w-full"
              onClick={handleDelete}
              disabled={!!user.default}
            >
              Delete
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const UserForm = ({
  user,
  onSuccess,
  className,
}: {
  user?: User
  onSuccess: () => void
  className?: string
}) => {
  const [name, setName] = useState(user?.name ?? "")
  const isEditing = !!user

  const mutation = useUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    mutation.mutate(
      { name: name.trim(), id: user?.id.toString() },
      {
        onSuccess: () => onSuccess(),
      }
    )
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {mutation.isError && (
              <FieldError>{mutation.error.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
    </form>
  )
}
