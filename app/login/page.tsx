"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? "/"

  function onLogin() {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(async (res) => {
        if (res.ok) {
          router.replace(from)
        } else {
          setError(true)
          setLoading(false)
        }
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="mb-1 text-xl font-semibold">cheeez.</h1>

        <Field>
          {!error && (
            <FieldDescription>
              If you're trying to sign up, you shouldn't be here
            </FieldDescription>
          )}
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
          {error && <FieldError>Login failed</FieldError>}
        </Field>
        <Button onClick={onLogin} disabled={loading} className="mt-1.5 w-full">
          {loading && <Spinner data-icon="inline-start" />}
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  )
}
