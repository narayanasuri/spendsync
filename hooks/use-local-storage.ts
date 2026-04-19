import { useState } from "react"

export function useLocalStorage(key: string, initialValue: string) {
  // Initialize state with value from local storage or the provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: string) => {
    try {
      // Save state
      setStoredValue(value)

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error setting to localStorage:", error)
    }
  }

  return [storedValue, setValue]
}
