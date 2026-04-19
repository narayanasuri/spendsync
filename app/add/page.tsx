"use client"

import { LogForm } from "@/components/add/log-form/log-form"

export default function AddPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            New Transaction
          </h2>
        </div>

        <LogForm />
      </main>
    </div>
  )
}
