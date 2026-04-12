export default async function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Hello, there!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your expense summary for the week
          </p>
        </div>
      </main>
    </div>
  )
}
