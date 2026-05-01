"use client"

import { useState } from "react"
import { useUsers } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { useBackButton } from "@/hooks/use-back-button"
import { User } from "@/lib/types"
import { UsersList } from "@/components/settings/user-list"
import { UserDrawer } from "@/components/settings/user-drawer"

export default () => {
  const { data: users = [] } = useUsers()
  const [open, setOpen] = useState<boolean>(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const back = useBackButton("/settings")

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingUser(undefined)
  }

  const onAddPaymentMethod = () => handleOpenChange(true)

  const onEditPaymentMethod = (user: User) => {
    setEditingUser(user)
    setOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Go back to settings"
            onClick={back}
          >
            <ArrowLeftIcon />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Users</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Add new user"
            onClick={() => handleOpenChange(true)}
          >
            <PlusIcon />
          </Button>
        </div>

        <UsersList
          users={users}
          onAdd={onAddPaymentMethod}
          onEdit={onEditPaymentMethod}
        />

        <UserDrawer
          open={open}
          onOpenChange={handleOpenChange}
          user={editingUser}
        />
      </main>
    </div>
  )
}
