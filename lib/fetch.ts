/**
 * Drop-in fetch wrapper that injects x-pwa-auth from localStorage
 * when running in PWA standalone mode where cookies may not persist.
 */
export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const pwaAuth =
    typeof window !== "undefined" ? localStorage.getItem("pwa_auth") : null

  if (!pwaAuth) return fetch(input, init)

  const headers = new Headers(init?.headers)
  headers.set("x-pwa-auth", pwaAuth)

  return fetch(input, { ...init, headers })
}
