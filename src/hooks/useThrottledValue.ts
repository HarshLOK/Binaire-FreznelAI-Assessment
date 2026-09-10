import { useEffect, useRef, useState } from 'react'

export const useThrottledValue = <T,>(value: T, waitMs: number): T => {
  const [throttled, setThrottled] = useState(value)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastUpdateRef.current

    if (elapsed >= waitMs) {
      lastUpdateRef.current = now
      setThrottled(value)
      return
    }

    const timer = window.setTimeout(() => {
      lastUpdateRef.current = Date.now()
      setThrottled(value)
    }, waitMs - elapsed)

    return () => {
      window.clearTimeout(timer)
    }
  }, [value, waitMs])

  return throttled
}
