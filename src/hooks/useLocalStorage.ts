import { useCallback, useEffect, useRef, useState } from 'react'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const isMounted = useRef(false)
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch (error) {
      console.warn(`Failed to read localStorage key: ${key}`, error)
      return initialValue
    }
  })

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to persist localStorage key: ${key}`, error)
    }
  }, [key, value])

  const updateValue = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof updater === 'function' ? (updater as (value: T) => T)(prev) : updater,
    )
  }, [])

  return [value, updateValue] as const
}
