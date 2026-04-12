import { HomeClient } from "@/components/home/home-client"

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Expense Summary</p>
        <HomeClient />
      </div>
    </main>
  )
}
