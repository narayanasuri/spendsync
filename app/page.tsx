import { HomeClient } from "@/components/home/home-client"

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Hello, Suri!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's your expense summary for the month
        </p>
        <HomeClient />
      </div>
    </main>
    // <div className="flex min-h-screen flex-col">
    //   <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-3 p-6">
    //     <h2 className="text-xl font-semibold tracking-tight">Hello, Suri!</h2>
    //     <p className="text-sm text-muted-foreground">
    //       Here's your expense summary for the month
    //     </p>
    //     <HomeClient />
    //   </main>
    // </div>
  )
}
