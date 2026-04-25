"use client"

import { Fragment, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, PencilIcon, PlusIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { User } from "@/lib/types"
import { UserDrawer } from "@/components/settings/user-drawer"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function EmptyUsersState({ onOpen }: { onOpen: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>No users added</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onOpen}>
          Add New
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function UsersSettingsPage() {
  const { users } = useAppStore()
  const [open, setOpen] = useState<boolean>(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) setEditingUser(undefined)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon-xs" asChild>
              <ArrowLeftIcon />
            </Button>
          </Link>
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

        <div className="flex w-full flex-col rounded-md bg-muted">
          {users.length === 0 && (
            <EmptyUsersState onOpen={() => handleOpenChange(true)} />
          )}
          {users.map((user, index) => (
            <Fragment key={user.id}>
              {index > 0 && <Separator key={`sep-${user.id}`} />}
              <Item key={`item-${user.id}`}>
                <ItemContent>
                  <ItemTitle className="text-base">{user.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="icon-sm"
                    aria-label="Edit Payment Method"
                    variant="ghost"
                    onClick={() => {
                      setEditingUser(user)
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

        <UserDrawer
          open={open}
          onOpenChange={handleOpenChange}
          user={editingUser}
        />
      </main>
    </div>
  )
}
