import { useState, useEffect } from "react"

const LOCAL_STORAGE_KEY = "user"

export const useLastSelectedUser = () => {
  // 1. Start with the default to match the Server-Side Render
  const [user, setUser] = useState<number>(1)

  // 2. Sync with localStorage only after the component mounts
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (item) {
        // Since you store it with JSON.stringify(number),
        // JSON.parse(item) returns a number directly.
        setUser(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }, [])

  const updateUser = (id: number) => {
    try {
      setUser(id)
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(id))
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  return { user, updateUser }
}
