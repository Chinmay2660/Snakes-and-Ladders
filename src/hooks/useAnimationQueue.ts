import { useCallback, useRef, useState } from 'react'

export const useAnimationQueue = () => {
  const chain = useRef(Promise.resolve())
  const [isAnimating, setIsAnimating] = useState(false)

  const enqueue = useCallback((task: () => Promise<void> | void) => {
    chain.current = chain.current
      .catch(() => undefined)
      .then(async () => {
        setIsAnimating(true)
        await task()
      })
      .finally(() => {
        setIsAnimating(false)
      })
  }, [])

  return { enqueue, isAnimating }
}
